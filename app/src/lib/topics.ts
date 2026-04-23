export const TOPIC_TO_ID: Record<string, string> = {
  政治: "politics",
  経済: "economy",
  科学: "science",
  環境: "env",
  教育: "edu",
  心理: "psych",
  文化: "culture",
  メディア: "media",
  歴史: "history",
  生物: "bio",
  フリー: "free",
};

export function topicId(ja: string): string {
  return TOPIC_TO_ID[ja] || "free";
}
