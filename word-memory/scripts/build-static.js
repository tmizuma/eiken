const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const DB_PATH = path.join(__dirname, "..", "app.db");
const DIST_DIR = path.join(__dirname, "..", "dist");

// Read all logs from SQLite
const db = new Database(DB_PATH, { readonly: true });
const logs = db.prepare("SELECT * FROM study_logs ORDER BY study_date DESC, id DESC").all();
db.close();

// Create dist directory
fs.mkdirSync(DIST_DIR, { recursive: true });

// Write data.json
fs.writeFileSync(path.join(DIST_DIR, "data.json"), JSON.stringify(logs));
console.log(`Exported ${logs.length} logs to dist/data.json`);

// --- Shared CSS & layout helper ---

const CSS = `
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
    .filter-bar { margin-bottom: 15px; }
    .filter-bar a, .filter-bar button {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 4px;
      text-decoration: none;
      margin-right: 8px;
      font-size: 0.9em;
      border: none;
      cursor: pointer;
    }
    .filter-bar .active { background: #4a90d9; color: white; }
    .filter-bar :not(.active) { background: #e0e0e0; color: #333; }
    .filter-bar :not(.active):hover { background: #d0d0d0; }
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
    .bookmark-icon { color: #f5a623; margin-right: 4px; }
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
`;

function layout(title, bodyContent, extraHead = "") {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - 英単語復習リスト</title>
  <style>${CSS}</style>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/vs2015.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  ${extraHead}
</head>
<body>
  <nav>
    <a href="/">トップ</a>
    <a href="/logs">全ログ一覧</a>
  </nav>
  <h1>${title}</h1>
  ${bodyContent}
</body>
</html>`;
}

// --- Shared client-side parseMarkdown function ---
const PARSE_MARKDOWN_JS = `
function parseMarkdown(text) {
  if (!text) return "";
  text = text.replace(/\\r\\n/g, "\\n").replace(/\\r/g, "\\n");
  var codeBlocks = [];
  text = text.replace(/\\\`\\\`\\\`(\\w*)\\n([\\s\\S]*?)\\\`\\\`\\\`/g, function(match, lang, code) {
    var escaped = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var langClass = lang ? ' class="language-' + lang + '"' : "";
    codeBlocks.push("<pre><code" + langClass + ">" + escaped + "</code></pre>");
    return "__CODE_BLOCK_" + (codeBlocks.length - 1) + "__";
  });
  text = text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\\*\\*(.+?)\\*\\*/g, "<strong>$1</strong>")
    .replace(/\\*(.+?)\\*/g, "<em>$1</em>")
    .replace(/\\\`(.+?)\\\`/g, "<code>$1</code>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\\/li>)/s, "<ul>$1</ul>")
    .replace(/\\n/g, "<br>");
  codeBlocks.forEach(function(block, i) {
    text = text.replace("__CODE_BLOCK_" + i + "__", block);
  });
  return text;
}
`;

// --- index.html (review table, client-side rendered) ---

const indexContent = `
  <div id="app"></div>
  <script>
  ${PARSE_MARKDOWN_JS}

  function getToday(offset) {
    var d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
  }

  function getDaysAgo(n, offset) {
    var d = new Date();
    d.setDate(d.getDate() + offset - n);
    return d.toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
  }

  fetch("/data.json")
    .then(function(r) { return r.json(); })
    .then(function(logs) {
      var params = new URLSearchParams(location.search);
      var offset = parseInt(params.get("offset") || "0", 10);

      var baseDate = getToday(offset);
      var baseDateLabel = offset === 0 ? "今日" : offset > 0 ? offset + "日後" : (-offset) + "日前";

      var reviewDays = [
        { label: "昨日 (d-1)", date: getDaysAgo(1, offset) },
        { label: "3日前 (d-3)", date: getDaysAgo(3, offset) },
        { label: "7日前 (d-7)", date: getDaysAgo(7, offset) },
        { label: "14日前 (d-14)", date: getDaysAgo(14, offset) },
        { label: "30日前 (d-30)", date: getDaysAgo(30, offset) },
      ];

      // Index logs by study_date
      var byDate = {};
      logs.forEach(function(log) {
        if (!byDate[log.study_date]) byDate[log.study_date] = [];
        byDate[log.study_date].push(log);
      });

      var tableRows = "";
      reviewDays.forEach(function(day) {
        var dayLogs = byDate[day.date] || [];
        var cellContent = "";
        if (dayLogs.length > 0) {
          cellContent = '<span class="count">' + dayLogs.length + '件</span><br>';
          dayLogs.forEach(function(log) {
            var preview = log.text.substring(0, 20) + (log.text.length > 20 ? "..." : "");
            cellContent += '<div class="log-item">' +
              '<a href="/log?id=' + log.id + '" class="log-link">' + escapeHtml(preview) + '</a>' +
              '<div class="log-preview">' + log.study_date + '</div>' +
              '</div>';
          });
        } else {
          cellContent = '<span style="color: #999;">なし</span>';
        }
        tableRows += '<tr><td><strong>' + day.label + '</strong><br><small>' + day.date + '</small></td><td>' + cellContent + '</td></tr>';
      });

      var todayBtn = offset !== 0
        ? '<a href="/" style="display: inline-block; padding: 8px 16px; background: #666; color: white; text-decoration: none; border-radius: 4px; margin-right: 10px;">今日</a>'
        : "";

      document.getElementById("app").innerHTML =
        '<p>基準日: ' + baseDate + ' (' + baseDateLabel + ')</p>' +
        '<div style="margin-bottom: 15px;">' +
          '<a href="/?offset=' + (offset - 1) + '" style="display: inline-block; padding: 8px 16px; background: #4a90d9; color: white; text-decoration: none; border-radius: 4px; margin-right: 10px;">\\u2190 昨日</a>' +
          todayBtn +
          '<a href="/?offset=' + (offset + 1) + '" style="display: inline-block; padding: 8px 16px; background: #4a90d9; color: white; text-decoration: none; border-radius: 4px;">明日 \\u2192</a>' +
        '</div>' +
        '<table>' +
          '<tr><th>復習対象日</th><th>学習ログ</th></tr>' +
          tableRows +
        '</table>';
    });

  function escapeHtml(text) {
    var div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
  </script>
`;

fs.writeFileSync(path.join(DIST_DIR, "index.html"), layout("英単語復習リスト", indexContent));
console.log("Generated dist/index.html");

// --- logs.html (all logs list, client-side rendered) ---

const logsContent = `
  <div id="app"></div>
  <script>
  fetch("/data.json")
    .then(function(r) { return r.json(); })
    .then(function(logs) {
      var params = new URLSearchParams(location.search);
      var bookmarkedOnly = params.get("bookmarked") === "1";

      var filtered = bookmarkedOnly
        ? logs.filter(function(l) { return l.bookmarked === 1; })
        : logs;

      var filterBar = '<div class="filter-bar">' +
        '<a href="/logs" class="' + (!bookmarkedOnly ? "active" : "") + '">すべて</a>' +
        '<a href="/logs?bookmarked=1" class="' + (bookmarkedOnly ? "active" : "") + '">ブックマークのみ</a>' +
        '</div>';

      if (filtered.length === 0) {
        var emptyMsg = bookmarkedOnly
          ? "<p>ブックマークされたログはありません。</p>"
          : "<p>まだログがありません。</p>";
        document.getElementById("app").innerHTML = filterBar + emptyMsg;
        return;
      }

      var tableRows = "";
      filtered.forEach(function(log) {
        var preview = log.text.substring(0, 50) + (log.text.length > 50 ? "..." : "");
        var bookmarkMark = log.bookmarked ? '<span class="bookmark-icon" title="ブックマーク済">&#x2605;</span>' : "";
        tableRows += '<tr>' +
          '<td>' + log.study_date + '</td>' +
          '<td>' + bookmarkMark + '<a href="/log?id=' + log.id + '" class="log-link">' + escapeHtml(preview) + '</a></td>' +
          '<td>' + log.created_at.split("T")[0] + '</td>' +
          '</tr>';
      });

      var title = bookmarkedOnly ? "ブックマーク" : "全ログ一覧";
      document.querySelector("h1").textContent = title;

      document.getElementById("app").innerHTML = filterBar +
        '<table>' +
          '<tr><th>学習日</th><th>内容</th><th>作成日</th></tr>' +
          tableRows +
        '</table>';
    });

  function escapeHtml(text) {
    var div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
  </script>
`;

fs.writeFileSync(path.join(DIST_DIR, "logs.html"), layout("全ログ一覧", logsContent));
console.log("Generated dist/logs.html");

// --- log.html (log detail, client-side rendered) ---

const logContent = `
  <div id="app"><p>読み込み中...</p></div>
  <script>
  ${PARSE_MARKDOWN_JS}

  fetch("/data.json")
    .then(function(r) { return r.json(); })
    .then(function(logs) {
      var params = new URLSearchParams(location.search);
      var id = parseInt(params.get("id"), 10);

      var log = null;
      for (var i = 0; i < logs.length; i++) {
        if (logs[i].id === id) { log = logs[i]; break; }
      }

      if (!log) {
        document.getElementById("app").innerHTML = "<p>ログが見つかりません。</p>";
        return;
      }

      document.querySelector("h1").textContent = "ログ詳細";

      var bookmarkMark = log.bookmarked
        ? '<span class="bookmark-icon" title="ブックマーク済">&#x2605; ブックマーク済</span>'
        : "";

      document.getElementById("app").innerHTML =
        (bookmarkMark ? '<p>' + bookmarkMark + '</p>' : '') +
        '<p><strong>学習日:</strong> ' + log.study_date + '</p>' +
        '<p><strong>作成日:</strong> ' + log.created_at + '</p>' +
        '<h2>内容</h2>' +
        '<div class="markdown-content">' + parseMarkdown(log.text) + '</div>';

      hljs.highlightAll();
    });
  </script>
`;

fs.writeFileSync(path.join(DIST_DIR, "log.html"), layout("ログ詳細", logContent));
console.log("Generated dist/log.html");

console.log("Build complete!");
