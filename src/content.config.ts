import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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

// Eine Quelle im Sinne der Evidenzpflicht aus CLAUDE.md Abschnitt 1.
const source = z
  .object({
    claim: z.string(),
    type: z.enum(['peer-reviewed', 'preprint', 'manufacturer', 'institutional']),
    authors: z.string().optional(),
    year: z.number().int(),
    title: z.string(),
    journal: z.string().optional(),
    doi: z.string().optional(),
    url: z.string().url(),
  })
  .refine((s) => s.type !== 'peer-reviewed' || !!s.doi, {
    message: 'Peer-reviewte Quellen benötigen eine DOI (CLAUDE.md Abschnitt 1).',
  });

const baseArticleSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  author: personaSlug,
  category,
  tags: z.array(z.string()).default([]),
  // Muss true sein, sobald der Artikel-Body mindestens einen Affiliate-Link enthält
  // (CLAUDE.md Abschnitt 4).
  affiliate: z.boolean().default(false),
  // Leer nur zulässig, wenn der Artikel keine Sachbehauptung enthält (CLAUDE.md Abschnitt 1).
  sources: z.array(source).default([]),
  draft: z.boolean().default(false),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/articles' }),
  schema: baseArticleSchema,
});

const comparisons = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/comparisons' }),
  schema: baseArticleSchema.extend({
    // Slugs der verglichenen Produkte, referenziert /data/products.yaml
    products: z.array(z.string()).default([]),
  }),
});

const glossary = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/glossary' }),
  schema: z.object({
    term: z.string(),
    shortDefinition: z.string(),
    category,
    sources: z.array(source).default([]),
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

export const collections = { articles, comparisons, glossary, personas };
