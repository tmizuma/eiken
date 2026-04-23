const http = require("http");
const Database = require("better-sqlite3");
const path = require("path");

const PORT = process.env.PORT || 3001;
const DB_PATH = path.join(__dirname, "app.db");

// Database initialization
const db = new Database(DB_PATH);
db.exec(`
  CREATE TABLE IF NOT EXISTS study_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    study_date TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TEXT NOT NULL,
    bookmarked INTEGER NOT NULL DEFAULT 0
  );
  CREATE INDEX IF NOT EXISTS idx_study_logs_date ON study_logs(study_date);
`);

// Migration: add bookmarked column if it doesn't exist
try {
  db.exec(`ALTER TABLE study_logs ADD COLUMN bookmarked INTEGER NOT NULL DEFAULT 0`);
} catch (e) {
  // Column already exists, ignore
}

// Get today's date in Asia/Tokyo timezone (YYYY-MM-DD)
function getToday() {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
}

// Get date N days ago
function getDaysAgo(n) {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date.toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
}

// Simple markdown parser (minimal)
function parseMarkdown(text) {
  if (!text) return "";

  // 改行コードを統一
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // コードブロックを一時的に退避（他の変換の影響を受けないようにする）
  const codeBlocks = [];
  text = text.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const escaped = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const langClass = lang ? ` class="language-${lang}"` : "";
    codeBlocks.push(`<pre><code${langClass}>${escaped}</code></pre>`);
    return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
  });

  // 通常のマークダウン変換
  text = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
    .replace(/\n/g, "<br>");

  // ブロック要素の前後に紛れ込んだ <br> を除去（リスト項目間・見出し周辺の過剰な空行対策）
  text = text
    .replace(/<br>\s*<(ul|li|h[1-3]|pre)/g, "<$1")
    .replace(/<\/(ul|li|h[1-3]|pre)>\s*<br>/g, "</$1>");

  // コードブロックを復元
  codeBlocks.forEach((block, i) => {
    text = text.replace(`__CODE_BLOCK_${i}__`, block);
  });

  return text;
}

// Parse URL-encoded form data
function parseFormData(body) {
  const params = new URLSearchParams(body);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
}

// Common HTML layout
function layout(title, content, opts = {}) {
  const activeNav = opts.activeNav || "";
  return `<!DOCTYPE html>
<html lang="ja" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - 英単語復習リスト</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Noto+Sans+JP:wght@400;500;600&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,400;1,8..60,500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/vs2015.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <style>
    :root {
      --accent-h: 320;
      --accent: oklch(0.55 0.13 var(--accent-h));
      --accent-weak: oklch(0.95 0.03 var(--accent-h));
      --accent-ink: oklch(0.35 0.10 var(--accent-h));
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
      --bad: oklch(0.58 0.17 25);
      --bookmark: oklch(0.72 0.15 80);
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
      display: inline-grid; place-items: center;
      color: var(--ink-2);
    }
    .icon-btn:hover { background: var(--surface-2); color: var(--ink); }
    .icon-btn svg { width: 16px; height: 16px; }

    .subnav { background: var(--surface-2); border-bottom: 1px solid var(--line); }
    .subnav-inner {
      max-width: 900px; margin: 0 auto;
      padding: 12px 24px;
      display: flex; align-items: center; gap: 20px;
    }
    .subnav .subnav-links { display: flex; gap: 4px; margin-left: auto; }
    .subnav .subnav-links a {
      padding: 4px 12px; border-radius: var(--radius);
      font-size: 13px; color: var(--ink-2); font-weight: 500;
    }
    .subnav .subnav-links a:hover { background: var(--surface); color: var(--ink); text-decoration: none; }
    .subnav .subnav-links a.active { background: var(--surface); color: var(--ink); border: 1px solid var(--line); }

    .main { max-width: 900px; width: 100%; margin: 0 auto; padding: 40px 24px 80px; flex: 1; }

    .eyebrow {
      font-family: var(--f-mono); font-size: 11px;
      color: var(--ink-3); letter-spacing: 0.1em;
      text-transform: uppercase; font-weight: 500;
    }
    .wm-head { margin-bottom: 28px; }
    .wm-title {
      font-family: var(--f-serif); font-size: 30px; font-weight: 500;
      letter-spacing: -0.015em; margin: 8px 0 14px;
    }
    .page-head {
      display: flex; align-items: flex-end; justify-content: space-between;
      gap: 24px; margin-bottom: 32px; padding-bottom: 20px;
      border-bottom: 1px solid var(--line);
    }
    .page-head-meta { color: var(--ink-3); font-size: 13px; }

    .wm-base { font-size: 14px; color: var(--ink-3); }
    .wm-base-date { font-family: var(--f-mono); font-size: 15px; color: var(--ink); font-weight: 500; }
    .wm-base-lbl { margin-left: 6px; color: var(--ink-4); }
    .wm-navrow { display: flex; gap: 8px; margin-bottom: 28px; flex-wrap: wrap; }

    .btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 9px 16px;
      font-size: 13.5px; font-weight: 500;
      border-radius: var(--radius);
      border: 1px solid transparent;
      background: transparent;
      color: var(--ink-2);
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

    .pill {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 5px 12px; border-radius: 999px;
      font-size: 12px; font-weight: 500;
      border: 1px solid var(--line);
      background: var(--surface);
      color: var(--ink-2);
      text-decoration: none;
      cursor: pointer;
    }
    .pill:hover { text-decoration: none; }
    .pill.active {
      background: var(--ink); color: var(--bg); border-color: var(--ink);
    }

    .tbl {
      width: 100%; border-collapse: collapse;
      font-size: 14px;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      overflow: hidden;
    }
    .tbl th, .tbl td {
      padding: 14px 18px;
      text-align: left;
      border-bottom: 1px solid var(--line);
      vertical-align: top;
    }
    .tbl th {
      font-size: 11px; font-weight: 500;
      color: var(--ink-3); letter-spacing: 0.08em;
      text-transform: uppercase;
      background: var(--surface-2);
    }
    .tbl tr:last-child td { border-bottom: none; }
    .tbl td.num { color: var(--ink); font-variant-numeric: tabular-nums; font-family: var(--f-mono); font-size: 13px; font-weight: 500; }

    .wm-logs { display: flex; flex-direction: column; gap: 6px; }
    .wm-log-pv {
      display: flex; justify-content: space-between; gap: 16px;
      padding: 10px 12px; background: var(--surface-2);
      border-radius: var(--radius); color: var(--ink);
      text-decoration: none; font-size: 13px;
    }
    .wm-log-pv:hover { background: var(--surface-3); text-decoration: none; }
    .wm-log-txt { font-family: var(--f-serif); color: var(--ink); line-height: 1.5; }
    .wm-log-date { font-family: var(--f-mono); font-size: 11px; color: var(--ink-4); white-space: nowrap; }

    .wm-logs-count { color: var(--ink-3); font-size: 12px; margin-bottom: 6px; font-family: var(--f-mono); }
    .wm-empty-cell { color: var(--ink-4); font-size: 13px; }

    .wm-form { display: flex; flex-direction: column; gap: 20px; max-width: 680px; }
    .wm-field { display: flex; flex-direction: column; gap: 6px; }
    .wm-field-lbl {
      font-family: var(--f-mono); font-size: 11px;
      color: var(--ink-3); letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .wm-field-lbl-hint { color: var(--ink-4); font-size: 11px; font-family: var(--f-mono); margin-left: 6px; text-transform: none; letter-spacing: 0; }
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
    .wm-textarea { font-family: var(--f-mono); font-size: 13px; line-height: 1.6; resize: vertical; min-height: 220px; }

    .wm-filter { display: flex; gap: 8px; margin-bottom: 20px; }

    .back-link {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 13px; color: var(--ink-3);
      margin-bottom: 32px; text-decoration: none;
    }
    .back-link:hover { color: var(--accent); text-decoration: none; }

    .log-head {
      display: flex; justify-content: space-between; align-items: flex-start;
      gap: 16px; flex-wrap: wrap;
      padding-bottom: 24px; margin-bottom: 32px; border-bottom: 1px solid var(--line);
    }
    .log-created { font-family: var(--f-mono); font-size: 12px; color: var(--ink-4); margin-top: 4px; }
    .section-h2 { font-family: var(--f-serif); font-size: 22px; font-weight: 500; margin: 36px 0 16px; letter-spacing: -0.01em; }
    .log-content {
      font-family: var(--f-serif); font-size: 16px; line-height: 1.75; color: var(--ink);
      background: var(--surface); border: 1px solid var(--line);
      padding: 24px 28px; border-radius: var(--radius-lg);
    }
    .log-content h1, .log-content h2, .log-content h3 { font-family: var(--f-serif); margin-top: 0; letter-spacing: -0.01em; }
    .log-content code {
      background: var(--surface-3); padding: 2px 6px; border-radius: 3px;
      font-family: var(--f-mono); font-size: 12.5px;
    }
    .log-content pre {
      background: oklch(0.17 0.008 260); border-radius: var(--radius);
      padding: 16px; overflow-x: auto; margin: 16px 0;
    }
    .log-content pre code {
      background: none; padding: 0;
      color: oklch(0.85 0.02 260);
      font-size: 13px; line-height: 1.5;
    }
    .log-content ul { margin: 8px 0; padding-left: 22px; }
    .log-content li { margin: 2px 0; line-height: 1.6; }
    .log-content br + br { display: none; }

    .star {
      width: 28px; height: 28px; border-radius: 50%;
      display: inline-grid; place-items: center;
      border: none; background: transparent;
      color: var(--ink-4);
      transition: color 0.15s, background 0.15s;
    }
    .star:hover { background: var(--surface-3); }
    .star.active { color: var(--bookmark); }
    .star svg { width: 16px; height: 16px; }

    .error {
      background: color-mix(in oklch, var(--bad) 10%, var(--surface));
      border: 1px solid color-mix(in oklch, var(--bad) 30%, var(--line));
      color: var(--bad);
      padding: 10px 14px; border-radius: var(--radius);
      margin-bottom: 15px; font-size: 13.5px;
    }

    .foot {
      margin-top: 64px; padding: 24px 0;
      border-top: 1px solid var(--line);
      color: var(--ink-4); font-size: 12px;
      text-align: center;
      font-family: var(--f-mono);
      letter-spacing: 0.05em;
    }
  </style>
  <script>
    (function(){
      try {
        var t = localStorage.getItem('eiken-theme') || 'light';
        var a = localStorage.getItem('eiken-accent') || 'plum';
        var M = { indigo:255, moss:145, ember:30, plum:320, slate:240 };
        document.documentElement.setAttribute('data-theme', t);
        document.documentElement.style.setProperty('--accent-h', String(M[a] || 320));
      } catch(e) {}
    })();
  </script>
</head>
<body>
  <div class="app">
    <header class="header">
      <div class="header-inner">
        <a class="brand" href="/">
          <span class="brand-mark">E</span>
          <span>Eiken 1</span>
          <span class="brand-sub">Reading Practice</span>
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
        <span class="eyebrow">WORD MEMORY · 間隔反復</span>
        <div class="subnav-links">
          <a href="/" class="${activeNav === "index" ? "active" : ""}">トップ</a>
          <a href="/new" class="${activeNav === "new" ? "active" : ""}">新規登録</a>
          <a href="/logs" class="${activeNav === "logs" ? "active" : ""}">全ログ一覧</a>
        </div>
      </div>
    </div>
    <main class="main">
      ${content}
    </main>
    <footer class="foot">EIKEN 1 · WORD MEMORY · SPACED REVIEW</footer>
  </div>
  <script>hljs.highlightAll();</script>
</body>
</html>`;
}

// GET / - Top page with review table
function handleIndex(res, offset = 0) {
  const baseDate = getDaysAgo(-offset);
  const baseDateLabel =
    offset === 0 ? "今日" : offset > 0 ? `${offset}日後` : `${-offset}日前`;

  const reviewDays = [
    { label: "昨日 (d-1)", date: getDaysAgo(1 - offset) },
    { label: "3日前 (d-3)", date: getDaysAgo(3 - offset) },
    { label: "7日前 (d-7)", date: getDaysAgo(7 - offset) },
    { label: "14日前 (d-14)", date: getDaysAgo(14 - offset) },
    { label: "30日前 (d-30)", date: getDaysAgo(30 - offset) },
  ];

  const stmt = db.prepare(
    "SELECT * FROM study_logs WHERE study_date = ? ORDER BY id DESC",
  );

  let tableRows = "";
  for (const day of reviewDays) {
    const logs = stmt.all(day.date);
    let cellContent;
    if (logs.length > 0) {
      const items = logs
        .map((log) => {
          const preview =
            log.text.substring(0, 70) + (log.text.length > 70 ? "…" : "");
          return `<a href="/logs/${log.id}" class="wm-log-pv"><span class="wm-log-txt">${preview}</span><span class="wm-log-date">${log.study_date}</span></a>`;
        })
        .join("");
      cellContent = `<div class="wm-logs"><div class="wm-logs-count">${logs.length} 件</div>${items}</div>`;
    } else {
      cellContent = '<span class="wm-empty-cell">ログなし</span>';
    }
    tableRows += `<tr>
      <td style="width: 180px;">
        <div style="font-weight:500; color: var(--ink);">${day.label}</div>
        <div style="font-family: var(--f-mono); font-size: 12px; color: var(--ink-3); margin-top: 2px;">${day.date}</div>
      </td>
      <td>${cellContent}</td>
    </tr>`;
  }

  const arrowL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M15 6l-6 6 6 6"/></svg>';
  const arrowR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M9 6l6 6-6 6"/></svg>';

  const content = `
    <div class="wm-head">
      <div class="eyebrow">SPACED REVIEW · 間隔反復</div>
      <h1 class="wm-title">今日の復習対象</h1>
      <div class="wm-base">
        基準日: <span class="wm-base-date">${baseDate}</span> <span class="wm-base-lbl">(${baseDateLabel})</span>
      </div>
    </div>

    <div class="wm-navrow">
      <a class="btn ghost" href="/?offset=${offset - 1}">${arrowL} 昨日</a>
      ${offset !== 0 ? `<a class="btn primary" href="/">今日に戻る</a>` : ""}
      <a class="btn ghost" href="/?offset=${offset + 1}">明日 ${arrowR}</a>
    </div>

    <table class="tbl">
      <thead>
        <tr><th style="width: 180px;">復習対象日</th><th>学習ログ</th></tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  `;

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(layout("英単語復習リスト", content, { activeNav: "index" }));
}

// GET /new - New log form
function handleNew(res, error = "") {
  const today = getToday();
  const errorHtml = error ? `<div class="error">${error}</div>` : "";

  const content = `
    <div class="wm-head">
      <div class="eyebrow">SPACED REVIEW · NEW</div>
      <h1 class="wm-title">新規登録</h1>
    </div>
    ${errorHtml}
    <form class="wm-form" method="POST" action="/create">
      <label class="wm-field">
        <span class="wm-field-lbl">学習日</span>
        <input class="input" type="date" name="study_date" value="${today}" required>
      </label>
      <label class="wm-field">
        <span class="wm-field-lbl">学習内容<span class="wm-field-lbl-hint">Markdown可</span></span>
        <textarea class="input wm-textarea" name="text" placeholder="今日の学習内容...&#10;&#10;- 覚えた単語&#10;- 間違えた問題&#10;- 気づき" required></textarea>
      </label>
      <div style="display:flex; gap:8px;">
        <button type="submit" class="btn accent">送信</button>
        <a href="/" class="btn ghost">キャンセル</a>
      </div>
    </form>
  `;

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(layout("新規登録", content, { activeNav: "new" }));
}

// POST /create - Create new log
function handleCreate(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    const data = parseFormData(body);

    // Validation
    if (!data.text || data.text.trim() === "") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      return handleNew(res, "学習内容を入力してください");
    }

    const studyDate = data.study_date || getToday();
    const createdAt = new Date().toISOString();

    const stmt = db.prepare(
      "INSERT INTO study_logs (study_date, text, created_at) VALUES (?, ?, ?)",
    );
    stmt.run(studyDate, data.text.trim(), createdAt);

    res.writeHead(302, { Location: "/" });
    res.end();
  });
}

// GET /logs - All logs list
function handleLogs(res, bookmarkedOnly = false) {
  const logs = bookmarkedOnly
    ? db.prepare("SELECT * FROM study_logs WHERE bookmarked = 1 ORDER BY study_date DESC, id DESC").all()
    : db.prepare("SELECT * FROM study_logs ORDER BY study_date DESC, id DESC").all();

  const returnPath = bookmarkedOnly ? "/logs?bookmarked=1" : "/logs";

  const starFill = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.8l6.1-.7z"/></svg>';
  const starLine = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.8l6.1-.7z"/></svg>';

  let tableRows = "";
  for (const log of logs) {
    const preview =
      log.text.substring(0, 80) + (log.text.length > 80 ? "…" : "");
    const starSvg = log.bookmarked ? starFill : starLine;
    const starClass = log.bookmarked ? "star active" : "star";
    tableRows += `<tr>
      <td class="num" style="width: 140px;">${log.study_date}</td>
      <td><a href="/logs/${log.id}" style="color: var(--ink);">${preview}</a></td>
      <td class="num" style="width: 140px; color: var(--ink-3);">${log.created_at.split("T")[0]}</td>
      <td style="width: 56px;">
        <form method="POST" action="/logs/${log.id}/bookmark" style="display:inline; margin:0;">
          <input type="hidden" name="return_to" value="${returnPath}">
          <button type="submit" class="${starClass}" title="ブックマーク">${starSvg}</button>
        </form>
      </td>
    </tr>`;
  }

  const filterBar = `<div class="wm-filter">
    <a href="/logs" class="pill ${!bookmarkedOnly ? "active" : ""}">すべて</a>
    <a href="/logs?bookmarked=1" class="pill ${bookmarkedOnly ? "active" : ""}">
      <span style="color: ${bookmarkedOnly ? "white" : "var(--bookmark)"}; display: inline-flex;">${starFill}</span>
      ブックマークのみ
    </a>
  </div>`;

  const headTitle = bookmarkedOnly ? "ブックマーク済みログ" : "全ログ一覧";
  const emptyMessage = bookmarkedOnly
    ? '<div style="padding: 48px 0; text-align: center; color: var(--ink-3);">ブックマークされたログはありません。</div>'
    : '<div style="padding: 48px 0; text-align: center; color: var(--ink-3);">まだログがありません。</div>';

  const headBlock = `<div class="page-head">
    <div>
      <div class="eyebrow" style="margin-bottom: 8px;">SPACED REVIEW · LOGS</div>
      <h1 class="wm-title" style="margin: 0;">${headTitle}</h1>
    </div>
    <div class="page-head-meta">${logs.length} 件</div>
  </div>`;

  const content =
    logs.length > 0
      ? `${headBlock}
    ${filterBar}
    <table class="tbl">
      <thead>
        <tr><th style="width: 140px;">学習日</th><th>内容</th><th style="width: 140px;">作成日</th><th style="width: 56px;"></th></tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>`
      : `${headBlock}${filterBar}${emptyMessage}`;

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(layout(headTitle, content, { activeNav: "logs" }));
}

// GET /logs/:id - Log detail
function handleLogDetail(res, id) {
  const log = db.prepare("SELECT * FROM study_logs WHERE id = ?").get(id);

  if (!log) {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(
      layout(
        "エラー",
        '<div style="padding: 48px 0; text-align:center; color: var(--ink-3);">ログが見つかりません。</div>'
      )
    );
    return;
  }

  const starFill = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.8l6.1-.7z"/></svg>';
  const starLine = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.8l6.1-.7z"/></svg>';
  const arrowL = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>';
  const bmLabel = log.bookmarked ? "ブックマーク済み" : "ブックマーク";
  const bmBtnClass = log.bookmarked ? "btn accent" : "btn ghost";
  const bmSvg = log.bookmarked ? starFill : starLine;

  const escapeAttr = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const content = `
    <a href="/logs" class="back-link">${arrowL} 全ログ一覧</a>

    <div class="log-head">
      <div>
        <div class="eyebrow">学習日 ${log.study_date}</div>
        <div class="log-created">作成日 ${log.created_at}</div>
      </div>
      <form method="POST" action="/logs/${log.id}/bookmark" style="margin:0;">
        <input type="hidden" name="return_to" value="/logs/${log.id}">
        <button type="submit" class="${bmBtnClass}">
          <span style="display:inline-flex;">${bmSvg}</span>
          ${bmLabel}
        </button>
      </form>
    </div>

    <h2 class="section-h2">内容</h2>
    <div class="log-content">
      ${parseMarkdown(log.text)}
    </div>

    <h2 class="section-h2">編集</h2>
    <form class="wm-form" method="POST" action="/logs/${log.id}/edit">
      <label class="wm-field">
        <span class="wm-field-lbl">学習日</span>
        <input class="input" type="date" name="study_date" value="${log.study_date}" required>
      </label>
      <label class="wm-field">
        <span class="wm-field-lbl">内容<span class="wm-field-lbl-hint">Markdown可</span></span>
        <textarea class="input wm-textarea" name="text" required>${escapeAttr(log.text)}</textarea>
      </label>
      <div>
        <button type="submit" class="btn primary">更新</button>
      </div>
    </form>
  `;

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(layout("ログ詳細", content));
}

// POST /logs/:id/bookmark - Toggle bookmark
function handleBookmarkToggle(req, res, id) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    const data = parseFormData(body);

    const log = db.prepare("SELECT bookmarked FROM study_logs WHERE id = ?").get(id);
    if (!log) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(layout("エラー", "<p>ログが見つかりません。</p>"));
      return;
    }

    const newValue = log.bookmarked ? 0 : 1;
    db.prepare("UPDATE study_logs SET bookmarked = ? WHERE id = ?").run(newValue, id);

    const returnTo = data.return_to || "/logs";
    res.writeHead(302, { Location: returnTo });
    res.end();
  });
}

// POST /logs/:id/edit - Update log
function handleLogEdit(req, res, id) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    const data = parseFormData(body);

    if (!data.text || data.text.trim() === "") {
      res.writeHead(302, { Location: `/logs/${id}` });
      res.end();
      return;
    }

    const stmt = db.prepare(
      "UPDATE study_logs SET study_date = ?, text = ? WHERE id = ?",
    );
    stmt.run(data.study_date, data.text.trim(), id);

    res.writeHead(302, { Location: `/logs/${id}` });
    res.end();
  });
}

// Request handler
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;
  const method = req.method;

  console.log(`${method} ${pathname}`);

  try {
    // Routing
    if (method === "GET" && pathname === "/") {
      const offset = parseInt(url.searchParams.get("offset") || "0", 10);
      handleIndex(res, offset);
    } else if (method === "GET" && pathname === "/new") {
      handleNew(res);
    } else if (method === "POST" && pathname === "/create") {
      handleCreate(req, res);
    } else if (method === "GET" && pathname === "/logs") {
      const bookmarkedOnly = url.searchParams.get("bookmarked") === "1";
      handleLogs(res, bookmarkedOnly);
    } else if (method === "GET" && pathname.match(/^\/logs\/(\d+)$/)) {
      const id = parseInt(pathname.match(/^\/logs\/(\d+)$/)[1]);
      handleLogDetail(res, id);
    } else if (method === "POST" && pathname.match(/^\/logs\/(\d+)\/bookmark$/)) {
      const id = parseInt(pathname.match(/^\/logs\/(\d+)\/bookmark$/)[1]);
      handleBookmarkToggle(req, res, id);
    } else if (method === "POST" && pathname.match(/^\/logs\/(\d+)\/edit$/)) {
      const id = parseInt(pathname.match(/^\/logs\/(\d+)\/edit$/)[1]);
      handleLogEdit(req, res, id);
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
