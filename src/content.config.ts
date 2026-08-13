import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { allLocales } from './i18n/config';

// Persona-Slugs müssen mit den Dateien in /personas übereinstimmen.
// Siehe /personas/README.md und CLAUDE.md Abschnitt 5.
export const PERSONA_SLUGS = [
  'dr-marlene',
  'tobias',
  'dr-yusuf',
  'kai',
  'ingrid',
  'sandra',
  'ben',
  'franka',
  'milan',
  'elif',
] as const;

const personaSlug = z.enum(PERSONA_SLUGS);

// Kategorien gemäß /content/README.md — zugleich die Cluster-Slugs für
// /[lang]/themen/[cluster]/ (siehe src/pages/[lang]/themen/[cluster].astro).
export const CATEGORY_VALUES = [
  'tracking-genauigkeit',
  'schlafphysiologie',
  'hrv-recovery',
  'geraete-vergleich',
  'praxis-alltag',
  'methodik-limitationen',
] as const;

const category = z.enum(CATEGORY_VALUES);

// Studiendesign nach Evidenzpyramide, siehe docs/quellenbewertung.md — wird vom
// Quellen-Relevanzindex (agents/pipeline/scripts/score-quellen.mjs) vergeben, mit
// Studiendesign als höchstem Gewicht.
const evidenzstufe = z.enum([
  'meta-analyse',
  'systematisches-review',
  'rct',
  'kohorte',
  'querschnitt',
  'review',
  'fallserie',
  'sonstige',
]);

// Teilwerte des Quellen-Relevanzindex (0-100 gesamt), siehe docs/quellenbewertung.md.
const quelleTeilwerte = z.object({
  studientyp: z.number(),
  zitationsrate: z.number(),
  n: z.number(),
  aktualitaet: z.number(),
  journal: z.number(),
  preprint_malus: z.number(),
});

// Eine Quelle im Sinne der Evidenzpflicht aus CLAUDE.md Abschnitt 2: DOI oder
// PubMed-ID, sonst gilt eine peer-reviewte Behauptung nicht als belegt.
const quelle = z
  .object({
    aussage: z.string(),
    studientyp: z.enum(['peer-reviewed', 'preprint', 'manufacturer', 'institutional']),
    autoren: z.string().optional(),
    jahr: z.number().int(),
    titel: z.string(),
    journal: z.string().optional(),
    doi: z.string().optional(),
    pubmed_id: z.string().optional(),
    url: z.string().url(),
    n: z.number().int().optional(),
    // Quellen-Relevanzindex (0-100), siehe docs/quellenbewertung.md. Optional, weil ältere
    // Artikel vor Einführung dieses Index noch keine Scores haben.
    evidenzstufe: evidenzstufe.optional(),
    score: z.number().min(0).max(100).optional(),
    teilwerte: quelleTeilwerte.optional(),
    begruendung: z.string().optional(),
    // Hart ausgeschlossen (Crossref-Retraction-Check), niemals true in einem veröffentlichten
    // Artikel — score-quellen.mjs setzt in diesem Fall score auf 0.
    zurueckgezogen: z.boolean().default(false),
  })
  .refine((q) => q.studientyp !== 'peer-reviewed' || !!(q.doi || q.pubmed_id), {
    message: 'Peer-reviewte Quellen benötigen DOI oder PubMed-ID (CLAUDE.md Abschnitt 2).',
  })
  .refine((q) => !q.zurueckgezogen, {
    message: 'Zurückgezogene Quellen dürfen nicht in einem Artikel zitiert werden (Retraction-Check, docs/quellenbewertung.md).',
  });

// Ein Eintrag in der Update-Historie eines Artikels. Der jüngste Eintrag
// (nach `datum` sortiert) liefert das "Zuletzt geprüft am"-Datum im
// Artikel-Layout — keine separate, potenziell widersprüchliche Datumsangabe.
const historieEintrag = z.object({
  datum: z.coerce.date(),
  notiz: z.string(),
});

const baseArticleSchema = z.object({
  titel: z.string(),
  beschreibung: z.string(),
  sprache: z.enum(allLocales),
  datum: z.coerce.date(),
  // Mindestens ein Eintrag (üblicherweise "Erstveröffentlichung"). Siehe Kommentar oben.
  historie: z.array(historieEintrag).min(1),
  kategorie: category,
  schlagworte: z.array(z.string()).default([]),
  // Sätze für die Kernaussagen-Box ("Das sagt die Studienlage"), empfohlen: genau 3.
  kernaussagen: z.array(z.string()).min(1).max(5),
  // Praxis-Fazit-Box ("Was heißt das für die Praxis?"), EINE Box am Artikelende, 2-4 Punkte,
  // Alltagssprache ohne Fachjargon (CLAUDE.md Abschnitt 2, "Praxis-Fazit") — folgt aus dem
  // Gesamttext, nicht aus einer einzelnen Quelle. Optional: nicht jeder Artikel braucht eine.
  praxisfazit: z.array(z.string()).min(2).max(4).optional(),
  // Muss true sein, sobald der Artikel-Body mindestens einen Affiliate-Link enthält
  // (CLAUDE.md Abschnitt 6).
  affiliate: z.boolean().default(false),
  // Leer nur zulässig, wenn der Artikel keine Sachbehauptung enthält (CLAUDE.md Abschnitt 2).
  quellen: z.array(quelle).default([]),
  // IDs aus /data/products.json — steuert, welche ProductBox-Komponenten gerendert werden.
  produkte: z.array(z.string()).default([]),
  // Personas, die im PersonaOpinionBlock dieses Artikels auftreten können (>= 3 empfohlen,
  // siehe /content/README.md) — die Komponente wählt daraus deterministisch drei aus, sofern
  // `meinungen` (unten) nicht gesetzt ist.
  personas: z.array(personaSlug).default([]),
  // Optionale themenspezifische Persona-Meinungen (Pipeline-Schritt 4, siehe
  // /agents/pipeline/04-persona-stimmen.md) — wenn gesetzt, rendert PersonaOpinionBlock diese
  // statt der generischen Persona-Stimme aus /personas/<slug>.md.
  meinungen: z
    .array(
      z.object({
        persona: personaSlug,
        de: z.string(),
        en: z.string(),
      }),
    )
    .optional(),
  // Genau ein Artikel sollte featured sein — erscheint auf der Startseite als
  // Themenhub-Aufmacher (src/pages/[lang]/index.astro).
  featured: z.boolean().default(false),
  // Höchstens ein Artikel pro (kategorie, sprache) sollte istSaeule sein — der
  // Säulen-Artikel auf der Pillar-Seite /[lang]/themen/[cluster]/.
  istSaeule: z.boolean().default(false),
  // Chart-ID aus /data/charts/ für den Hero-Chart auf Startseite/Artikelkopf.
  heroChart: z.string().optional(),
  entwurf: z.boolean().default(false),
  // Offene Punkte aus Recherche/Quality-Gate, die vor "Gib frei" gegengeprüft werden sollten
  // (Pipeline-Schritt 3/5, siehe /agents/pipeline/05-review-uebergabe.md) — erscheinen im
  // mobilen Review-Block auf /entwurf/<slug>/, nie auf der öffentlichen Artikelseite.
  offenePunkte: z.array(z.string()).default([]),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/articles' }),
  schema: baseArticleSchema,
});

const comparisons = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/comparisons' }),
  schema: baseArticleSchema,
});

const glossary = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/glossary' }),
  schema: z.object({
    begriff: z.string(),
    kurzdefinition: z.string(),
    kategorie: category,
    quellen: z.array(quelle).default([]),
  }),
});

// Eine Sprachfassung einer Persona-Stimme (CLAUDE.md Abschnitt 5, /personas/README.md).
const personaVoice = z.object({
  tonfall: z.string(),
  intro: z.string(),
});

const personas = defineCollection({
  loader: glob({ pattern: ['*.md', '!README.md'], base: './personas' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    quality_gate: z.boolean(),
    grundhaltung: z.string(),
    konfliktlinien: z.array(personaSlug).default([]),
    voices: z.object({
      de: personaVoice,
      en: personaVoice,
      es: personaVoice,
    }),
  }),
});

// Regionslink: leerer String bedeutet "für diese Region kein eigener Link", die
// ProductBox-Komponente fällt dann auf `fallback` zurück. `fallback` selbst muss
// immer eine echte URL sein.
const regionLink = z.union([z.string().url(), z.literal('')]);

// Produktdatenbank, siehe /data/README.md. Jeder Eintrag braucht eine eindeutige
// `id` (Pflicht für den file()-Loader) und wird von der ProductBox-Komponente
// (CLAUDE.md Abschnitt 6, "Werbekennzeichnung") konsumiert.
const products = defineCollection({
  loader: file('./data/products.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    kategorie: z.string(),
    links: z.object({
      de: regionLink,
      us: regionLink,
      es: regionLink,
      fallback: z.string().url(),
    }),
    netzwerk: z.string(),
    provision: z.string(),
    cookie_laufzeit: z.string(),
    status: z.enum(['aktiv', 'inaktiv', 'geplant']),
  }),
});

// Datenquelle eines Charts: Zitat + DOI oder URL. Charts werden nie aus
// Rasterbildern von Studien eingebettet, sondern aus diesen Werten als SVG neu
// gezeichnet (CLAUDE.md Abschnitt 2, "Grafiken aus Studien").
const chartQuelle = z.object({
  zitat: z.string(),
  doi: z.string().optional(),
  url: z.string().url(),
});

const chartBaseFields = {
  titel: z.string(),
  einheit: z.string().optional(),
  datenquelle: chartQuelle,
  // Pflichtfeld: macht sichtbar, dass der Chart eine eigene Darstellung ist,
  // keine Reproduktion einer Studienabbildung.
  hinweis: z.string().default('Eigene Darstellung.'),
};

const balkenDatum = z.object({ label: z.string(), wert: z.number() });
const linienDatum = z.object({ x: z.union([z.string(), z.number()]), y: z.number() });
const scatterDatum = z.object({ x: z.number(), y: z.number(), label: z.string().optional() });
// Spannweite (min/max) — z.B. Genauigkeit "0,26 bis 0,69 je nach Gerät" oder eine Abweichung
// von einer Referenz ("von" = Referenzwert/0, "bis" = gemessener Wert). `mitte` optional: nur
// setzen, wenn die Quelle tatsächlich einen Median/Mittelwert berichtet (z. B. eine
// Meta-Analyse mit gepooltem Effekt) — nicht den Mittelpunkt von `von`/`bis` erfinden, wenn die
// Quelle nur eine Spannweite ohne zentrale Kennzahl angibt. Siehe CLAUDE.md Abschnitt 2,
// "Diagramme".
const bereichDatum = z.object({
  label: z.string(),
  von: z.number(),
  bis: z.number(),
  mitte: z.number().optional(),
});

const chartSchema = z.discriminatedUnion('typ', [
  z.object({ typ: z.literal('balken'), ...chartBaseFields, daten: z.array(balkenDatum).min(1) }),
  z.object({ typ: z.literal('linie'), ...chartBaseFields, daten: z.array(linienDatum).min(2) }),
  z.object({ typ: z.literal('scatter'), ...chartBaseFields, daten: z.array(scatterDatum).min(2) }),
  // Anteile einer Gesamtheit (z. B. Schlafphasen-Verteilung einer Nacht) — ein gestapelter
  // Balken statt mehrerer separater, damit "das ergibt zusammen 100%" ohne Kopfrechnen sichtbar
  // ist. `wert` in Prozentpunkten, sollte in der Summe ~100 ergeben.
  z.object({ typ: z.literal('anteile'), ...chartBaseFields, daten: z.array(balkenDatum).min(2) }),
  // Spannweiten/Abweichungen — ein oder mehrere schwebende Balken von `von` bis `bis` auf
  // einer gemeinsamen Achse (die bei Bedarf die 0 mit einschließt), mit sichtbarer
  // Referenzlinie. Für Genauigkeits-Bandbreiten und Abweichungen von einem Referenzwert.
  // `domain` optional: erzwingt einen inhaltlich sinnvollen Achsenbereich statt der
  // automatisch aus den Werten berechneten Spanne (z. B. [0, 1] für eine Sensitivitäts-/
  // F1-Kennzahl, deren natürliche Grenzen 0 und 1 selbst die Aussage tragen).
  z.object({
    typ: z.literal('bereich'),
    ...chartBaseFields,
    daten: z.array(bereichDatum).min(1),
    domain: z.tuple([z.number(), z.number()]).optional(),
  }),
]);

// Charts, siehe /data/charts/README.md. Werden über die Chart.astro-Komponente
// gerendert (SVG, Farben aus den Theme-Tokens) und nie als Rasterbild eingebettet.
const charts = defineCollection({
  loader: glob({ pattern: '*.json', base: './data/charts' }),
  schema: chartSchema,
});

export const collections = { articles, comparisons, glossary, personas, products, charts };
