#!/usr/bin/env node
// "Status"-Befehl (siehe /agents/commands/status.md): listet alle Artikel mit
// Zustand (Entwurf/veröffentlicht) und URL, für den Handy-Workflow.
//
// Aufruf: node agents/pipeline/scripts/status.mjs
// Override bei Bedarf (z. B. Preview-Deployments): SITE_URL=https://... node agents/pipeline/scripts/status.mjs

import { readFileSync, readdirSync } from 'node:fs';
import { join, basename, extname } from 'node:path';

const ARTICLES_DIR = 'content/articles';
// Cloudflare Pages, Git-verbunden mit drjdh-crypto/wearables (main → Production).
// Siehe /agents/README.md, "Hosting", falls die Git-Verbindung
// je wieder getrennt wird (GitHub → Settings → Applications → Cloudflare Pages).
const DEFAULT_SITE_URL = 'https://wearables.pages.dev';
const SITE_URL = process.env.SITE_URL ?? DEFAULT_SITE_URL;

function extractField(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*"?([^"\\n]+?)"?\\s*$`, 'm'));
  return match ? match[1].trim() : undefined;
}

const files = readdirSync(ARTICLES_DIR).filter(
  (f) => (f.endsWith('.md') || f.endsWith('.mdx')) && !f.startsWith('_'),
);

const rows = files.map((file) => {
  const raw = readFileSync(join(ARTICLES_DIR, file), 'utf8');
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
  const fm = fmMatch ? fmMatch[1] : '';
  const id = basename(file, extname(file));
  const titel = extractField(fm, 'titel') ?? '(ohne Titel)';
  const sprache = extractField(fm, 'sprache') ?? '?';
  const istEntwurf = extractField(fm, 'entwurf') === 'true';
  const pfad = istEntwurf ? `/entwurf/${id}/` : `/${sprache}/artikel/${id}/`;
  const url = SITE_URL ? `${SITE_URL}${pfad}` : pfad;
  return { id, titel, sprache, status: istEntwurf ? 'Entwurf' : 'veröffentlicht', url };
});

rows.sort((a, b) => a.status.localeCompare(b.status) || a.id.localeCompare(b.id));

console.log(`Status (${rows.length} Artikel):\n`);
for (const r of rows) {
  console.log(`- [${r.status}] ${r.titel} (${r.sprache})`);
  console.log(`  ${r.url}`);
}

if (SITE_URL !== DEFAULT_SITE_URL) {
  console.log(`\nHinweis: SITE_URL überschrieben auf ${SITE_URL} (Standard: ${DEFAULT_SITE_URL}).`);
}
