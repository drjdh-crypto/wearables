// Which of the six kategorie values (src/content.config.ts: CATEGORY_VALUES)
// the homepage features as cluster sections. All six get a pillar page under
// /[lang]/themen/[cluster]/ regardless — this just curates the homepage.
export const HOMEPAGE_CLUSTERS = [
  'schlafphysiologie',
  'tracking-genauigkeit',
  'geraete-vergleich',
] as const;
