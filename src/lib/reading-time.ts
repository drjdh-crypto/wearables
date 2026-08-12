// Grobe Lesedauer-Schätzung aus dem rohen Markdown-Body eines Artikels.
// Bewusst simpel (keine Tokenizer-Abhängigkeit) — Code-Blöcke und
// Markdown-Satzzeichen werden vor dem Zählen entfernt, das reicht für eine
// Minutenangabe, die nicht als exakte Wissenschaft daherkommen muss.
export function estimateReadingMinutes(markdown: string | undefined, wordsPerMinute = 200): number {
  if (!markdown) return 1;
  const cleaned = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_~`|>[\]()-]/g, ' ');
  const words = cleaned.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}

/** Sortiert eine Update-Historie absteigend und liefert den jüngsten Eintrag. */
export function latestHistoryEntry<T extends { datum: Date }>(historie: T[]): T {
  return [...historie].sort((a, b) => b.datum.valueOf() - a.datum.valueOf())[0];
}
