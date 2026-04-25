const http = require("http");
const Database = require("better-sqlite3");
const path = require("path");

const PORT = process.env.PORT || 3002;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, "app.db");

const db = new Database(DB_PATH);
db.exec(`
  CREATE TABLE IF NOT EXISTS meetings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    meeting_date TEXT,
    transcript_raw TEXT NOT NULL,
    transcript_sanitized TEXT,
    transcript_sanitized_ja TEXT,
    speakers TEXT,
    sanitized INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_meetings_sanitized ON meetings(sanitized);
  CREATE INDEX IF NOT EXISTS idx_meetings_meeting_date ON meetings(meeting_date);

  CREATE TABLE IF NOT EXISTS participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS custom_words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sentences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    meeting_id INTEGER,
    text_en TEXT NOT NULL,
    text_ja TEXT,
    translated INTEGER NOT NULL DEFAULT 0,
    learned INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_sentences_translated ON sentences(translated);
  CREATE INDEX IF NOT EXISTS idx_sentences_learned ON sentences(learned);
  CREATE INDEX IF NOT EXISTS idx_sentences_meeting ON sentences(meeting_id);

  CREATE TABLE IF NOT EXISTS meeting_participants (
    meeting_id INTEGER NOT NULL,
    participant_id INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (meeting_id, participant_id),
    FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE CASCADE,
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS idx_mp_meeting ON meeting_participants(meeting_id);

  CREATE TABLE IF NOT EXISTS teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS team_members (
    team_id INTEGER NOT NULL,
    participant_id INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (team_id, participant_id),
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS idx_tm_team ON team_members(team_id);
`);

// Migration: add transcript_sanitized_ja column to existing DB
try {
  db.exec(`ALTER TABLE meetings ADD COLUMN transcript_sanitized_ja TEXT`);
} catch (e) {
  // already exists
}
try {
  db.exec(`ALTER TABLE participants ADD COLUMN avatar_uploaded_at TEXT`);
} catch (e) {
  // already exists
}

const AVATARS_DIR = path.join(__dirname, "avatars");
const fs = require("fs");
if (!fs.existsSync(AVATARS_DIR)) fs.mkdirSync(AVATARS_DIR, { recursive: true });

function nowIso() {
  return new Date().toISOString();
}

function escapeHtml(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parseFormData(body) {
  const params = new URLSearchParams(body);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
}

// Parse "Speaker: text" formatted transcript into turns.
// Continuation lines (no leading "Name:") are appended to the previous turn.
function parseSpeakerTurns(text) {
  if (!text) return [];
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const turns = [];
  const speakerRe = /^([A-Za-z][\wÀ-ÿ .'\-]{0,40}):\s*(.*)$/;
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.trim() === "") {
      if (turns.length) turns[turns.length - 1].text += "\n";
      continue;
    }
    const m = line.match(speakerRe);
    if (m) {
      turns.push({ speaker: m[1].trim(), text: m[2] });
    } else if (turns.length) {
      turns[turns.length - 1].text += "\n" + line;
    } else {
      turns.push({ speaker: "Unknown", text: line });
    }
  }
  for (const t of turns) t.text = t.text.trim();
  return turns;
}

// Color hash for speaker name -> hue (0-360)
function speakerHue(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h % 360;
}

function speakerInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function renderSpeakerTurns(turns, participantsByName = {}) {
  if (!turns.length) {
    return '<div class="tm-empty">サニタイズされた本文がありません。</div>';
  }
  return turns
    .map((t) => {
      const hue = speakerHue(t.speaker);
      const initials = escapeHtml(speakerInitials(t.speaker));
      const text = escapeHtml(t.text).replace(/\n/g, "<br>");
      const p = participantsByName[t.speaker];
      const inner = p && p.avatar_uploaded_at
        ? `<img src="/avatars/${p.id}.png?v=${Date.parse(p.avatar_uploaded_at) || 0}" alt="" class="avatar-img">`
        : initials;
      return `<div class="tm-turn">
        <div class="tm-avatar" style="background: oklch(0.78 0.10 ${hue}); color: oklch(0.22 0.04 ${hue}); overflow:hidden;">${inner}</div>
        <div class="tm-bubble">
          <div class="tm-spk" style="color: oklch(0.42 0.10 ${hue});">${escapeHtml(t.speaker)}</div>
          <div class="tm-utter">${text}</div>
        </div>
      </div>`;
    })
    .join("");
}

function preview(text, n = 100) {
  if (!text) return "";
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length > n ? flat.slice(0, n) + "…" : flat;
}

function layout(title, content, opts = {}) {
  const activeNav = opts.activeNav || "";
  return `<!DOCTYPE html>
<html lang="ja" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} - Transcript Memory</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Noto+Sans+JP:wght@400;500;600&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --accent-h: 210;
      --accent: oklch(0.55 0.13 var(--accent-h));
      --accent-weak: oklch(0.95 0.03 var(--accent-h));
      --accent-ring: oklch(0.55 0.13 var(--accent-h) / 0.25);
      --bg: oklch(0.985 0.003 85);
      --surface: oklch(1 0 0);
      --surface-2: oklch(0.975 0.004 85);
      --surface-3: oklch(0.955 0.005 85);
      --line: oklch(0.91 0.005 85);
      --line-strong: oklch(0.82 0.007 85);
      --ink: oklch(0.22 0.01 260);
      --ink-2: oklch(0.38 0.01 260);
      --ink-3: oklch(0.55 0.008 260);
      --ink-4: oklch(0.72 0.006 260);
      --ok: oklch(0.56 0.12 150);
      --warn: oklch(0.75 0.13 75);
      --bad: oklch(0.58 0.17 25);
      --f-ui: "Inter", "Noto Sans JP", -apple-system, system-ui, sans-serif;
      --f-ja: "Noto Sans JP", "Hiragino Sans", sans-serif;
      --f-serif: "Source Serif 4", "Iowan Old Style", "Georgia", serif;
      --f-mono: "JetBrains Mono", ui-monospace, Menlo, monospace;
      --radius: 6px;
      --radius-lg: 10px;
      color-scheme: light;
    }
    html[data-theme="dark"] {
      --bg: oklch(0.17 0.008 260);
      --surface: oklch(0.21 0.009 260);
      --surface-2: oklch(0.195 0.008 260);
      --surface-3: oklch(0.245 0.010 260);
      --line: oklch(0.30 0.010 260);
      --line-strong: oklch(0.38 0.012 260);
      --ink: oklch(0.94 0.006 85);
      --ink-2: oklch(0.80 0.008 85);
      --ink-3: oklch(0.64 0.008 85);
      --ink-4: oklch(0.48 0.010 260);
      --accent: oklch(0.72 0.13 var(--accent-h));
      --accent-weak: oklch(0.30 0.06 var(--accent-h));
      color-scheme: dark;
    }

    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--ink);
      font-family: var(--f-ui);
      font-size: 15px;
      line-height: 1.55;
      -webkit-font-smoothing: antialiased;
    }
    a { color: var(--accent); text-decoration: none; }
    a:hover { text-decoration: underline; text-underline-offset: 3px; }
    button { font-family: inherit; font-size: inherit; color: inherit; cursor: pointer; }
    h1, h2, h3 { color: var(--ink); }

    .app { min-height: 100vh; display: flex; flex-direction: column; }
    .header {
      position: sticky; top: 0; z-index: 40;
      background: color-mix(in oklch, var(--bg), transparent 20%);
      backdrop-filter: saturate(1.2) blur(8px);
      border-bottom: 1px solid var(--line);
    }
    .header-inner {
      max-width: 1200px; margin: 0 auto;
      padding: 0 24px; height: 60px;
      display: flex; align-items: center; gap: 28px;
    }
    .brand {
      display: flex; align-items: center; gap: 10px;
      font-family: var(--f-serif); font-weight: 600; font-size: 17px;
      letter-spacing: -0.01em; color: var(--ink);
    }
    .brand:hover { text-decoration: none; }
    .brand-mark {
      width: 26px; height: 26px; border-radius: 4px;
      background: var(--ink); color: var(--bg);
      display: grid; place-items: center;
      font-family: var(--f-serif); font-weight: 600; font-size: 14px;
      font-style: italic;
    }
    .brand-sub { color: var(--ink-3); font-weight: 400; font-size: 13px; font-style: italic; }
    .header-right { margin-left: auto; display: flex; align-items: center; gap: 8px; }
    .icon-btn {
      width: 34px; height: 34px; border-radius: var(--radius);
      border: 1px solid transparent; background: transparent;
      display: inline-grid; place-items: center; color: var(--ink-2);
    }
    .icon-btn:hover { background: var(--surface-2); color: var(--ink); }
    .icon-btn svg { width: 16px; height: 16px; }

    .subnav { background: var(--surface-2); border-bottom: 1px solid var(--line); }
    .subnav-inner {
      max-width: 1100px; margin: 0 auto;
      padding: 12px 24px;
      display: flex; align-items: center; gap: 20px;
    }
    .subnav-links { display: flex; gap: 4px; margin-left: auto; }
    .subnav-links a {
      padding: 4px 12px; border-radius: var(--radius);
      font-size: 13px; color: var(--ink-2); font-weight: 500;
    }
    .subnav-links a:hover { background: var(--surface); color: var(--ink); text-decoration: none; }
    .subnav-links a.active { background: var(--surface); color: var(--ink); border: 1px solid var(--line); }

    .main { max-width: 1100px; width: 100%; margin: 0 auto; padding: 40px 24px 80px; flex: 1; }

    .eyebrow {
      font-family: var(--f-mono); font-size: 11px;
      color: var(--ink-3); letter-spacing: 0.1em;
      text-transform: uppercase; font-weight: 500;
    }
    .tm-title {
      font-family: var(--f-serif); font-size: 30px; font-weight: 500;
      letter-spacing: -0.015em; margin: 8px 0 14px;
    }
    .page-head {
      display: flex; align-items: flex-end; justify-content: space-between;
      gap: 24px; margin-bottom: 32px; padding-bottom: 20px;
      border-bottom: 1px solid var(--line);
    }
    .page-head-meta { color: var(--ink-3); font-size: 13px; }

    .btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 9px 16px;
      font-size: 13.5px; font-weight: 500;
      border-radius: var(--radius);
      border: 1px solid transparent;
      background: transparent; color: var(--ink-2);
      text-decoration: none;
      transition: background 0.15s, color 0.15s, border-color 0.15s;
    }
    .btn:hover { background: var(--surface-3); color: var(--ink); text-decoration: none; }
    .btn.primary { background: var(--ink); color: var(--bg); border-color: var(--ink); }
    .btn.primary:hover { background: var(--ink-2); border-color: var(--ink-2); color: var(--bg); }
    .btn.accent { background: var(--accent); color: white; border-color: var(--accent); }
    .btn.accent:hover { filter: brightness(1.05); color: white; }
    .btn.ghost { border: 1px solid var(--line); }
    .btn.ghost:hover { border-color: var(--line-strong); background: var(--surface-2); }

    .tbl {
      width: 100%; border-collapse: collapse;
      font-size: 14px;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      overflow: hidden;
    }
    .tbl th, .tbl td {
      padding: 14px 18px; text-align: left;
      border-bottom: 1px solid var(--line); vertical-align: top;
    }
    .tbl th {
      font-size: 11px; font-weight: 500;
      color: var(--ink-3); letter-spacing: 0.08em;
      text-transform: uppercase; background: var(--surface-2);
    }
    .tbl tr:last-child td { border-bottom: none; }
    .tbl td.num { color: var(--ink); font-variant-numeric: tabular-nums; font-family: var(--f-mono); font-size: 13px; font-weight: 500; }
    .tbl tr:hover td { background: var(--surface-2); }

    .badge {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 3px 9px; border-radius: 999px;
      font-size: 11px; font-weight: 500;
      font-family: var(--f-mono); letter-spacing: 0.04em;
      border: 1px solid var(--line); background: var(--surface);
    }
    .badge.ok { color: oklch(0.40 0.12 150); background: oklch(0.95 0.04 150); border-color: oklch(0.85 0.06 150); }
    .badge.warn { color: oklch(0.40 0.10 60); background: oklch(0.95 0.05 80); border-color: oklch(0.85 0.08 75); }

    .tm-form { display: flex; flex-direction: column; gap: 20px; max-width: 900px; }
    .tm-field { display: flex; flex-direction: column; gap: 6px; }
    .tm-field-lbl {
      font-family: var(--f-mono); font-size: 11px;
      color: var(--ink-3); letter-spacing: 0.08em; text-transform: uppercase;
    }
    .tm-field-lbl-hint { color: var(--ink-4); font-size: 11px; font-family: var(--f-mono); margin-left: 6px; text-transform: none; letter-spacing: 0; }
    .input {
      width: 100%; padding: 10px 14px;
      font-size: 14px;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      color: var(--ink);
      font-family: var(--f-ui);
    }
    .input:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-ring); }
    .input::placeholder { color: var(--ink-4); }
    textarea.input { font-family: var(--f-mono); font-size: 13px; line-height: 1.6; resize: vertical; }
    .ta-raw { min-height: 280px; }
    .ta-sanitized { min-height: 360px; }

    .form-row { display: grid; grid-template-columns: 1fr 220px; gap: 16px; }
    @media (max-width: 720px) { .form-row { grid-template-columns: 1fr; } }

    .tm-meta {
      display: flex; flex-wrap: wrap; gap: 10px 18px;
      font-size: 13px; color: var(--ink-3); margin-bottom: 8px;
    }
    .tm-meta b { color: var(--ink-2); font-weight: 500; }

    .tm-turns { display: flex; flex-direction: column; gap: 14px; }
    .tm-turn { display: flex; gap: 12px; align-items: flex-start; }
    .tm-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      display: grid; place-items: center;
      font-family: var(--f-mono); font-weight: 600; font-size: 12px;
      flex-shrink: 0; letter-spacing: 0.02em;
    }
    .tm-bubble {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      padding: 10px 16px; flex: 1;
    }
    .tm-spk { font-family: var(--f-ui); font-weight: 600; font-size: 13px; margin-bottom: 4px; }
    .tm-utter { font-family: var(--f-serif); font-size: 15.5px; line-height: 1.7; color: var(--ink); }
    .tm-empty { color: var(--ink-3); font-style: italic; padding: 20px; background: var(--surface-2); border-radius: var(--radius); border: 1px dashed var(--line); }

    .raw-block {
      background: var(--surface-3); border: 1px solid var(--line);
      border-radius: var(--radius); padding: 14px 16px;
      font-family: var(--f-mono); font-size: 12.5px;
      line-height: 1.6; white-space: pre-wrap; word-break: break-word;
      color: var(--ink-2); max-height: 320px; overflow: auto;
    }

    .back-link {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 13px; color: var(--ink-3);
      margin-bottom: 24px; text-decoration: none;
    }
    .back-link:hover { color: var(--accent); text-decoration: none; }

    .section-h2 { font-family: var(--f-serif); font-size: 22px; font-weight: 500; margin: 36px 0 16px; letter-spacing: -0.01em; }

    .error {
      background: color-mix(in oklch, var(--bad) 10%, var(--surface));
      border: 1px solid color-mix(in oklch, var(--bad) 30%, var(--line));
      color: var(--bad);
      padding: 10px 14px; border-radius: var(--radius);
      margin-bottom: 15px; font-size: 13.5px;
    }

    .lang-toggle { display: inline-flex; gap: 0; border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; }
    .lang-btn {
      padding: 6px 14px; font-size: 12px; font-family: var(--f-mono);
      background: var(--surface); color: var(--ink-2);
      border: none; border-left: 1px solid var(--line); cursor: pointer;
      letter-spacing: 0.06em;
    }
    .lang-btn:first-child { border-left: none; }
    .lang-btn.active { background: var(--ink); color: var(--bg); }
    .lang-btn.disabled, .lang-btn[disabled] { color: var(--ink-4); cursor: not-allowed; background: var(--surface-2); }

    .row-actions { display: flex; gap: 6px; }
    .row-actions form { margin: 0; }

    .sentence-source .tm-utter { cursor: text; }
    .sentence-source .tm-utter::selection { background: var(--accent-weak); color: var(--accent-ink, var(--ink)); }

    .ctx-menu {
      position: absolute; z-index: 200;
      display: flex; gap: 6px;
      padding: 8px;
      background: var(--surface);
      border: 1px solid var(--line-strong);
      border-radius: var(--radius-lg);
      box-shadow: 0 8px 24px oklch(0.2 0.01 260 / 0.16), 0 2px 6px oklch(0.2 0.01 260 / 0.10);
    }

    .toast {
      position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
      z-index: 300; padding: 10px 18px;
      background: var(--ink); color: var(--bg);
      font-size: 13px; font-weight: 500;
      border-radius: 999px;
      box-shadow: 0 6px 18px oklch(0.2 0.01 260 / 0.25);
      font-family: var(--f-ui);
    }
    .toast.toast-error { background: var(--bad); color: white; }

    /* flashcard quiz */
    .fc-stage { display: grid; place-items: center; padding: 24px 0 12px; }
    .fc-card {
      width: 100%; max-width: 640px; aspect-ratio: 16/10;
      perspective: 1400px; cursor: pointer; user-select: none;
    }
    .fc-card-inner {
      position: relative; width: 100%; height: 100%;
      transform-style: preserve-3d;
      transition: transform 0.55s cubic-bezier(.5,.05,.25,1);
    }
    .fc-card.flipped .fc-card-inner { transform: rotateY(180deg); }
    .fc-face {
      position: absolute; inset: 0;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 36px 44px;
      display: flex; flex-direction: column; justify-content: center; align-items: center;
      backface-visibility: hidden;
      box-shadow: 0 4px 14px oklch(0.2 0.01 260 / 0.06);
    }
    .fc-face .fc-corner {
      position: absolute; top: 16px; left: 20px;
      font-family: var(--f-mono); font-size: 11px; color: var(--ink-3);
      letter-spacing: 0.1em; text-transform: uppercase;
    }
    .fc-face.fc-front .fc-text {
      font-family: var(--f-serif); font-size: 26px; line-height: 1.55;
      text-align: center; color: var(--ink); white-space: pre-wrap;
    }
    .fc-face.fc-back { transform: rotateY(180deg); background: var(--surface-2); }
    .fc-face.fc-back .fc-text {
      font-family: var(--f-serif); font-size: 22px; line-height: 1.5;
      text-align: center; color: var(--ink); white-space: pre-wrap;
    }
    .fc-hint { color: var(--ink-4); font-size: 12px; margin-top: 16px; font-family: var(--f-mono); letter-spacing: 0.06em; }

    .fc-controls {
      display: flex; gap: 10px; align-items: center; justify-content: center;
      margin-top: 22px; flex-wrap: wrap;
    }
    .fc-counter { font-family: var(--f-mono); color: var(--ink-3); font-size: 13px; min-width: 70px; text-align: center; }
    .fc-empty {
      max-width: 640px; margin: 60px auto; padding: 48px;
      text-align: center; background: var(--surface-2);
      border: 1px dashed var(--line); border-radius: var(--radius-lg);
      color: var(--ink-3);
    }

    .check {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 13px; color: var(--ink-2);
    }

    /* avatar */
    .avatar-slot { cursor: pointer; outline: none; overflow: hidden; position: relative; }
    .avatar-slot:focus { box-shadow: 0 0 0 3px var(--accent-ring); }
    .avatar-slot.uploading { opacity: 0.5; }
    .avatar-img {
      width: 100%; height: 100%;
      object-fit: cover; border-radius: 50%;
      display: block;
    }
    .avatar-initials { display: contents; }
    kbd {
      font-family: var(--f-mono); font-size: 11px;
      padding: 1px 5px; border: 1px solid var(--line);
      border-bottom-width: 2px;
      border-radius: 3px; background: var(--surface-2);
    }

    /* per-meeting participants */
    .ptcp-section { padding: 4px 0 4px; }
    .ptcp-chips { display: flex; flex-wrap: wrap; gap: 8px; min-height: 32px; align-items: center; }
    .ptcp-chip {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 5px 6px 5px 5px; border-radius: 999px;
      font-size: 13px; font-weight: 500;
      border: 1px solid var(--line); background: var(--surface);
    }
    .ptcp-chip-avatar {
      width: 24px; height: 24px; border-radius: 50%;
      display: grid; place-items: center;
      font-family: var(--f-mono); font-weight: 600; font-size: 10px;
    }
    .ptcp-chip-desc { color: var(--ink-3); font-size: 11px; font-weight: 400; padding-left: 4px; border-left: 1px solid currentColor; opacity: 0.6; margin-left: 2px; }
    .ptcp-chip-x {
      width: 22px; height: 22px; border-radius: 50%;
      border: none; background: transparent; color: inherit;
      cursor: pointer; line-height: 1; font-size: 14px; opacity: 0.5;
    }
    .ptcp-chip-x:hover { opacity: 1; background: oklch(0.5 0.15 25 / 0.15); color: var(--bad); }

    .ptcp-add {
      display: flex; gap: 12px; align-items: stretch;
      margin-top: 14px;
    }
    .ptcp-input-wrap { position: relative; flex: 1; max-width: 420px; }
    .ptcp-suggestions {
      position: absolute; top: calc(100% + 4px); left: 0; right: 0;
      z-index: 50; max-height: 280px; overflow: auto;
      background: var(--surface);
      border: 1px solid var(--line-strong);
      border-radius: var(--radius);
      box-shadow: 0 8px 24px oklch(0.2 0.01 260 / 0.12);
    }
    .ptcp-sug-item {
      width: 100%; text-align: left; border: none; background: transparent;
      padding: 10px 14px; cursor: pointer; display: flex;
      gap: 10px; align-items: center;
      border-bottom: 1px solid var(--line);
      font-family: inherit; color: inherit;
    }
    .ptcp-sug-item:last-child { border-bottom: none; }
    .ptcp-sug-item:hover, .ptcp-sug-item.active { background: var(--surface-2); }
    .ptcp-sug-name { font-weight: 500; color: var(--ink); }
    .ptcp-sug-desc { font-size: 12px; color: var(--ink-3); }
    .ptcp-sug-empty { padding: 14px; color: var(--ink-3); font-size: 13px; text-align: center; }

    .team-list { display: flex; flex-direction: column; gap: 14px; }
    .team-card {
      background: var(--surface); border: 1px solid var(--line);
      border-radius: var(--radius-lg); padding: 18px 20px;
    }
    .team-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap; }
    .team-name { font-family: var(--f-serif); font-size: 18px; font-weight: 500; color: var(--ink); }
    .team-desc { color: var(--ink-3); font-size: 13px; margin-top: 2px; }

    .team-bulk { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-top: 12px; }
    .team-bulk select.input { width: auto; min-width: 220px; padding: 8px 12px; font-size: 13px; }
    .team-bulk-meta {
      font-size: 12px; color: var(--ink-3); font-family: var(--f-mono);
    }
    .team-bulk-meta b { color: var(--ink-2); }

    .foot {
      margin-top: 64px; padding: 24px 0;
      border-top: 1px solid var(--line);
      color: var(--ink-4); font-size: 12px;
      text-align: center; font-family: var(--f-mono);
      letter-spacing: 0.05em;
    }
  </style>
  <script>
    (function(){
      try {
        var t = localStorage.getItem('eiken-theme') || 'light';
        document.documentElement.setAttribute('data-theme', t);
      } catch(e) {}
    })();
  </script>
</head>
<body>
  <div class="app">
    <header class="header">
      <div class="header-inner">
        <a class="brand" href="/">
          <span class="brand-mark">T</span>
          <span>Transcript</span>
          <span class="brand-sub">Meeting Memory</span>
        </a>
        <div class="header-right">
          <button class="icon-btn" title="Toggle theme" onclick="(function(){try{var d=document.documentElement;var n=d.getAttribute('data-theme')==='dark'?'light':'dark';d.setAttribute('data-theme',n);localStorage.setItem('eiken-theme',n);}catch(e){}})()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/></svg>
          </button>
        </div>
      </div>
    </header>
    <div class="subnav">
      <div class="subnav-inner">
        <span class="eyebrow">TRANSCRIPT MEMORY · 会議文字起こし</span>
        <div class="subnav-links">
          <a href="/" class="${activeNav === "list" ? "active" : ""}">一覧</a>
          <a href="/new" class="${activeNav === "new" ? "active" : ""}">新規登録</a>
          <a href="/participants" class="${activeNav === "participants" ? "active" : ""}">参加者</a>
          <a href="/teams" class="${activeNav === "teams" ? "active" : ""}">チーム</a>
          <a href="/words" class="${activeNav === "words" ? "active" : ""}">個別ワード</a>
          <a href="/flashcards" class="${activeNav === "flashcards" ? "active" : ""}">カード</a>
          <a href="/flashcards/quiz" class="${activeNav === "quiz" ? "active" : ""}">クイズ</a>
        </div>
      </div>
    </div>
    <main class="main">
      ${content}
    </main>
    <footer class="foot">EIKEN 1 · TRANSCRIPT MEMORY · MEETING SANITIZER</footer>
  </div>
</body>
</html>`;
}

// GET / - List all meetings
function handleList(res, filter) {
  let rows;
  if (filter === "unsanitized") {
    rows = db.prepare("SELECT * FROM meetings WHERE sanitized = 0 ORDER BY id DESC").all();
  } else if (filter === "sanitized") {
    rows = db.prepare("SELECT * FROM meetings WHERE sanitized = 1 ORDER BY id DESC").all();
  } else {
    rows = db.prepare("SELECT * FROM meetings ORDER BY id DESC").all();
  }

  const filterPills = `
    <div style="display:flex; gap:8px; margin-bottom:18px;">
      <a class="btn ${!filter ? "primary" : "ghost"}" href="/">すべて</a>
      <a class="btn ${filter === "unsanitized" ? "primary" : "ghost"}" href="/?filter=unsanitized">未サニタイズ</a>
      <a class="btn ${filter === "sanitized" ? "primary" : "ghost"}" href="/?filter=sanitized">サニタイズ済み</a>
      <a class="btn accent" href="/new" style="margin-left:auto;">+ 新規登録</a>
    </div>`;

  let body;
  if (rows.length === 0) {
    body = `<div style="padding: 48px 0; text-align: center; color: var(--ink-3);">該当するトランスクリプトはありません。</div>`;
  } else {
    const trs = rows
      .map((r) => {
        const titleDisplay = r.title
          ? escapeHtml(r.title)
          : `<span style="color: var(--ink-4); font-style: italic;">(未設定 · ID ${r.id})</span>`;
        const dateDisplay = r.meeting_date
          ? escapeHtml(r.meeting_date)
          : `<span style="color: var(--ink-4);">—</span>`;
        const badge = r.sanitized
          ? `<span class="badge ok">SANITIZED</span>`
          : `<span class="badge warn">RAW</span>`;
        const created = (r.created_at || "").split("T")[0];
        return `<tr onclick="location.href='/meetings/${r.id}'" style="cursor:pointer;">
          <td class="num" style="width:60px;">${r.id}</td>
          <td><a href="/meetings/${r.id}" style="color: var(--ink); font-weight: 500;">${titleDisplay}</a></td>
          <td class="num" style="width:130px;">${dateDisplay}</td>
          <td style="width:110px;">${badge}</td>
          <td class="num" style="width:120px; color: var(--ink-3);">${created}</td>
        </tr>`;
      })
      .join("");
    body = `<table class="tbl">
      <thead>
        <tr><th style="width:60px;">ID</th><th>タイトル</th><th style="width:130px;">会議日</th><th style="width:110px;">状態</th><th style="width:120px;">作成日</th></tr>
      </thead>
      <tbody>${trs}</tbody>
    </table>`;
  }

  const headBlock = `<div class="page-head">
    <div>
      <div class="eyebrow" style="margin-bottom: 8px;">TRANSCRIPT · LIST</div>
      <h1 class="tm-title" style="margin: 0;">トランスクリプト一覧</h1>
    </div>
    <div class="page-head-meta">${rows.length} 件</div>
  </div>`;

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(layout("一覧", headBlock + filterPills + body, { activeNav: "list" }));
}

// GET /new - New form
function handleNew(res, error = "", prevText = "") {
  const errorHtml = error ? `<div class="error">${escapeHtml(error)}</div>` : "";

  const allParticipants = db
    .prepare("SELECT id, name, description, avatar_uploaded_at FROM participants ORDER BY name COLLATE NOCASE ASC")
    .all();
  const teamRows = db.prepare("SELECT id, name FROM teams ORDER BY name COLLATE NOCASE ASC").all();
  const teamMemberStmt = db.prepare("SELECT participant_id FROM team_members WHERE team_id = ?");
  const teamsForUI = teamRows.map((t) => ({
    ...t,
    member_ids: teamMemberStmt.all(t.id).map((r) => r.participant_id),
  }));
  const participantsJson = JSON.stringify(allParticipants).replace(/</g, "\\u003c");
  const teamsJson = JSON.stringify(teamsForUI).replace(/</g, "\\u003c");

  const teamPickerHtml = teamsForUI.length ? `
    <div class="team-bulk">
      <span class="eyebrow" style="font-size:10px;">チームから一括</span>
      <select id="team-picker" class="input">
        <option value="">— チームを選択 —</option>
        ${teamsForUI.map((t) => `<option value="${t.id}">${escapeHtml(t.name)} (${t.member_ids.length} 名)</option>`).join("")}
      </select>
      <button type="button" id="team-add-btn" class="btn accent" disabled style="padding:7px 12px; font-size:12px;">＋全員追加</button>
      <a href="/teams" class="btn ghost" style="font-size:12px; margin-left:auto;">チーム管理 →</a>
    </div>` : `
    <div class="team-bulk"><span style="color: var(--ink-4); font-size: 12px;">チーム未登録 — <a href="/teams">作成</a> すると一括追加が使えます。</span></div>`;

  const content = `
    <div class="page-head">
      <div>
        <div class="eyebrow" style="margin-bottom:8px;">TRANSCRIPT · NEW</div>
        <h1 class="tm-title" style="margin:0;">新規登録</h1>
      </div>
    </div>
    ${errorHtml}
    <form class="tm-form" method="POST" action="/create">
      <label class="tm-field">
        <span class="tm-field-lbl">トランスクリプト (raw)<span class="tm-field-lbl-hint">英語</span></span>
        <textarea class="input ta-raw" name="transcript_raw" placeholder="Paste the raw transcript here..." required>${escapeHtml(prevText)}</textarea>
      </label>

      <div class="tm-field">
        <span class="tm-field-lbl">参加者<span class="tm-field-lbl-hint">登録時に紐付け / 後から詳細画面でも編集可</span></span>
        <div class="ptcp-section">
          <div id="ptcp-chips" class="ptcp-chips"><span style="color: var(--ink-4); font-size: 13px;">未選択</span></div>
          <div class="ptcp-add">
            <div class="ptcp-input-wrap">
              <input id="ptcp-input" class="input" type="text" autocomplete="off" placeholder="個別追加: 名前で検索 (例: k → Kai)">
              <div id="ptcp-suggestions" class="ptcp-suggestions" style="display:none;"></div>
            </div>
            <a href="/participants" class="btn ghost" style="font-size:12px;">マスター管理 →</a>
          </div>
          ${teamPickerHtml}
        </div>
        <input type="hidden" name="participant_ids" id="ptcp-ids" value="">
      </div>

      <div style="display:flex; gap:8px;">
        <button type="submit" class="btn accent">登録</button>
        <a href="/" class="btn ghost">キャンセル</a>
      </div>
    </form>

    <script>
      (function(){
        function escapeHtml(s){
          return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
        }
        function speakerHue(name){
          var h = 0;
          for (var i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
          return h % 360;
        }
        function speakerInitials(name){
          var parts = name.trim().split(/\\s+/).filter(Boolean);
          if (!parts.length) return '?';
          if (parts.length === 1) return parts[0].slice(0,2).toUpperCase();
          return (parts[0][0] + parts[parts.length-1][0]).toUpperCase();
        }

        var participants = ${participantsJson};
        var teams = ${teamsJson};
        var pById = {};
        participants.forEach(function(p){ pById[p.id] = p; });

        var state = { selected: [] };

        var chipsEl = document.getElementById('ptcp-chips');
        var idsField = document.getElementById('ptcp-ids');
        var input = document.getElementById('ptcp-input');
        var box = document.getElementById('ptcp-suggestions');
        var teamPicker = document.getElementById('team-picker');
        var teamAddBtn = document.getElementById('team-add-btn');
        var activeIdx = -1;

        function rerender(){
          if (state.selected.length === 0) {
            chipsEl.innerHTML = '<span style="color: var(--ink-4); font-size: 13px;">未選択</span>';
          } else {
            chipsEl.innerHTML = state.selected.map(function(id){
              var p = pById[id]; if (!p) return '';
              var hue = speakerHue(p.name);
              var initials = escapeHtml(speakerInitials(p.name));
              return '<span class="ptcp-chip" data-pid="' + id + '" style="background: oklch(0.95 0.04 ' + hue + '); color: oklch(0.35 0.10 ' + hue + '); border-color: oklch(0.85 0.06 ' + hue + ');">' +
                '<span class="ptcp-chip-avatar" style="background: oklch(0.78 0.10 ' + hue + '); color: oklch(0.22 0.04 ' + hue + '); overflow:hidden;">' + (p.avatar_uploaded_at ? ('<img src="/avatars/' + p.id + '.png?v=' + (Date.parse(p.avatar_uploaded_at)||0) + '" alt="" class="avatar-img">') : initials) + '</span>' +
                '<span>' + escapeHtml(p.name) + '</span>' +
                '<button type="button" class="ptcp-chip-x" data-pid="' + id + '" title="解除">×</button>' +
              '</span>';
            }).join('');
            chipsEl.querySelectorAll('.ptcp-chip-x').forEach(function(btn){
              btn.addEventListener('click', function(){
                var pid = parseInt(btn.dataset.pid, 10);
                state.selected = state.selected.filter(function(x){ return x !== pid; });
                onChange();
              });
            });
          }
          idsField.value = state.selected.join(',');
          updateTeamButton();
        }

        function onChange(){
          rerender();
          // Re-render current suggestion to reflect selection
          if (box.style.display !== 'none') renderSug(input.value);
        }

        function setActive(i){
          activeIdx = i;
          box.querySelectorAll('.ptcp-sug-item').forEach(function(el, j){
            el.classList.toggle('active', j === i);
          });
        }
        function renderSug(query){
          var q = query.trim().toLowerCase();
          var avail = participants.filter(function(p){ return state.selected.indexOf(p.id) === -1; });
          var items = avail.filter(function(c){
            if (!q) return true;
            return c.name.toLowerCase().includes(q) ||
                   (c.description && c.description.toLowerCase().includes(q));
          }).slice(0, 12);
          if (items.length === 0) {
            box.innerHTML = '<div class="ptcp-sug-empty">候補なし</div>';
            box.style.display = 'block';
            activeIdx = -1;
            return;
          }
          box.innerHTML = items.map(function(c, i){
            return '<button type="button" class="ptcp-sug-item" data-id="' + c.id + '" data-idx="' + i + '">' +
              '<span class="ptcp-sug-name">' + escapeHtml(c.name) + '</span></button>';
          }).join('');
          box.style.display = 'block';
          box.querySelectorAll('.ptcp-sug-item').forEach(function(el){
            el.addEventListener('mousedown', function(ev){ ev.preventDefault(); pick(parseInt(el.dataset.id, 10)); });
            el.addEventListener('mousemove', function(){ setActive(parseInt(el.dataset.idx, 10)); });
          });
          setActive(0);
        }
        function pick(pid){
          if (state.selected.indexOf(pid) === -1) state.selected.push(pid);
          input.value = '';
          onChange();
          input.focus();
        }
        if (input) {
          input.addEventListener('input', function(){ renderSug(input.value); });
          input.addEventListener('focus', function(){ renderSug(input.value); });
          input.addEventListener('blur', function(){ setTimeout(function(){ box.style.display = 'none'; }, 150); });
          input.addEventListener('keydown', function(ev){
            var els = box.querySelectorAll('.ptcp-sug-item');
            if (els.length === 0) return;
            if (ev.key === 'ArrowDown') {
              ev.preventDefault();
              setActive(activeIdx < 0 ? 0 : Math.min(activeIdx + 1, els.length - 1));
            } else if (ev.key === 'ArrowUp') {
              ev.preventDefault();
              setActive(Math.max(activeIdx - 1, 0));
            } else if (ev.key === 'Enter') {
              ev.preventDefault();
              var idx = activeIdx < 0 ? 0 : activeIdx;
              if (els[idx]) pick(parseInt(els[idx].dataset.id, 10));
            } else if (ev.key === 'Escape') {
              box.style.display = 'none';
            }
          });
        }

        function updateTeamButton(){
          if (!teamPicker) return;
          var tid = parseInt(teamPicker.value, 10);
          if (!tid) { teamAddBtn.disabled = true; return; }
          var t = teams.find(function(x){ return x.id === tid; });
          if (!t) { teamAddBtn.disabled = true; return; }
          var willAdd = t.member_ids.filter(function(id){ return state.selected.indexOf(id) === -1; }).length;
          teamAddBtn.disabled = (willAdd === 0);
        }
        if (teamPicker) {
          teamPicker.addEventListener('change', updateTeamButton);
          teamAddBtn.addEventListener('click', function(){
            var tid = parseInt(teamPicker.value, 10);
            if (!tid) return;
            var t = teams.find(function(x){ return x.id === tid; });
            t.member_ids.forEach(function(id){
              if (state.selected.indexOf(id) === -1) state.selected.push(id);
            });
            onChange();
          });
        }

        rerender();
      })();
    </script>
  `;
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(layout("新規登録", content, { activeNav: "new" }));
}

// POST /create
function handleCreate(req, res) {
  let body = "";
  req.on("data", (c) => (body += c.toString()));
  req.on("end", () => {
    const data = parseFormData(body);
    const raw = (data.transcript_raw || "").trim();
    if (!raw) return handleNew(res, "トランスクリプトを入力してください");

    const participantIds = (data.participant_ids || "")
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => Number.isInteger(n) && n > 0);

    const tx = db.transaction(() => {
      const info = db
        .prepare("INSERT INTO meetings (transcript_raw, sanitized, created_at) VALUES (?, 0, ?)")
        .run(raw, nowIso());
      const meetingId = info.lastInsertRowid;
      if (participantIds.length) {
        const ins = db.prepare(
          "INSERT OR IGNORE INTO meeting_participants (meeting_id, participant_id, created_at) VALUES (?, ?, ?)"
        );
        const now = nowIso();
        for (const pid of participantIds) ins.run(meetingId, pid, now);
      }
      return meetingId;
    });
    const meetingId = tx();

    res.writeHead(302, { Location: `/meetings/${meetingId}` });
    res.end();
  });
}

// GET /meetings/:id - Detail
function handleDetail(res, id) {
  const m = db.prepare("SELECT * FROM meetings WHERE id = ?").get(id);
  if (!m) {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(layout("404", '<div style="padding:48px 0; text-align:center; color: var(--ink-3);">トランスクリプトが見つかりません。</div>'));
    return;
  }

  const turnsEn = parseSpeakerTurns(m.transcript_sanitized || "");
  const turnsJa = parseSpeakerTurns(m.transcript_sanitized_ja || "");

  const meetingParticipants = db
    .prepare(
      `SELECT p.id, p.name, p.description, p.avatar_uploaded_at
       FROM meeting_participants mp
       JOIN participants p ON p.id = mp.participant_id
       WHERE mp.meeting_id = ?
       ORDER BY p.name COLLATE NOCASE ASC`
    )
    .all(m.id);
  const participantsByName = Object.fromEntries(meetingParticipants.map((p) => [p.name, p]));

  const sanitizedBadge = m.sanitized
    ? `<span class="badge ok">SANITIZED</span>`
    : `<span class="badge warn">RAW · 未サニタイズ</span>`;

  const hasJa = !!(m.transcript_sanitized_ja && m.transcript_sanitized_ja.trim());

  const content = `
    <a href="/" class="back-link">← 一覧へ戻る</a>

    <div class="page-head">
      <div>
        <div class="eyebrow" style="margin-bottom:8px;">MEETING · ID <span style="color: var(--ink); font-weight: 600;">#${m.id}</span></div>
        <h1 class="tm-title" style="margin:0;">${m.title ? escapeHtml(m.title) : '<span style="color: var(--ink-4); font-style: italic;">(タイトル未設定)</span>'}</h1>
        <div class="tm-meta" style="margin-top:12px;">
          <span><b>Meeting ID:</b> #${m.id}</span>
          <span><b>会議日:</b> ${m.meeting_date ? escapeHtml(m.meeting_date) : "—"}</span>
          <span><b>状態:</b> ${sanitizedBadge}</span>
          <span><b>作成:</b> ${escapeHtml((m.created_at || "").split("T")[0])}</span>
          ${m.updated_at ? `<span><b>更新:</b> ${escapeHtml(m.updated_at.split("T")[0])}</span>` : ""}
        </div>
      </div>
      <div style="display:flex; flex-direction:column; gap:8px; align-items:flex-end;">
        <a href="/meetings/${m.id}/edit" class="btn primary">編集</a>
        <form method="POST" action="/meetings/${m.id}/delete" style="margin:0;" onsubmit="return confirm('Meeting #${m.id} を削除します。よろしいですか？');">
          <button type="submit" class="btn ghost" style="color: var(--bad); border-color: color-mix(in oklch, var(--bad) 30%, var(--line));">削除</button>
        </form>
      </div>
    </div>

    <div style="display:flex; align-items:center; justify-content:space-between; margin: 36px 0 16px;">
      <h2 class="section-h2" style="margin:0;">参加者</h2>
      <a href="/meetings/${m.id}/edit" class="btn ghost" style="padding:6px 12px; font-size:12px;">編集 →</a>
    </div>
    <div class="ptcp-chips">
      ${meetingParticipants.length
        ? meetingParticipants.map((p) => {
            const hue = speakerHue(p.name);
            const initials = escapeHtml(speakerInitials(p.name));
            const ts = p.avatar_uploaded_at ? Date.parse(p.avatar_uploaded_at) || 0 : 0;
            const inner = p.avatar_uploaded_at
              ? `<img src="/avatars/${p.id}.png?v=${ts}" alt="" class="avatar-img">`
              : initials;
            return `<span class="ptcp-chip" style="background: oklch(0.95 0.04 ${hue}); color: oklch(0.35 0.10 ${hue}); border-color: oklch(0.85 0.06 ${hue});">
              <span class="ptcp-chip-avatar" style="background: oklch(0.78 0.10 ${hue}); color: oklch(0.22 0.04 ${hue}); overflow:hidden;">${inner}</span>
              <span>${escapeHtml(p.name)}</span>
            </span>`;
          }).join("")
        : `<span style="color: var(--ink-4); font-size: 13px;">未登録 — <a href="/meetings/${m.id}/edit">編集ページ</a> から登録してください</span>`
      }
    </div>

    <div style="display:flex; align-items:center; justify-content:flex-end; margin: 36px 0 12px;">
      <div class="lang-toggle" role="tablist" aria-label="表示言語">
        <button type="button" class="lang-btn active" data-lang="en">EN</button>
        <button type="button" class="lang-btn ${hasJa ? "" : "disabled"}" data-lang="ja" ${hasJa ? "" : "disabled aria-disabled=\"true\""}>JA${hasJa ? "" : " (未登録)"}</button>
      </div>
    </div>
    <div class="tm-turns lang-pane sentence-source" data-lang-pane="en" data-meeting-id="${m.id}">
      ${renderSpeakerTurns(turnsEn, participantsByName)}
    </div>
    <div class="tm-turns lang-pane" data-lang-pane="ja" style="display:none;">
      ${hasJa ? renderSpeakerTurns(turnsJa, participantsByName) : '<div class="tm-empty">日本語訳は未登録です。Skill 実行時に自動で生成されます。</div>'}
    </div>

    <div style="display:flex; align-items:center; justify-content:space-between; margin: 36px 0 16px;">
      <h2 class="section-h2" style="margin:0;">transcript</h2>
      <div style="display:flex; gap:8px;">
        <button type="button" id="raw-copy" class="btn ghost" style="padding:6px 12px; font-size:12px;">📋 コピー</button>
        <button type="button" id="raw-toggle" class="btn ghost" style="padding:6px 12px; font-size:12px;" aria-expanded="false">表示</button>
      </div>
    </div>
    <div id="raw-block" class="raw-block" style="display:none;">${escapeHtml(m.transcript_raw)}</div>

    <div id="ctx-menu" class="ctx-menu" style="display:none;">
      <button type="button" id="ctx-register" class="btn accent" style="padding:8px 14px;">この文をカード登録</button>
      <button type="button" id="ctx-close" class="btn ghost" style="padding:8px 12px;">閉じる</button>
    </div>
    <div id="toast" class="toast" style="display:none;"></div>

    <script>
      (function(){
        var btns = document.querySelectorAll('.lang-btn');
        btns.forEach(function(b){
          b.addEventListener('click', function(){
            if (b.disabled) return;
            var lang = b.dataset.lang;
            btns.forEach(function(x){ x.classList.toggle('active', x === b); });
            document.querySelectorAll('.lang-pane').forEach(function(p){
              p.style.display = (p.dataset.langPane === lang) ? '' : 'none';
            });
          });
        });

        var menu = document.getElementById('ctx-menu');
        var toast = document.getElementById('toast');
        var pendingText = '';
        var pendingMeetingId = null;

        function showToast(msg, isError){
          toast.textContent = msg;
          toast.style.display = 'block';
          toast.classList.toggle('toast-error', !!isError);
          clearTimeout(showToast._t);
          showToast._t = setTimeout(function(){ toast.style.display = 'none'; }, 2500);
        }
        function closeMenu(){
          menu.style.display = 'none';
          pendingText = '';
        }

        document.querySelectorAll('.sentence-source').forEach(function(source){
          source.addEventListener('contextmenu', function(ev){
            var sel = window.getSelection();
            var text = sel ? sel.toString().trim() : '';
            if (!text) return; // no selection -> let native menu show
            ev.preventDefault();
            pendingText = text;
            pendingMeetingId = source.dataset.meetingId || null;
            var x = Math.min(ev.pageX, window.innerWidth - 260);
            var y = ev.pageY;
            menu.style.left = x + 'px';
            menu.style.top = y + 'px';
            menu.style.display = 'flex';
          });
        });

        document.addEventListener('click', function(ev){
          if (menu.style.display !== 'none' && !menu.contains(ev.target)) closeMenu();
        });
        document.addEventListener('keydown', function(ev){
          if (ev.key === 'Escape') closeMenu();
        });

        // ---- Raw transcript toggle + copy ----
        var rawBlock = document.getElementById('raw-block');
        var rawToggle = document.getElementById('raw-toggle');
        var rawCopy = document.getElementById('raw-copy');
        if (rawToggle && rawBlock) {
          rawToggle.addEventListener('click', function(){
            var hidden = rawBlock.style.display === 'none';
            rawBlock.style.display = hidden ? '' : 'none';
            rawToggle.textContent = hidden ? '非表示' : '表示';
            rawToggle.setAttribute('aria-expanded', hidden ? 'true' : 'false');
          });
        }
        if (rawCopy && rawBlock) {
          rawCopy.addEventListener('click', function(){
            var text = rawBlock.textContent;
            var done = function(ok){
              var orig = rawCopy.textContent;
              rawCopy.textContent = ok ? '✓ コピー済み' : '✗ 失敗';
              setTimeout(function(){ rawCopy.textContent = orig; }, 1600);
            };
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(text).then(function(){ done(true); }, function(){ done(false); });
            } else {
              try {
                var ta = document.createElement('textarea');
                ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
                document.body.appendChild(ta); ta.select();
                document.execCommand('copy'); document.body.removeChild(ta);
                done(true);
              } catch (e) { done(false); }
            }
          });
        }

        document.getElementById('ctx-close').addEventListener('click', closeMenu);
        document.getElementById('ctx-register').addEventListener('click', function(){
          if (!pendingText) return;
          var body = new URLSearchParams({ text_en: pendingText, meeting_id: pendingMeetingId || '' });
          fetch('/flashcards/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
            body: body.toString()
          }).then(function(r){ return r.json().then(function(j){ return { ok: r.ok, j: j }; }); })
            .then(function(res){
              if (res.ok) showToast('カードを登録しました (#' + res.j.id + ')');
              else showToast(res.j.error || '登録に失敗しました', true);
              closeMenu();
            })
            .catch(function(){ showToast('通信エラー', true); closeMenu(); });
        });
      })();
    </script>
  `;

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(layout((m.title || `Meeting #${m.id}`), content));
}

// POST /meetings/:id/participants/add
function handleMeetingParticipantAdd(req, res, id) {
  let body = "";
  req.on("data", (c) => (body += c.toString()));
  req.on("end", () => {
    const data = parseFormData(body);
    const pid = parseInt(data.participant_id, 10);
    if (!pid) {
      res.writeHead(302, { Location: `/meetings/${id}` });
      res.end();
      return;
    }
    try {
      db.prepare(
        "INSERT INTO meeting_participants (meeting_id, participant_id, created_at) VALUES (?, ?, ?)"
      ).run(id, pid, nowIso());
    } catch (e) {
      // Already added (unique constraint) — ignore
    }
    res.writeHead(302, { Location: `/meetings/${id}` });
    res.end();
  });
}

// POST /meetings/:id/participants/add-team
function handleMeetingTeamAdd(req, res, meetingId) {
  let body = "";
  req.on("data", (c) => (body += c.toString()));
  req.on("end", () => {
    const data = parseFormData(body);
    const teamId = parseInt(data.team_id, 10);
    if (!teamId) {
      res.writeHead(302, { Location: `/meetings/${meetingId}` });
      res.end();
      return;
    }
    const memberIds = db
      .prepare("SELECT participant_id FROM team_members WHERE team_id = ?")
      .all(teamId)
      .map((r) => r.participant_id);
    const stmt = db.prepare(
      "INSERT OR IGNORE INTO meeting_participants (meeting_id, participant_id, created_at) VALUES (?, ?, ?)"
    );
    const tx = db.transaction((ids) => {
      const now = nowIso();
      for (const pid of ids) stmt.run(meetingId, pid, now);
    });
    tx(memberIds);
    res.writeHead(302, { Location: `/meetings/${meetingId}` });
    res.end();
  });
}

// POST /meetings/:id/participants/remove-team
function handleMeetingTeamRemove(req, res, meetingId) {
  let body = "";
  req.on("data", (c) => (body += c.toString()));
  req.on("end", () => {
    const data = parseFormData(body);
    const teamId = parseInt(data.team_id, 10);
    if (!teamId) {
      res.writeHead(302, { Location: `/meetings/${meetingId}` });
      res.end();
      return;
    }
    db.prepare(
      `DELETE FROM meeting_participants
       WHERE meeting_id = ?
       AND participant_id IN (SELECT participant_id FROM team_members WHERE team_id = ?)`
    ).run(meetingId, teamId);
    res.writeHead(302, { Location: `/meetings/${meetingId}` });
    res.end();
  });
}

// POST /meetings/:id/participants/:pid/remove
function handleMeetingParticipantRemove(req, res, id, pid) {
  let body = "";
  req.on("data", (c) => (body += c.toString()));
  req.on("end", () => {
    db.prepare(
      "DELETE FROM meeting_participants WHERE meeting_id = ? AND participant_id = ?"
    ).run(id, pid);
    res.writeHead(302, { Location: `/meetings/${id}` });
    res.end();
  });
}

// POST /meetings/:id/delete
function handleDeleteMeeting(req, res, id) {
  let body = "";
  req.on("data", (c) => (body += c.toString()));
  req.on("end", () => {
    db.prepare("DELETE FROM meetings WHERE id = ?").run(id);
    res.writeHead(302, { Location: "/" });
    res.end();
  });
}

// GET /meetings/:id/edit - Edit form
function handleEditForm(res, id) {
  const m = db.prepare("SELECT * FROM meetings WHERE id = ?").get(id);
  if (!m) {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(layout("404", '<div style="padding:48px 0; text-align:center; color: var(--ink-3);">トランスクリプトが見つかりません。</div>'));
    return;
  }
  let speakers = [];
  try { speakers = JSON.parse(m.speakers || "[]"); } catch { speakers = []; }

  const allParticipants = db
    .prepare("SELECT id, name, description, avatar_uploaded_at FROM participants ORDER BY name COLLATE NOCASE ASC")
    .all();
  const registeredIds = db
    .prepare("SELECT participant_id FROM meeting_participants WHERE meeting_id = ?")
    .all(m.id)
    .map((r) => r.participant_id);
  const teamRows = db.prepare("SELECT id, name FROM teams ORDER BY name COLLATE NOCASE ASC").all();
  const teamMemberStmt = db.prepare("SELECT participant_id FROM team_members WHERE team_id = ?");
  const teamsForUI = teamRows.map((t) => ({
    ...t,
    member_ids: teamMemberStmt.all(t.id).map((r) => r.participant_id),
  }));
  const allParticipantsJson = JSON.stringify(allParticipants).replace(/</g, "\\u003c");
  const teamsJson = JSON.stringify(teamsForUI).replace(/</g, "\\u003c");
  const registeredIdsJson = JSON.stringify(registeredIds);

  const teamPickerHtml = teamsForUI.length ? `
    <div class="team-bulk">
      <span class="eyebrow" style="font-size:10px;">チームから一括</span>
      <select id="team-picker" class="input">
        <option value="">— チームを選択 —</option>
        ${teamsForUI.map((t) => `<option value="${t.id}">${escapeHtml(t.name)} (${t.member_ids.length} 名)</option>`).join("")}
      </select>
      <button type="button" id="team-add-btn" class="btn accent" disabled style="padding:7px 12px; font-size:12px;">＋全員追加</button>
      <a href="/teams" class="btn ghost" style="font-size:12px; margin-left:auto;">チーム管理 →</a>
    </div>` : `
    <div class="team-bulk"><span style="color: var(--ink-4); font-size: 12px;">チーム未登録 — <a href="/teams">作成</a> すると一括追加が使えます。</span></div>`;

  const content = `
    <a href="/meetings/${m.id}" class="back-link">← 詳細へ戻る</a>

    <div class="page-head">
      <div>
        <div class="eyebrow" style="margin-bottom:8px;">MEETING · EDIT · #${m.id}</div>
        <h1 class="tm-title" style="margin:0;">${m.title ? escapeHtml(m.title) : '<span style="color: var(--ink-4); font-style: italic;">(タイトル未設定)</span>'} を編集</h1>
      </div>
    </div>

    <h2 class="section-h2">参加者</h2>
    <div class="ptcp-section">
      <div id="ptcp-chips" class="ptcp-chips"></div>
      <div class="ptcp-add">
        <div class="ptcp-input-wrap">
          <input id="ptcp-input" class="input" type="text" autocomplete="off" placeholder="個別追加: 名前で検索 (例: k → Kai)">
          <div id="ptcp-suggestions" class="ptcp-suggestions" style="display:none;"></div>
        </div>
        <a href="/participants" class="btn ghost" style="font-size:12px;">マスター管理 →</a>
      </div>
      ${teamPickerHtml}
    </div>

    <h2 class="section-h2">トランスクリプト</h2>
    <form class="tm-form" method="POST" action="/meetings/${m.id}/edit">
      <div class="form-row">
        <label class="tm-field">
          <span class="tm-field-lbl">タイトル</span>
          <input class="input" type="text" name="title" value="${escapeHtml(m.title || "")}" placeholder="Meeting title">
        </label>
        <label class="tm-field">
          <span class="tm-field-lbl">会議日</span>
          <input class="input" type="date" name="meeting_date" value="${escapeHtml(m.meeting_date || "")}">
        </label>
      </div>
      <label class="tm-field">
        <span class="tm-field-lbl">話者リスト<span class="tm-field-lbl-hint">カンマ区切り / 不明な話者は unknown</span></span>
        <input class="input" type="text" name="speakers" value="${escapeHtml(speakers.join(", "))}" placeholder="Alice, Bob, unknown">
      </label>
      <label class="tm-field">
        <span class="tm-field-lbl">サニタイズ済み本文 (英語)<span class="tm-field-lbl-hint">"Speaker: ..." 形式 / 各発話を改行</span></span>
        <textarea class="input ta-sanitized" name="transcript_sanitized" placeholder="Alice: Hello everyone.&#10;Bob: Hi Alice...">${escapeHtml(m.transcript_sanitized || "")}</textarea>
      </label>
      <label class="tm-field">
        <span class="tm-field-lbl">日本語訳<span class="tm-field-lbl-hint">"発話者: ..." 形式 / 行数を英語と揃える</span></span>
        <textarea class="input ta-sanitized" name="transcript_sanitized_ja" placeholder="Alice: みなさん、参加ありがとうございます。&#10;Bob: こちらこそ。">${escapeHtml(m.transcript_sanitized_ja || "")}</textarea>
      </label>
      <label class="tm-field">
        <span class="tm-field-lbl">Raw トランスクリプト</span>
        <textarea class="input ta-raw" name="transcript_raw" required>${escapeHtml(m.transcript_raw)}</textarea>
      </label>
      <div style="display:flex; gap:8px;">
        <button type="submit" class="btn primary">更新</button>
        <a href="/meetings/${m.id}" class="btn ghost">キャンセル</a>
      </div>
    </form>

    <script>
      (function(){
        function escapeHtml(s){
          return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
        }
        function speakerHue(name){
          var h = 0;
          for (var i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
          return h % 360;
        }
        function speakerInitials(name){
          var parts = name.trim().split(/\\s+/).filter(Boolean);
          if (!parts.length) return '?';
          if (parts.length === 1) return parts[0].slice(0,2).toUpperCase();
          return (parts[0][0] + parts[parts.length-1][0]).toUpperCase();
        }
        function postForm(url, params){
          var body = new URLSearchParams(params || {}).toString();
          return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body, redirect: 'manual'
          }).catch(function(){});
        }

        var allParticipants = ${allParticipantsJson};
        var teams = ${teamsJson};
        var meetingId = ${m.id};
        var pById = {};
        allParticipants.forEach(function(p){ pById[p.id] = p; });
        var state = { selected: ${registeredIdsJson} };

        var chipsEl = document.getElementById('ptcp-chips');
        var input = document.getElementById('ptcp-input');
        var box = document.getElementById('ptcp-suggestions');
        var teamPicker = document.getElementById('team-picker');
        var teamAddBtn = document.getElementById('team-add-btn');
        var activeIdx = -1;

        function renderChips(){
          if (state.selected.length === 0) {
            chipsEl.innerHTML = '<span style="color: var(--ink-4); font-size: 13px;">未登録</span>';
            return;
          }
          var ids = state.selected.slice().sort(function(a,b){
            var na = (pById[a] && pById[a].name) || ''; var nb = (pById[b] && pById[b].name) || '';
            return na.localeCompare(nb);
          });
          chipsEl.innerHTML = ids.map(function(id){
            var p = pById[id]; if (!p) return '';
            var hue = speakerHue(p.name);
            var initials = escapeHtml(speakerInitials(p.name));
            return '<span class="ptcp-chip" data-pid="' + id + '" style="background: oklch(0.95 0.04 ' + hue + '); color: oklch(0.35 0.10 ' + hue + '); border-color: oklch(0.85 0.06 ' + hue + ');">' +
              '<span class="ptcp-chip-avatar" style="background: oklch(0.78 0.10 ' + hue + '); color: oklch(0.22 0.04 ' + hue + '); overflow:hidden;">' + (p.avatar_uploaded_at ? ('<img src="/avatars/' + p.id + '.png?v=' + (Date.parse(p.avatar_uploaded_at)||0) + '" alt="" class="avatar-img">') : initials) + '</span>' +
              '<span>' + escapeHtml(p.name) + '</span>' +
              '<button type="button" class="ptcp-chip-x" data-pid="' + id + '" title="解除">×</button>' +
            '</span>';
          }).join('');
          chipsEl.querySelectorAll('.ptcp-chip-x').forEach(function(btn){
            btn.addEventListener('click', function(){ removeOne(parseInt(btn.dataset.pid, 10)); });
          });
        }
        function refresh(){
          renderChips();
          updateTeamButton();
          if (box && box.style.display === 'block') renderSug(input.value);
        }
        function addOne(pid){
          if (state.selected.indexOf(pid) !== -1) return;
          state.selected.push(pid);
          refresh();
          postForm('/meetings/' + meetingId + '/participants/add', { participant_id: pid });
        }
        function removeOne(pid){
          var i = state.selected.indexOf(pid);
          if (i === -1) return;
          state.selected.splice(i, 1);
          refresh();
          postForm('/meetings/' + meetingId + '/participants/' + pid + '/remove');
        }
        function addTeam(tid){
          var t = teams.find(function(x){ return x.id === tid; });
          if (!t) return;
          t.member_ids.forEach(function(id){
            if (state.selected.indexOf(id) === -1) state.selected.push(id);
          });
          refresh();
          postForm('/meetings/' + meetingId + '/participants/add-team', { team_id: tid });
        }

        function setActive(i){
          activeIdx = i;
          box.querySelectorAll('.ptcp-sug-item').forEach(function(el, j){
            el.classList.toggle('active', j === i);
          });
        }
        function renderSug(query){
          var q = query.trim().toLowerCase();
          var avail = allParticipants.filter(function(p){ return state.selected.indexOf(p.id) === -1; });
          var items = avail.filter(function(c){
            if (!q) return true;
            return c.name.toLowerCase().includes(q) ||
                   (c.description && c.description.toLowerCase().includes(q));
          }).slice(0, 12);
          if (items.length === 0) {
            box.innerHTML = '<div class="ptcp-sug-empty">候補なし</div>';
            box.style.display = 'block';
            activeIdx = -1;
            return;
          }
          box.innerHTML = items.map(function(c, i){
            return '<button type="button" class="ptcp-sug-item" data-id="' + c.id + '" data-idx="' + i + '">' +
              '<span class="ptcp-sug-name">' + escapeHtml(c.name) + '</span></button>';
          }).join('');
          box.style.display = 'block';
          box.querySelectorAll('.ptcp-sug-item').forEach(function(el){
            el.addEventListener('mousedown', function(ev){ ev.preventDefault(); pick(parseInt(el.dataset.id, 10)); });
            el.addEventListener('mousemove', function(){ setActive(parseInt(el.dataset.idx, 10)); });
          });
          setActive(0);
        }
        function pick(pid){
          addOne(pid);
          input.value = '';
          input.focus();
          renderSug('');
        }
        if (input) {
          input.addEventListener('input', function(){ renderSug(input.value); });
          input.addEventListener('focus', function(){ renderSug(input.value); });
          input.addEventListener('blur', function(){ setTimeout(function(){ box.style.display = 'none'; }, 150); });
          input.addEventListener('keydown', function(ev){
            var els = box.querySelectorAll('.ptcp-sug-item');
            if (els.length === 0) return;
            if (ev.key === 'ArrowDown') {
              ev.preventDefault();
              setActive(activeIdx < 0 ? 0 : Math.min(activeIdx + 1, els.length - 1));
            } else if (ev.key === 'ArrowUp') {
              ev.preventDefault();
              setActive(Math.max(activeIdx - 1, 0));
            } else if (ev.key === 'Enter') {
              ev.preventDefault();
              var idx = activeIdx < 0 ? 0 : activeIdx;
              if (els[idx]) pick(parseInt(els[idx].dataset.id, 10));
            } else if (ev.key === 'Escape') {
              box.style.display = 'none';
            }
          });
        }

        function updateTeamButton(){
          if (!teamPicker) return;
          var tid = parseInt(teamPicker.value, 10);
          if (!tid) { teamAddBtn.disabled = true; return; }
          var t = teams.find(function(x){ return x.id === tid; });
          if (!t) { teamAddBtn.disabled = true; return; }
          var willAdd = t.member_ids.filter(function(id){ return state.selected.indexOf(id) === -1; }).length;
          teamAddBtn.disabled = (willAdd === 0);
        }
        if (teamPicker) {
          teamPicker.addEventListener('change', updateTeamButton);
          teamAddBtn.addEventListener('click', function(){
            var tid = parseInt(teamPicker.value, 10);
            if (tid) addTeam(tid);
          });
        }

        renderChips();
      })();
    </script>
  `;
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(layout(`Meeting #${m.id} を編集`, content));
}

// POST /meetings/:id/edit
function handleEdit(req, res, id) {
  let body = "";
  req.on("data", (c) => (body += c.toString()));
  req.on("end", () => {
    const data = parseFormData(body);
    const m = db.prepare("SELECT id FROM meetings WHERE id = ?").get(id);
    if (!m) {
      res.writeHead(404);
      res.end("Not Found");
      return;
    }
    const title = (data.title || "").trim() || null;
    const meetingDate = (data.meeting_date || "").trim() || null;
    const transcriptRaw = (data.transcript_raw || "").trim();
    const transcriptSanitized = (data.transcript_sanitized || "").trim() || null;
    const transcriptSanitizedJa = (data.transcript_sanitized_ja || "").trim() || null;
    const speakersList = (data.speakers || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const speakersJson = speakersList.length ? JSON.stringify(speakersList) : null;

    if (!transcriptRaw) {
      res.writeHead(302, { Location: `/meetings/${id}` });
      res.end();
      return;
    }

    db.prepare(
      `UPDATE meetings SET title=?, meeting_date=?, transcript_raw=?, transcript_sanitized=?, transcript_sanitized_ja=?, speakers=?, updated_at=? WHERE id=?`
    ).run(title, meetingDate, transcriptRaw, transcriptSanitized, transcriptSanitizedJa, speakersJson, nowIso(), id);

    res.writeHead(302, { Location: `/meetings/${id}` });
    res.end();
  });
}

// ===== Participants =====

function handleParticipantsList(res, error = "") {
  const rows = db
    .prepare("SELECT * FROM participants ORDER BY name ASC")
    .all();

  const errorHtml = error ? `<div class="error">${escapeHtml(error)}</div>` : "";
  const trs = rows.length
    ? rows
        .map((r) => {
          const hue = speakerHue(r.name);
          const initials = escapeHtml(speakerInitials(r.name));
          const hasAvatar = !!r.avatar_uploaded_at;
          const ts = r.avatar_uploaded_at ? Date.parse(r.avatar_uploaded_at) || Date.now() : 0;
          const avatarInner = hasAvatar
            ? `<img src="/avatars/${r.id}.png?v=${ts}" alt="" class="avatar-img">`
            : `<span class="avatar-initials">${initials}</span>`;
          return `<tr>
            <td style="width:60px;">
              <div class="avatar-slot tm-avatar" tabindex="0" data-pid="${r.id}" title="クリック → Ctrl+V でクリップボードから画像を貼り付け" style="background: oklch(0.78 0.10 ${hue}); color: oklch(0.22 0.04 ${hue}); width: 36px; height: 36px; font-size: 12px;">
                ${avatarInner}
              </div>
            </td>
            <td><b>${escapeHtml(r.name)}</b></td>
            <td>${escapeHtml(r.description || "")}</td>
            <td style="width:160px; text-align:right;">
              <div class="row-actions" style="justify-content:flex-end;">
                ${hasAvatar ? `<form method="POST" action="/participants/${r.id}/avatar/delete" onsubmit="return confirm('アバター画像を削除しますか？');">
                  <button type="submit" class="btn ghost" style="padding: 6px 10px; font-size: 12px;">画像解除</button>
                </form>` : ""}
                <form method="POST" action="/participants/${r.id}/delete" onsubmit="return confirm('${escapeHtml(r.name)} を削除しますか？');">
                  <button type="submit" class="btn ghost" style="color: var(--bad); padding: 6px 10px; font-size: 12px;">削除</button>
                </form>
              </div>
            </td>
          </tr>`;
        })
        .join("")
    : `<tr><td colspan="4" style="padding: 28px; text-align: center; color: var(--ink-3);">参加者が登録されていません。</td></tr>`;

  const content = `
    <div class="page-head">
      <div>
        <div class="eyebrow" style="margin-bottom:8px;">TRANSCRIPT · PARTICIPANTS</div>
        <h1 class="tm-title" style="margin:0;">参加者</h1>
      </div>
      <div class="page-head-meta">${rows.length} 名</div>
    </div>
    ${errorHtml}
    <h2 class="section-h2">新規追加</h2>
    <form class="tm-form" method="POST" action="/participants/create">
      <div class="form-row">
        <label class="tm-field">
          <span class="tm-field-lbl">名前<span class="tm-field-lbl-hint">表記ゆれを避けるため正式名称で</span></span>
          <input class="input" type="text" name="name" placeholder="Alice Tanaka" required>
        </label>
        <label class="tm-field">
          <span class="tm-field-lbl">説明<span class="tm-field-lbl-hint">役職・チームなど任意</span></span>
          <input class="input" type="text" name="description" placeholder="PM, Frontend Team">
        </label>
      </div>
      <div><button type="submit" class="btn accent">追加</button></div>
    </form>

    <h2 class="section-h2">登録済み</h2>
    <table class="tbl">
      <thead><tr><th></th><th>名前</th><th>説明</th><th></th></tr></thead>
      <tbody>${trs}</tbody>
    </table>
    <div id="avatar-toast" class="toast" style="display:none;"></div>

    <script>
      (function(){
        var toast = document.getElementById('avatar-toast');
        function showToast(msg, isError){
          toast.textContent = msg;
          toast.classList.toggle('toast-error', !!isError);
          toast.style.display = 'block';
          clearTimeout(showToast._t);
          showToast._t = setTimeout(function(){ toast.style.display = 'none'; }, 2200);
        }

        function blobToDataUrl(blob){
          return new Promise(function(resolve, reject){
            var fr = new FileReader();
            fr.onload = function(){ resolve(fr.result); };
            fr.onerror = function(){ reject(fr.error); };
            fr.readAsDataURL(blob);
          });
        }

        async function uploadForSlot(slot, blob){
          var pid = slot.dataset.pid;
          slot.classList.add('uploading');
          try {
            var dataUrl = await blobToDataUrl(blob);
            var resp = await fetch('/participants/' + pid + '/avatar', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ image_data_url: dataUrl }),
            });
            var json = await resp.json().catch(function(){ return {}; });
            if (!resp.ok) {
              showToast(json.error || 'アップロード失敗', true);
              return;
            }
            var ts = Date.parse(json.avatar_uploaded_at) || Date.now();
            slot.innerHTML = '<img src="/avatars/' + pid + '.png?v=' + ts + '" alt="" class="avatar-img">';
            showToast('アバターを保存しました');
          } catch (e) {
            showToast('通信エラー', true);
          } finally {
            slot.classList.remove('uploading');
          }
        }

        document.querySelectorAll('.avatar-slot').forEach(function(slot){
          slot.addEventListener('click', function(){ slot.focus(); });
          slot.addEventListener('paste', async function(ev){
            var items = (ev.clipboardData && ev.clipboardData.items) || [];
            for (var i = 0; i < items.length; i++) {
              var it = items[i];
              if (it.kind === 'file' && it.type && it.type.indexOf('image/') === 0) {
                ev.preventDefault();
                var blob = it.getAsFile();
                if (blob) await uploadForSlot(slot, blob);
                return;
              }
            }
            showToast('クリップボードに画像がありません', true);
          });
        });
      })();
    </script>
  `;
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(layout("参加者", content, { activeNav: "participants" }));
}

function handleParticipantCreate(req, res) {
  let body = "";
  req.on("data", (c) => (body += c.toString()));
  req.on("end", () => {
    const data = parseFormData(body);
    const name = (data.name || "").trim();
    const description = (data.description || "").trim() || null;
    if (!name) return handleParticipantsList(res, "名前は必須です");
    try {
      db.prepare(
        "INSERT INTO participants (name, description, created_at) VALUES (?, ?, ?)"
      ).run(name, description, nowIso());
    } catch (e) {
      if (String(e.message).includes("UNIQUE")) {
        return handleParticipantsList(res, `「${name}」は既に登録されています`);
      }
      throw e;
    }
    res.writeHead(302, { Location: "/participants" });
    res.end();
  });
}

function handleParticipantDelete(req, res, id) {
  let body = "";
  req.on("data", (c) => (body += c.toString()));
  req.on("end", () => {
    db.prepare("DELETE FROM participants WHERE id = ?").run(id);
    // Best-effort cleanup of avatar file
    try { fs.unlinkSync(path.join(AVATARS_DIR, `${id}.png`)); } catch {}
    res.writeHead(302, { Location: "/participants" });
    res.end();
  });
}

// POST /participants/:id/avatar - JSON body { image_data_url }
function handleParticipantAvatarUpload(req, res, id) {
  const chunks = [];
  let total = 0;
  const MAX = 10 * 1024 * 1024; // 10MB pre-decode (data URL is ~33% larger than binary)
  req.on("data", (c) => {
    total += c.length;
    if (total > MAX) {
      req.destroy();
      return;
    }
    chunks.push(c);
  });
  req.on("end", () => {
    try {
      const body = Buffer.concat(chunks).toString("utf8");
      const data = JSON.parse(body);
      const dataUrl = (data.image_data_url || "").trim();
      const m = dataUrl.match(/^data:(image\/[a-zA-Z+.-]+);base64,([A-Za-z0-9+/=]+)$/);
      if (!m) {
        res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ error: "image data URL の形式が不正です" }));
        return;
      }
      const buf = Buffer.from(m[2], "base64");
      if (buf.length > 5 * 1024 * 1024) {
        res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ error: "5MB を超える画像はアップロードできません" }));
        return;
      }
      const exists = db.prepare("SELECT id FROM participants WHERE id = ?").get(id);
      if (!exists) {
        res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ error: "participant not found" }));
        return;
      }
      const filePath = path.join(AVATARS_DIR, `${id}.png`);
      fs.writeFileSync(filePath, buf);
      const ts = nowIso();
      db.prepare("UPDATE participants SET avatar_uploaded_at = ? WHERE id = ?").run(ts, id);
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ id, avatar_uploaded_at: ts }));
    } catch (e) {
      console.error(e);
      res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ error: "サーバエラー" }));
    }
  });
}

// POST /participants/:id/avatar/delete
function handleParticipantAvatarDelete(req, res, id) {
  let body = "";
  req.on("data", (c) => (body += c.toString()));
  req.on("end", () => {
    try { fs.unlinkSync(path.join(AVATARS_DIR, `${id}.png`)); } catch {}
    db.prepare("UPDATE participants SET avatar_uploaded_at = NULL WHERE id = ?").run(id);
    res.writeHead(302, { Location: "/participants" });
    res.end();
  });
}

// GET /avatars/:filename - static file serve (only basename, only .png)
function handleAvatarFile(res, filename) {
  if (!/^\d+\.png$/.test(filename)) {
    res.writeHead(404);
    res.end("Not Found");
    return;
  }
  const filePath = path.join(AVATARS_DIR, filename);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not Found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400",
    });
    res.end(data);
  });
}

// ===== Teams =====

function handleTeamsList(res, error = "") {
  const teams = db.prepare("SELECT * FROM teams ORDER BY name COLLATE NOCASE ASC").all();
  const allParticipants = db
    .prepare("SELECT id, name, description, avatar_uploaded_at FROM participants ORDER BY name COLLATE NOCASE ASC")
    .all();
  const memberStmt = db.prepare(
    `SELECT p.id, p.name, p.description, p.avatar_uploaded_at
     FROM team_members tm JOIN participants p ON p.id = tm.participant_id
     WHERE tm.team_id = ? ORDER BY p.name COLLATE NOCASE ASC`
  );

  const errorHtml = error ? `<div class="error">${escapeHtml(error)}</div>` : "";

  const teamCards = teams.length
    ? teams
        .map((t) => {
          const members = memberStmt.all(t.id);
          const memberIds = new Set(members.map((m) => m.id));
          const candidates = allParticipants.filter((p) => !memberIds.has(p.id));
          const candidatesJson = JSON.stringify(candidates).replace(/</g, "\\u003c");

          const initialJson = JSON.stringify(members.map((p) => p.id)).replace(/</g, "\\u003c");
          return `<div class="team-card" data-team-id="${t.id}" data-initial='${initialJson}'>
            <div class="team-head">
              <div>
                <div class="team-name">${escapeHtml(t.name)}</div>
                ${t.description ? `<div class="team-desc">${escapeHtml(t.description)}</div>` : ""}
              </div>
              <div style="display:flex; align-items:center; gap:10px;">
                <span class="badge team-count">0 名</span>
                <form method="POST" action="/teams/${t.id}/delete" onsubmit="return confirm('チーム「${escapeHtml(t.name)}」を削除しますか？ (メンバー紐付けも削除されます)');">
                  <button type="submit" class="btn ghost" style="padding:5px 10px; font-size:12px; color: var(--bad);">削除</button>
                </form>
              </div>
            </div>
            <div class="ptcp-chips team-chips" style="margin-top:12px;"></div>
            <div class="ptcp-add" style="margin-top:12px;">
              <div class="ptcp-input-wrap">
                <input class="input team-add-input" type="text" autocomplete="off" placeholder="メンバー追加 (名前で検索)">
                <div class="ptcp-suggestions team-sug" style="display:none;"></div>
              </div>
            </div>
          </div>`;
        })
        .join("")
    : `<div style="padding: 28px 0; color: var(--ink-3); text-align: center;">チームが登録されていません。</div>`;

  const content = `
    <div class="page-head">
      <div>
        <div class="eyebrow" style="margin-bottom:8px;">TRANSCRIPT · TEAMS</div>
        <h1 class="tm-title" style="margin:0;">チーム</h1>
      </div>
      <div class="page-head-meta">${teams.length} チーム</div>
    </div>
    ${errorHtml}

    <h2 class="section-h2">新規チーム</h2>
    <form class="tm-form" method="POST" action="/teams/create">
      <div class="form-row">
        <label class="tm-field">
          <span class="tm-field-lbl">チーム名</span>
          <input class="input" type="text" name="name" placeholder="BPP, Transaction Checkout, Logistics" required>
        </label>
        <label class="tm-field">
          <span class="tm-field-lbl">説明</span>
          <input class="input" type="text" name="description" placeholder="任意">
        </label>
      </div>
      <div><button type="submit" class="btn accent">追加</button></div>
    </form>

    <h2 class="section-h2">チーム一覧</h2>
    <div class="team-list">${teamCards}</div>

    <script>
      (function(){
        function escapeHtml(s){
          return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
        }
        function speakerHue(name){
          var h = 0;
          for (var i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
          return h % 360;
        }
        function speakerInitials(name){
          var parts = name.trim().split(/\\s+/).filter(Boolean);
          if (!parts.length) return '?';
          if (parts.length === 1) return parts[0].slice(0,2).toUpperCase();
          return (parts[0][0] + parts[parts.length-1][0]).toUpperCase();
        }
        function postForm(url, params){
          var body = new URLSearchParams(params || {}).toString();
          return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body, redirect: 'manual'
          }).catch(function(){});
        }

        var allParticipants = ${JSON.stringify(allParticipants).replace(/</g, "\\u003c")};
        var pById = {};
        allParticipants.forEach(function(p){ pById[p.id] = p; });

        document.querySelectorAll('.team-card').forEach(function(card){
          var teamId = parseInt(card.dataset.teamId, 10);
          var state = { selected: JSON.parse(card.dataset.initial) };
          var chipsEl = card.querySelector('.team-chips');
          var countEl = card.querySelector('.team-count');
          var input = card.querySelector('.team-add-input');
          var box = card.querySelector('.team-sug');
          var activeIdx = -1;

          function renderChips(){
            countEl.textContent = state.selected.length + ' 名';
            if (state.selected.length === 0) {
              chipsEl.innerHTML = '<span style="color: var(--ink-4); font-size: 13px;">メンバー未登録</span>';
              return;
            }
            var ids = state.selected.slice().sort(function(a,b){
              var na = (pById[a] && pById[a].name) || ''; var nb = (pById[b] && pById[b].name) || '';
              return na.localeCompare(nb);
            });
            chipsEl.innerHTML = ids.map(function(id){
              var p = pById[id]; if (!p) return '';
              var hue = speakerHue(p.name);
              var initials = escapeHtml(speakerInitials(p.name));
              return '<span class="ptcp-chip" data-pid="' + id + '" style="background: oklch(0.95 0.04 ' + hue + '); color: oklch(0.35 0.10 ' + hue + '); border-color: oklch(0.85 0.06 ' + hue + ');">' +
                '<span class="ptcp-chip-avatar" style="background: oklch(0.78 0.10 ' + hue + '); color: oklch(0.22 0.04 ' + hue + '); overflow:hidden;">' + (p.avatar_uploaded_at ? ('<img src="/avatars/' + p.id + '.png?v=' + (Date.parse(p.avatar_uploaded_at)||0) + '" alt="" class="avatar-img">') : initials) + '</span>' +
                '<span>' + escapeHtml(p.name) + '</span>' +
                '<button type="button" class="ptcp-chip-x" data-pid="' + id + '" title="解除">×</button>' +
              '</span>';
            }).join('');
            chipsEl.querySelectorAll('.ptcp-chip-x').forEach(function(btn){
              btn.addEventListener('click', function(){ removeOne(parseInt(btn.dataset.pid, 10)); });
            });
          }
          function refresh(){
            renderChips();
            if (box && box.style.display === 'block') renderSug(input.value);
          }
          function addOne(pid){
            if (state.selected.indexOf(pid) !== -1) return;
            state.selected.push(pid);
            refresh();
            postForm('/teams/' + teamId + '/members/add', { participant_id: pid });
          }
          function removeOne(pid){
            var i = state.selected.indexOf(pid);
            if (i === -1) return;
            state.selected.splice(i, 1);
            refresh();
            postForm('/teams/' + teamId + '/members/' + pid + '/remove');
          }

          function setActive(i){
            activeIdx = i;
            box.querySelectorAll('.ptcp-sug-item').forEach(function(el, j){ el.classList.toggle('active', j === i); });
          }
          function renderSug(query){
            var q = query.trim().toLowerCase();
            var avail = allParticipants.filter(function(p){ return state.selected.indexOf(p.id) === -1; });
            var items = avail.filter(function(c){
              if (!q) return true;
              return c.name.toLowerCase().includes(q) ||
                     (c.description && c.description.toLowerCase().includes(q));
            }).slice(0, 12);
            if (items.length === 0) {
              box.innerHTML = '<div class="ptcp-sug-empty">候補なし</div>';
              box.style.display = 'block';
              activeIdx = -1;
              return;
            }
            box.innerHTML = items.map(function(c, i){
              return '<button type="button" class="ptcp-sug-item" data-id="' + c.id + '" data-idx="' + i + '">' +
                '<span class="ptcp-sug-name">' + escapeHtml(c.name) + '</span></button>';
            }).join('');
            box.style.display = 'block';
            box.querySelectorAll('.ptcp-sug-item').forEach(function(el){
              el.addEventListener('mousedown', function(ev){ ev.preventDefault(); pick(parseInt(el.dataset.id, 10)); });
              el.addEventListener('mousemove', function(){ setActive(parseInt(el.dataset.idx, 10)); });
            });
            setActive(0);
          }
          function pick(pid){
            addOne(pid);
            input.value = '';
            input.focus();
            renderSug('');
          }
          input.addEventListener('input', function(){ renderSug(input.value); });
          input.addEventListener('focus', function(){ renderSug(input.value); });
          input.addEventListener('blur', function(){ setTimeout(function(){ box.style.display = 'none'; }, 150); });
          input.addEventListener('keydown', function(ev){
            var els = box.querySelectorAll('.ptcp-sug-item');
            if (els.length === 0) return;
            if (ev.key === 'ArrowDown') {
              ev.preventDefault();
              setActive(activeIdx < 0 ? 0 : Math.min(activeIdx + 1, els.length - 1));
            } else if (ev.key === 'ArrowUp') {
              ev.preventDefault();
              setActive(Math.max(activeIdx - 1, 0));
            } else if (ev.key === 'Enter') {
              ev.preventDefault();
              var idx = activeIdx < 0 ? 0 : activeIdx;
              if (els[idx]) pick(parseInt(els[idx].dataset.id, 10));
            } else if (ev.key === 'Escape') {
              box.style.display = 'none';
            }
          });

          renderChips();
        });
      })();
    </script>
  `;
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(layout("チーム", content, { activeNav: "teams" }));
}

function handleTeamCreate(req, res) {
  let body = "";
  req.on("data", (c) => (body += c.toString()));
  req.on("end", () => {
    const data = parseFormData(body);
    const name = (data.name || "").trim();
    const description = (data.description || "").trim() || null;
    if (!name) return handleTeamsList(res, "チーム名は必須です");
    try {
      db.prepare(
        "INSERT INTO teams (name, description, created_at) VALUES (?, ?, ?)"
      ).run(name, description, nowIso());
    } catch (e) {
      if (String(e.message).includes("UNIQUE")) {
        return handleTeamsList(res, `チーム「${name}」は既に登録されています`);
      }
      throw e;
    }
    res.writeHead(302, { Location: "/teams" });
    res.end();
  });
}

function handleTeamDelete(req, res, id) {
  let body = "";
  req.on("data", (c) => (body += c.toString()));
  req.on("end", () => {
    db.prepare("DELETE FROM teams WHERE id = ?").run(id);
    res.writeHead(302, { Location: "/teams" });
    res.end();
  });
}

function handleTeamMemberAdd(req, res, teamId) {
  let body = "";
  req.on("data", (c) => (body += c.toString()));
  req.on("end", () => {
    const data = parseFormData(body);
    const pid = parseInt(data.participant_id, 10);
    if (pid) {
      try {
        db.prepare(
          "INSERT INTO team_members (team_id, participant_id, created_at) VALUES (?, ?, ?)"
        ).run(teamId, pid, nowIso());
      } catch (e) { /* unique - silently */ }
    }
    res.writeHead(302, { Location: "/teams" });
    res.end();
  });
}

function handleTeamMemberRemove(req, res, teamId, pid) {
  let body = "";
  req.on("data", (c) => (body += c.toString()));
  req.on("end", () => {
    db.prepare(
      "DELETE FROM team_members WHERE team_id = ? AND participant_id = ?"
    ).run(teamId, pid);
    res.writeHead(302, { Location: "/teams" });
    res.end();
  });
}

// ===== Custom Words =====

function handleWordsList(res, error = "") {
  const rows = db
    .prepare("SELECT * FROM custom_words ORDER BY word COLLATE NOCASE ASC")
    .all();

  const errorHtml = error ? `<div class="error">${escapeHtml(error)}</div>` : "";
  const trs = rows.length
    ? rows
        .map(
          (r) => `<tr>
            <td><code style="font-family: var(--f-mono); font-size: 13px; background: var(--surface-3); padding: 2px 8px; border-radius: 4px;">${escapeHtml(r.word)}</code></td>
            <td>${escapeHtml(r.description || "")}</td>
            <td style="width:80px; text-align:right;">
              <form method="POST" action="/words/${r.id}/delete" onsubmit="return confirm('${escapeHtml(r.word)} を削除しますか？');">
                <button type="submit" class="btn ghost" style="color: var(--bad); padding: 6px 12px; font-size: 12px;">削除</button>
              </form>
            </td>
          </tr>`
        )
        .join("")
    : `<tr><td colspan="3" style="padding: 28px; text-align: center; color: var(--ink-3);">個別ワードが登録されていません。</td></tr>`;

  const content = `
    <div class="page-head">
      <div>
        <div class="eyebrow" style="margin-bottom:8px;">TRANSCRIPT · CUSTOM WORDS</div>
        <h1 class="tm-title" style="margin:0;">個別ワード</h1>
      </div>
      <div class="page-head-meta">${rows.length} 件</div>
    </div>
    ${errorHtml}
    <h2 class="section-h2">新規追加</h2>
    <form class="tm-form" method="POST" action="/words/create">
      <div class="form-row">
        <label class="tm-field">
          <span class="tm-field-lbl">ワード</span>
          <input class="input" type="text" name="word" placeholder="Mercari, Stargazer Project" required>
        </label>
        <label class="tm-field">
          <span class="tm-field-lbl">説明<span class="tm-field-lbl-hint">どんな文脈で出るか</span></span>
          <input class="input" type="text" name="description" placeholder="社内プロジェクトコードネーム">
        </label>
      </div>
      <div><button type="submit" class="btn accent">追加</button></div>
    </form>

    <h2 class="section-h2">登録済み</h2>
    <table class="tbl">
      <thead><tr><th>ワード</th><th>説明</th><th></th></tr></thead>
      <tbody>${trs}</tbody>
    </table>
  `;
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(layout("個別ワード", content, { activeNav: "words" }));
}

function handleWordCreate(req, res) {
  let body = "";
  req.on("data", (c) => (body += c.toString()));
  req.on("end", () => {
    const data = parseFormData(body);
    const word = (data.word || "").trim();
    const description = (data.description || "").trim() || null;
    if (!word) return handleWordsList(res, "ワードは必須です");
    try {
      db.prepare(
        "INSERT INTO custom_words (word, description, created_at) VALUES (?, ?, ?)"
      ).run(word, description, nowIso());
    } catch (e) {
      if (String(e.message).includes("UNIQUE")) {
        return handleWordsList(res, `「${word}」は既に登録されています`);
      }
      throw e;
    }
    res.writeHead(302, { Location: "/words" });
    res.end();
  });
}

function handleWordDelete(req, res, id) {
  let body = "";
  req.on("data", (c) => (body += c.toString()));
  req.on("end", () => {
    db.prepare("DELETE FROM custom_words WHERE id = ?").run(id);
    res.writeHead(302, { Location: "/words" });
    res.end();
  });
}

// ===== Flashcards (sentences) =====

// POST /flashcards/create - JSON API. body: text_en, meeting_id?
function handleSentenceCreate(req, res) {
  let body = "";
  req.on("data", (c) => (body += c.toString()));
  req.on("end", () => {
    try {
      const data = parseFormData(body);
      const textEn = (data.text_en || "").trim();
      const meetingId = data.meeting_id ? parseInt(data.meeting_id, 10) || null : null;
      if (!textEn) {
        res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ error: "text_en は必須です" }));
        return;
      }
      const info = db
        .prepare(
          "INSERT INTO sentences (meeting_id, text_en, translated, learned, created_at) VALUES (?, ?, 0, 0, ?)"
        )
        .run(meetingId, textEn, nowIso());
      res.writeHead(201, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ id: info.lastInsertRowid }));
    } catch (e) {
      console.error(e);
      res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ error: "サーバエラー" }));
    }
  });
}

// GET /flashcards - list all
function handleFlashcardsList(res, filter) {
  let rows;
  if (filter === "untranslated") {
    rows = db.prepare("SELECT * FROM sentences WHERE translated = 0 ORDER BY id DESC").all();
  } else if (filter === "learned") {
    rows = db.prepare("SELECT * FROM sentences WHERE learned = 1 ORDER BY id DESC").all();
  } else if (filter === "active") {
    rows = db.prepare("SELECT * FROM sentences WHERE learned = 0 ORDER BY id DESC").all();
  } else {
    rows = db.prepare("SELECT * FROM sentences ORDER BY id DESC").all();
  }
  const total = db.prepare("SELECT COUNT(*) AS c FROM sentences").get().c;
  const ready = db.prepare("SELECT COUNT(*) AS c FROM sentences WHERE translated = 1 AND learned = 0").get().c;

  const filterPills = `
    <div style="display:flex; gap:8px; margin-bottom:18px; flex-wrap: wrap;">
      <a class="btn ${!filter ? "primary" : "ghost"}" href="/flashcards">すべて (${total})</a>
      <a class="btn ${filter === "active" ? "primary" : "ghost"}" href="/flashcards?filter=active">未習得</a>
      <a class="btn ${filter === "learned" ? "primary" : "ghost"}" href="/flashcards?filter=learned">覚えた</a>
      <a class="btn ${filter === "untranslated" ? "primary" : "ghost"}" href="/flashcards?filter=untranslated">未翻訳</a>
      <a class="btn accent" href="/flashcards/quiz" style="margin-left:auto;">クイズ開始 (${ready})</a>
    </div>`;

  let body;
  if (rows.length === 0) {
    body = `<div style="padding: 48px 0; text-align: center; color: var(--ink-3);">該当するカードはありません。詳細画面で英文を選択 → 右クリックして登録できます。</div>`;
  } else {
    const trs = rows
      .map((r) => {
        const trBadge = r.translated
          ? `<span class="badge ok">JA ✓</span>`
          : `<span class="badge warn">未翻訳</span>`;
        const lnBadge = r.learned
          ? `<span class="badge ok">覚えた</span>`
          : `<span class="badge" style="color: var(--ink-3);">学習中</span>`;
        const meeting = r.meeting_id
          ? `<a href="/meetings/${r.meeting_id}" style="font-family: var(--f-mono); font-size: 12px; color: var(--ink-3);">#${r.meeting_id}</a>`
          : `<span style="color: var(--ink-4);">—</span>`;
        return `<tr>
          <td class="num" style="width:50px;">${r.id}</td>
          <td>
            <div style="font-family: var(--f-serif); font-size: 15px; line-height: 1.5; color: var(--ink);">${escapeHtml(r.text_en)}</div>
            ${r.text_ja ? `<div style="font-family: var(--f-ja); font-size: 13px; color: var(--ink-3); margin-top: 4px;">${escapeHtml(r.text_ja)}</div>` : ""}
          </td>
          <td style="width:90px;">${trBadge}</td>
          <td style="width:90px;">${lnBadge}</td>
          <td style="width:60px;">${meeting}</td>
          <td style="width:240px;">
            <div class="row-actions">
              <form method="POST" action="/flashcards/${r.id}/toggle-learned">
                <button type="submit" class="btn ghost" style="padding:6px 10px; font-size:12px;">${r.learned ? "学習中に戻す" : "覚えた"}</button>
              </form>
              <a href="/flashcards/${r.id}/edit" class="btn ghost" style="padding:6px 10px; font-size:12px;">編集</a>
              <form method="POST" action="/flashcards/${r.id}/delete" onsubmit="return confirm('カード #${r.id} を削除しますか？');">
                <button type="submit" class="btn ghost" style="padding:6px 10px; font-size:12px; color: var(--bad);">削除</button>
              </form>
            </div>
          </td>
        </tr>`;
      })
      .join("");
    body = `<table class="tbl">
      <thead><tr><th style="width:50px;">ID</th><th>本文</th><th style="width:90px;">翻訳</th><th style="width:90px;">状態</th><th style="width:60px;">出典</th><th style="width:240px;"></th></tr></thead>
      <tbody>${trs}</tbody>
    </table>`;
  }

  const headBlock = `<div class="page-head">
    <div>
      <div class="eyebrow" style="margin-bottom:8px;">FLASHCARDS · LIST</div>
      <h1 class="tm-title" style="margin:0;">フラッシュカード一覧</h1>
    </div>
    <div class="page-head-meta">${rows.length} 件</div>
  </div>`;

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(layout("フラッシュカード", headBlock + filterPills + body, { activeNav: "flashcards" }));
}

// GET /flashcards/:id/edit
function handleFlashcardEditForm(res, id) {
  const r = db.prepare("SELECT * FROM sentences WHERE id = ?").get(id);
  if (!r) {
    res.writeHead(404);
    res.end("Not Found");
    return;
  }
  const content = `
    <a href="/flashcards" class="back-link">← カード一覧へ戻る</a>
    <div class="page-head">
      <div>
        <div class="eyebrow" style="margin-bottom:8px;">FLASHCARDS · EDIT</div>
        <h1 class="tm-title" style="margin:0;">カード #${r.id} を編集</h1>
      </div>
    </div>
    <form class="tm-form" method="POST" action="/flashcards/${r.id}/edit">
      <label class="tm-field">
        <span class="tm-field-lbl">英文</span>
        <textarea class="input" name="text_en" rows="3" required>${escapeHtml(r.text_en)}</textarea>
      </label>
      <label class="tm-field">
        <span class="tm-field-lbl">日本語訳</span>
        <textarea class="input" name="text_ja" rows="3" placeholder="未翻訳の場合は空欄">${escapeHtml(r.text_ja || "")}</textarea>
      </label>
      <div class="form-row">
        <label class="tm-field">
          <span class="tm-field-lbl">出典 Meeting ID</span>
          <input class="input" type="number" name="meeting_id" value="${r.meeting_id ?? ""}" placeholder="任意">
        </label>
        <div style="display:flex; flex-direction:column; gap:8px; justify-content:flex-end;">
          <label class="check"><input type="checkbox" name="translated" value="1" ${r.translated ? "checked" : ""}> 翻訳済みフラグ</label>
          <label class="check"><input type="checkbox" name="learned" value="1" ${r.learned ? "checked" : ""}> 覚えた</label>
        </div>
      </div>
      <div style="display:flex; gap:8px;">
        <button type="submit" class="btn primary">更新</button>
        <a href="/flashcards" class="btn ghost">キャンセル</a>
      </div>
    </form>
  `;
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(layout(`カード #${r.id}`, content, { activeNav: "flashcards" }));
}

// POST /flashcards/:id/edit
function handleFlashcardEdit(req, res, id) {
  let body = "";
  req.on("data", (c) => (body += c.toString()));
  req.on("end", () => {
    const data = parseFormData(body);
    const textEn = (data.text_en || "").trim();
    if (!textEn) {
      res.writeHead(302, { Location: `/flashcards/${id}/edit` });
      res.end();
      return;
    }
    const textJa = (data.text_ja || "").trim() || null;
    const meetingId = data.meeting_id ? parseInt(data.meeting_id, 10) || null : null;
    const translated = data.translated === "1" ? 1 : 0;
    const learned = data.learned === "1" ? 1 : 0;
    db.prepare(
      `UPDATE sentences SET text_en=?, text_ja=?, meeting_id=?, translated=?, learned=?, updated_at=? WHERE id=?`
    ).run(textEn, textJa, meetingId, translated, learned, nowIso(), id);
    res.writeHead(302, { Location: "/flashcards" });
    res.end();
  });
}

// POST /flashcards/:id/delete
function handleFlashcardDelete(req, res, id) {
  let body = "";
  req.on("data", (c) => (body += c.toString()));
  req.on("end", () => {
    db.prepare("DELETE FROM sentences WHERE id = ?").run(id);
    res.writeHead(302, { Location: "/flashcards" });
    res.end();
  });
}

// POST /flashcards/:id/toggle-learned
function handleFlashcardToggleLearned(req, res, id) {
  let body = "";
  req.on("data", (c) => (body += c.toString()));
  req.on("end", () => {
    const r = db.prepare("SELECT learned FROM sentences WHERE id = ?").get(id);
    if (!r) {
      res.writeHead(404);
      res.end("Not Found");
      return;
    }
    const next = r.learned ? 0 : 1;
    db.prepare("UPDATE sentences SET learned=?, updated_at=? WHERE id=?").run(next, nowIso(), id);
    res.writeHead(302, { Location: "/flashcards" });
    res.end();
  });
}

// GET /flashcards/quiz
function handleFlashcardQuiz(res, opts) {
  const cards = db
    .prepare(
      "SELECT id, text_en, text_ja, meeting_id FROM sentences WHERE translated = 1 AND learned = 0 ORDER BY id ASC"
    )
    .all();

  if (cards.length === 0) {
    const empty = `
      <div class="page-head">
        <div>
          <div class="eyebrow" style="margin-bottom:8px;">FLASHCARDS · QUIZ</div>
          <h1 class="tm-title" style="margin:0;">フラッシュカードクイズ</h1>
        </div>
      </div>
      <div class="fc-empty">
        <p style="margin:0 0 12px;">クイズ対象のカードがありません。</p>
        <p style="margin:0; font-size: 13px;">詳細画面で右クリック登録 → <code>/sentence-translator</code> で日本語訳を生成すると出題されます。</p>
        <div style="margin-top:18px;"><a class="btn ghost" href="/flashcards">カード一覧へ</a></div>
      </div>
    `;
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(layout("クイズ", empty, { activeNav: "quiz" }));
    return;
  }

  const cardsJson = JSON.stringify(cards).replace(/</g, "\\u003c");
  const content = `
    <div class="page-head">
      <div>
        <div class="eyebrow" style="margin-bottom:8px;">FLASHCARDS · QUIZ</div>
        <h1 class="tm-title" style="margin:0;">フラッシュカードクイズ</h1>
      </div>
      <div class="page-head-meta"><a href="/flashcards" style="color: var(--ink-3); font-size: 13px;">一覧へ →</a></div>
    </div>

    <div class="fc-stage">
      <div id="fc-card" class="fc-card" role="button" aria-label="カードをめくる">
        <div class="fc-card-inner">
          <div class="fc-face fc-front">
            <div class="fc-corner">JA · 問題</div>
            <div class="fc-text" id="fc-front-text"></div>
          </div>
          <div class="fc-face fc-back">
            <div class="fc-corner">EN · 解答</div>
            <div class="fc-text" id="fc-back-text"></div>
            <div class="fc-hint" id="fc-meeting"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="fc-controls">
      <button type="button" id="fc-prev" class="btn ghost">← 前へ</button>
      <span id="fc-counter" class="fc-counter"></span>
      <button type="button" id="fc-next" class="btn ghost">次へ →</button>
      <button type="button" id="fc-shuffle" class="btn ghost" title="シャッフル">🔀 シャッフル</button>
      <button type="button" id="fc-learned" class="btn accent">覚えた</button>
    </div>

    <script>
      (function(){
        var cards = ${cardsJson};
        var order = cards.map(function(_, i){ return i; });
        var pos = 0;
        var card = document.getElementById('fc-card');
        var front = document.getElementById('fc-front-text');
        var back = document.getElementById('fc-back-text');
        var meet = document.getElementById('fc-meeting');
        var counter = document.getElementById('fc-counter');

        function shuffle(arr){
          for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
          }
        }

        function render(){
          if (cards.length === 0) return;
          if (pos >= order.length) pos = order.length - 1;
          if (pos < 0) pos = 0;
          var c = cards[order[pos]];
          card.classList.remove('flipped');
          front.textContent = c.text_ja || '(訳がありません)';
          back.textContent = c.text_en;
          meet.textContent = c.meeting_id ? ('from meeting #' + c.meeting_id) : '';
          counter.textContent = (pos + 1) + ' / ' + order.length;
        }

        card.addEventListener('click', function(){
          card.classList.toggle('flipped');
        });
        document.getElementById('fc-prev').addEventListener('click', function(){
          if (pos > 0) { pos--; render(); }
        });
        document.getElementById('fc-next').addEventListener('click', function(){
          if (pos < order.length - 1) { pos++; render(); }
        });
        document.getElementById('fc-shuffle').addEventListener('click', function(){
          shuffle(order); pos = 0; render();
        });
        document.getElementById('fc-learned').addEventListener('click', function(){
          var c = cards[order[pos]];
          if (!c) return;
          var body = new URLSearchParams();
          fetch('/flashcards/' + c.id + '/toggle-learned', { method: 'POST', body: body });
          // remove from current quiz session
          order.splice(pos, 1);
          if (order.length === 0) {
            card.style.display = 'none';
            counter.textContent = '完了！';
            return;
          }
          if (pos >= order.length) pos = order.length - 1;
          render();
        });

        document.addEventListener('keydown', function(ev){
          if (ev.target && /^(INPUT|TEXTAREA)$/.test(ev.target.tagName)) return;
          if (ev.key === 'ArrowLeft') { document.getElementById('fc-prev').click(); }
          else if (ev.key === 'ArrowRight') { document.getElementById('fc-next').click(); }
          else if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); card.click(); }
        });

        render();
      })();
    </script>
  `;
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(layout("クイズ", content, { activeNav: "quiz" }));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;
  const method = req.method;
  console.log(`${method} ${pathname}`);

  try {
    if (method === "GET" && pathname === "/") {
      const filter = url.searchParams.get("filter") || "";
      handleList(res, filter);
    } else if (method === "GET" && pathname === "/new") {
      handleNew(res);
    } else if (method === "POST" && pathname === "/create") {
      handleCreate(req, res);
    } else if (method === "GET" && pathname.match(/^\/meetings\/(\d+)$/)) {
      const id = parseInt(pathname.match(/^\/meetings\/(\d+)$/)[1], 10);
      handleDetail(res, id);
    } else if (method === "GET" && pathname.match(/^\/meetings\/(\d+)\/edit$/)) {
      const id = parseInt(pathname.match(/^\/meetings\/(\d+)\/edit$/)[1], 10);
      handleEditForm(res, id);
    } else if (method === "POST" && pathname.match(/^\/meetings\/(\d+)\/edit$/)) {
      const id = parseInt(pathname.match(/^\/meetings\/(\d+)\/edit$/)[1], 10);
      handleEdit(req, res, id);
    } else if (method === "POST" && pathname.match(/^\/meetings\/(\d+)\/delete$/)) {
      const id = parseInt(pathname.match(/^\/meetings\/(\d+)\/delete$/)[1], 10);
      handleDeleteMeeting(req, res, id);
    } else if (method === "POST" && pathname.match(/^\/meetings\/(\d+)\/participants\/add$/)) {
      const id = parseInt(pathname.match(/^\/meetings\/(\d+)\/participants\/add$/)[1], 10);
      handleMeetingParticipantAdd(req, res, id);
    } else if (method === "POST" && pathname.match(/^\/meetings\/(\d+)\/participants\/add-team$/)) {
      const id = parseInt(pathname.match(/^\/meetings\/(\d+)\/participants\/add-team$/)[1], 10);
      handleMeetingTeamAdd(req, res, id);
    } else if (method === "POST" && pathname.match(/^\/meetings\/(\d+)\/participants\/remove-team$/)) {
      const id = parseInt(pathname.match(/^\/meetings\/(\d+)\/participants\/remove-team$/)[1], 10);
      handleMeetingTeamRemove(req, res, id);
    } else if (method === "POST" && pathname.match(/^\/meetings\/(\d+)\/participants\/(\d+)\/remove$/)) {
      const mm = pathname.match(/^\/meetings\/(\d+)\/participants\/(\d+)\/remove$/);
      handleMeetingParticipantRemove(req, res, parseInt(mm[1], 10), parseInt(mm[2], 10));
    } else if (method === "GET" && pathname === "/participants") {
      handleParticipantsList(res);
    } else if (method === "POST" && pathname === "/participants/create") {
      handleParticipantCreate(req, res);
    } else if (method === "POST" && pathname.match(/^\/participants\/(\d+)\/delete$/)) {
      const id = parseInt(pathname.match(/^\/participants\/(\d+)\/delete$/)[1], 10);
      handleParticipantDelete(req, res, id);
    } else if (method === "POST" && pathname.match(/^\/participants\/(\d+)\/avatar$/)) {
      const id = parseInt(pathname.match(/^\/participants\/(\d+)\/avatar$/)[1], 10);
      handleParticipantAvatarUpload(req, res, id);
    } else if (method === "POST" && pathname.match(/^\/participants\/(\d+)\/avatar\/delete$/)) {
      const id = parseInt(pathname.match(/^\/participants\/(\d+)\/avatar\/delete$/)[1], 10);
      handleParticipantAvatarDelete(req, res, id);
    } else if (method === "GET" && pathname.match(/^\/avatars\/([^\/]+)$/)) {
      handleAvatarFile(res, pathname.match(/^\/avatars\/([^\/]+)$/)[1]);
    } else if (method === "GET" && pathname === "/teams") {
      handleTeamsList(res);
    } else if (method === "POST" && pathname === "/teams/create") {
      handleTeamCreate(req, res);
    } else if (method === "POST" && pathname.match(/^\/teams\/(\d+)\/delete$/)) {
      handleTeamDelete(req, res, parseInt(pathname.match(/^\/teams\/(\d+)\/delete$/)[1], 10));
    } else if (method === "POST" && pathname.match(/^\/teams\/(\d+)\/members\/add$/)) {
      handleTeamMemberAdd(req, res, parseInt(pathname.match(/^\/teams\/(\d+)\/members\/add$/)[1], 10));
    } else if (method === "POST" && pathname.match(/^\/teams\/(\d+)\/members\/(\d+)\/remove$/)) {
      const mm = pathname.match(/^\/teams\/(\d+)\/members\/(\d+)\/remove$/);
      handleTeamMemberRemove(req, res, parseInt(mm[1], 10), parseInt(mm[2], 10));
    } else if (method === "GET" && pathname === "/words") {
      handleWordsList(res);
    } else if (method === "POST" && pathname === "/words/create") {
      handleWordCreate(req, res);
    } else if (method === "POST" && pathname.match(/^\/words\/(\d+)\/delete$/)) {
      const id = parseInt(pathname.match(/^\/words\/(\d+)\/delete$/)[1], 10);
      handleWordDelete(req, res, id);
    } else if (method === "POST" && pathname === "/flashcards/create") {
      handleSentenceCreate(req, res);
    } else if (method === "GET" && pathname === "/flashcards") {
      const filter = url.searchParams.get("filter") || "";
      handleFlashcardsList(res, filter);
    } else if (method === "GET" && pathname === "/flashcards/quiz") {
      handleFlashcardQuiz(res);
    } else if (method === "GET" && pathname.match(/^\/flashcards\/(\d+)\/edit$/)) {
      const id = parseInt(pathname.match(/^\/flashcards\/(\d+)\/edit$/)[1], 10);
      handleFlashcardEditForm(res, id);
    } else if (method === "POST" && pathname.match(/^\/flashcards\/(\d+)\/edit$/)) {
      const id = parseInt(pathname.match(/^\/flashcards\/(\d+)\/edit$/)[1], 10);
      handleFlashcardEdit(req, res, id);
    } else if (method === "POST" && pathname.match(/^\/flashcards\/(\d+)\/delete$/)) {
      const id = parseInt(pathname.match(/^\/flashcards\/(\d+)\/delete$/)[1], 10);
      handleFlashcardDelete(req, res, id);
    } else if (method === "POST" && pathname.match(/^\/flashcards\/(\d+)\/toggle-learned$/)) {
      const id = parseInt(pathname.match(/^\/flashcards\/(\d+)\/toggle-learned$/)[1], 10);
      handleFlashcardToggleLearned(req, res, id);
    } else {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(layout("404", "<p>ページが見つかりません。</p>"));
    }
  } catch (err) {
    console.error(err);
    res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
    res.end(layout("エラー", `<p>サーバーエラーが発生しました。</p>`));
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Database: ${DB_PATH}`);
});
