const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "app.db");
const db = new Database(DB_PATH);

const direction = process.argv[2];

if (direction !== "forward" && direction !== "backward") {
  console.error("Usage: node scripts/shift-dates.js <forward|backward>");
  console.error("  forward  - 全ての study_date を1日進める（未来へ）");
  console.error("  backward - 全ての study_date を1日戻す（過去へ）");
  process.exit(1);
}

const dayOffset = direction === "forward" ? "+1 day" : "-1 day";
const actionLabel = direction === "forward" ? "1日進めます" : "1日戻します";

// 現在のデータを確認
const beforeCount = db.prepare("SELECT COUNT(*) as count FROM study_logs").get();
const beforeSample = db
  .prepare("SELECT id, study_date FROM study_logs ORDER BY study_date DESC LIMIT 5")
  .all();

console.log(`全ての study_date を${actionLabel}...`);
console.log(`対象レコード数: ${beforeCount.count}`);
console.log("\n変更前 (最新5件):");
beforeSample.forEach((row) => console.log(`  ID ${row.id}: ${row.study_date}`));

// 日付を更新
const stmt = db.prepare(`UPDATE study_logs SET study_date = date(study_date, ?)`);
const result = stmt.run(dayOffset);

// 変更後を確認
const afterSample = db
  .prepare("SELECT id, study_date FROM study_logs ORDER BY study_date DESC LIMIT 5")
  .all();

console.log("\n変更後 (最新5件):");
afterSample.forEach((row) => console.log(`  ID ${row.id}: ${row.study_date}`));
console.log(`\n${result.changes}件のレコードを更新しました。`);
