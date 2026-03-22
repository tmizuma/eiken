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
function layout(title, content) {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - 英単語復習リスト</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    h1 { color: #333; }
    nav { margin-bottom: 20px; }
    nav a { margin-right: 15px; color: #0066cc; text-decoration: none; }
    nav a:hover { text-decoration: underline; }
    .bookmark-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      line-height: 1;
      vertical-align: middle;
      color: #ccc;
      transition: color 0.15s;
    }
    .bookmark-btn:hover { color: #f5a623; }
    .bookmark-btn.active { color: #f5a623; }
    .bookmark-btn svg { display: block; }
    .filter-bar { margin-bottom: 15px; }
    .filter-bar a {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 4px;
      text-decoration: none;
      margin-right: 8px;
      font-size: 0.9em;
    }
    .filter-bar a.active { background: #4a90d9; color: white; }
    .filter-bar a:not(.active) { background: #e0e0e0; color: #333; }
    .filter-bar a:not(.active):hover { background: #d0d0d0; }
    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    th, td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
      vertical-align: top;
    }
    th { background: #4a90d9; color: white; }
    tr:nth-child(even) { background: #f9f9f9; }
    .log-item {
      padding: 8px;
      margin-bottom: 8px;
      background: #fff;
      border-left: 3px solid #4a90d9;
      border-radius: 3px;
    }
    .log-item:last-child { margin-bottom: 0; }
    .log-preview { color: #666; font-size: 0.9em; }
    .log-link { color: #0066cc; text-decoration: none; }
    .log-link:hover { text-decoration: underline; }
    form {
      background: white;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    label { display: block; margin-bottom: 5px; font-weight: bold; }
    input[type="text"], input[type="date"], textarea {
      width: 100%;
      padding: 10px;
      margin-bottom: 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }
    textarea { height: 200px; font-family: monospace; }
    button {
      background: #4a90d9;
      color: white;
      padding: 12px 24px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }
    button:hover { background: #3a7bc8; }
    .error { color: #c00; background: #fee; padding: 10px; border-radius: 4px; margin-bottom: 15px; }
    .markdown-content {
      background: white;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .markdown-content h1, .markdown-content h2, .markdown-content h3 { margin-top: 0; }
    .markdown-content code { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 0.9em; }
    .markdown-content pre {
      background: #1e1e1e;
      padding: 16px;
      border-radius: 6px;
      overflow-x: auto;
      margin: 16px 0;
    }
    .markdown-content pre code {
      background: none;
      padding: 0;
      color: #d4d4d4;
      font-size: 14px;
      line-height: 1.5;
      white-space: pre;
    }
    .markdown-content ul { margin: 0; padding-left: 20px; }
    .count { font-size: 0.8em; color: #999; }
  </style>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/vs2015.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
</head>
<body>
  <nav>
    <a href="/">トップ</a>
    <a href="/new">新規登録</a>
    <a href="/logs">全ログ一覧</a>
  </nav>
  <h1>${title}</h1>
  ${content}
  <script>hljs.highlightAll();</script>
</body>
</html>`;
}

// GET / - Top page with review table
function handleIndex(res, offset = 0) {
  // Calculate base date based on offset
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
    let cellContent = "";
    if (logs.length > 0) {
      cellContent = `<span class="count">${logs.length}件</span><br>`;
      for (const log of logs) {
        const preview =
          log.text.substring(0, 20) + (log.text.length > 20 ? "..." : "");
        cellContent += `<div class="log-item">
          <a href="/logs/${log.id}" class="log-link">${preview}</a>
          <div class="log-preview">${log.study_date}</div>
        </div>`;
      }
    } else {
      cellContent = '<span style="color: #999;">なし</span>';
    }
    tableRows += `<tr><td><strong>${day.label}</strong><br><small>${day.date}</small></td><td>${cellContent}</td></tr>`;
  }

  const content = `
    <p>基準日: ${baseDate} (${baseDateLabel})</p>
    <div style="margin-bottom: 15px;">
      <a href="/?offset=${offset - 1}" style="display: inline-block; padding: 8px 16px; background: #4a90d9; color: white; text-decoration: none; border-radius: 4px; margin-right: 10px;">← 昨日</a>
      ${offset !== 0 ? `<a href="/" style="display: inline-block; padding: 8px 16px; background: #666; color: white; text-decoration: none; border-radius: 4px; margin-right: 10px;">今日</a>` : ""}
      <a href="/?offset=${offset + 1}" style="display: inline-block; padding: 8px 16px; background: #4a90d9; color: white; text-decoration: none; border-radius: 4px;">明日 →</a>
    </div>
    <table>
      <tr><th>復習対象日</th><th>学習ログ</th></tr>
      ${tableRows}
    </table>
  `;

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(layout("英単語復習リスト", content));
}

// GET /new - New log form
function handleNew(res, error = "") {
  const today = getToday();
  const errorHtml = error ? `<div class="error">${error}</div>` : "";

  const content = `
    ${errorHtml}
    <form method="POST" action="/create">
      <label for="study_date">学習日</label>
      <input type="date" id="study_date" name="study_date" value="${today}" required>

      <label for="text">学習内容 (Markdown可)</label>
      <textarea id="text" name="text" placeholder="今日学んだ内容を記入..." required></textarea>

      <button type="submit">登録</button>
    </form>
  `;

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(layout("新規登録", content));
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

  let tableRows = "";
  for (const log of logs) {
    const preview =
      log.text.substring(0, 50) + (log.text.length > 50 ? "..." : "");
    const bookmarkSvg = log.bookmarked
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';
    const bookmarkClass = log.bookmarked ? "bookmark-btn active" : "bookmark-btn";
    tableRows += `<tr>
      <td>${log.study_date}</td>
      <td><a href="/logs/${log.id}" class="log-link">${preview}</a></td>
      <td>${log.created_at.split("T")[0]}</td>
      <td style="text-align: center;">
        <form method="POST" action="/logs/${log.id}/bookmark" style="display:inline; background:none; padding:0; box-shadow:none;">
          <input type="hidden" name="return_to" value="${returnPath}">
          <button type="submit" class="${bookmarkClass}" title="ブックマーク">${bookmarkSvg}</button>
        </form>
      </td>
    </tr>`;
  }

  const filterBar = `<div class="filter-bar">
    <a href="/logs" class="${!bookmarkedOnly ? "active" : ""}">すべて</a>
    <a href="/logs?bookmarked=1" class="${bookmarkedOnly ? "active" : ""}">ブックマークのみ</a>
  </div>`;

  const title = bookmarkedOnly ? "ブックマーク" : "全ログ一覧";
  const emptyMessage = bookmarkedOnly
    ? "<p>ブックマークされたログはありません。</p>"
    : "<p>まだログがありません。</p>";

  const content =
    logs.length > 0
      ? `
    ${filterBar}
    <table>
      <tr><th>学習日</th><th>内容</th><th>作成日</th><th style="width: 60px;"></th></tr>
      ${tableRows}
    </table>
  `
      : `${filterBar}${emptyMessage}`;

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(layout(title, content));
}

// GET /logs/:id - Log detail
function handleLogDetail(res, id) {
  const log = db.prepare("SELECT * FROM study_logs WHERE id = ?").get(id);

  if (!log) {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(layout("エラー", "<p>ログが見つかりません。</p>"));
    return;
  }

  const bookmarkSvg = log.bookmarked
    ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>'
    : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';
  const bookmarkLabel = log.bookmarked ? "ブックマーク解除" : "ブックマークに追加";
  const bookmarkClass = log.bookmarked ? "bookmark-btn active" : "bookmark-btn";

  const content = `
    <div style="margin-bottom: 15px;">
      <form method="POST" action="/logs/${log.id}/bookmark" style="display:inline; background:none; padding:0; box-shadow:none;">
        <input type="hidden" name="return_to" value="/logs/${log.id}">
        <button type="submit" class="${bookmarkClass}" style="display: inline-flex; align-items: center; gap: 6px;">
          ${bookmarkSvg} ${bookmarkLabel}
        </button>
      </form>
    </div>
    <p><strong>学習日:</strong> ${log.study_date}</p>
    <p><strong>作成日:</strong> ${log.created_at}</p>

    <h2>内容</h2>
    <div class="markdown-content">
      ${parseMarkdown(log.text)}
    </div>

    <h2>編集</h2>
    <form method="POST" action="/logs/${log.id}/edit">
      <label for="study_date">学習日</label>
      <input type="date" id="study_date" name="study_date" value="${
        log.study_date
      }" required>

      <label for="text">学習内容 (Markdown可)</label>
      <textarea id="text" name="text" required>${log.text}</textarea>

      <button type="submit">更新</button>
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
