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

// Kategorien gemäß /content/README.md
const category = z.enum([
  'tracking-genauigkeit',
  'schlafphysiologie',
  'hrv-recovery',
  'geraete-vergleich',
  'praxis-alltag',
  'methodik-limitationen',
]);

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
  })
  .refine((q) => q.studientyp !== 'peer-reviewed' || !!(q.doi || q.pubmed_id), {
    message: 'Peer-reviewte Quellen benötigen DOI oder PubMed-ID (CLAUDE.md Abschnitt 2).',
  });

const baseArticleSchema = z.object({
  titel: z.string(),
  beschreibung: z.string(),
  sprache: z.enum(allLocales),
  datum: z.coerce.date(),
  aktualisiert: z.coerce.date().optional(),
  kategorie: category,
  schlagworte: z.array(z.string()).default([]),
  // Muss true sein, sobald der Artikel-Body mindestens einen Affiliate-Link enthält
  // (CLAUDE.md Abschnitt 6).
  affiliate: z.boolean().default(false),
  // Leer nur zulässig, wenn der Artikel keine Sachbehauptung enthält (CLAUDE.md Abschnitt 2).
  quellen: z.array(quelle).default([]),
  // IDs aus /data/products.json — steuert, welche ProductBox-Komponenten gerendert werden.
  produkte: z.array(z.string()).default([]),
  // Personas, die im PersonaOpinionBlock dieses Artikels auftreten können (>= 3 empfohlen,
  // siehe /content/README.md) — die Komponente wählt daraus deterministisch drei aus.
  personas: z.array(personaSlug).default([]),
  entwurf: z.boolean().default(false),
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

const chartSchema = z.discriminatedUnion('typ', [
  z.object({ typ: z.literal('balken'), ...chartBaseFields, daten: z.array(balkenDatum).min(1) }),
  z.object({ typ: z.literal('linie'), ...chartBaseFields, daten: z.array(linienDatum).min(2) }),
  z.object({ typ: z.literal('scatter'), ...chartBaseFields, daten: z.array(scatterDatum).min(2) }),
]);

// Charts, siehe /data/charts/README.md. Werden über die Chart.astro-Komponente
// gerendert (SVG, Farben aus den Theme-Tokens) und nie als Rasterbild eingebettet.
const charts = defineCollection({
  loader: glob({ pattern: '*.json', base: './data/charts' }),
  schema: chartSchema,
});

export const collections = { articles, comparisons, glossary, personas, products, charts };
