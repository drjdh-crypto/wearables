#!/usr/bin/env node
// Hart geprüfte Diversitätsregeln für Schritt 1 (Recherche) der Redaktions-Pipeline,
// bevor eine Quellenliste an Schritt 2 (Draft) übergeben wird.
// Siehe /agents/pipeline/01-recherche.md.
//
// Aufruf: node agents/pipeline/scripts/validate-quellen.mjs data/quellen/<slug>.json

import { readFileSync } from 'node:fs';

const path = process.argv[2];
if (!path) {
  console.error('Usage: node validate-quellen.mjs <path-to-quellen.json>');
  process.exit(1);
}

const quellen = JSON.parse(readFileSync(path, 'utf8'));
const currentYear = new Date().getFullYear();
const errors = [];
const warnings = [];

// Regel 1: 6-10 Quellen
if (quellen.length < 6 || quellen.length > 10) {
  errors.push(`Anzahl Quellen: ${quellen.length} (erwartet 6-10).`);
}

// Regel 2: mindestens 2 aus den letzten 3 Jahren
const cutoff = currentYear - 3;
const recent = quellen.filter((q) => typeof q.jahr === 'number' && q.jahr >= cutoff);
if (recent.length < 2) {
  errors.push(
    `Nur ${recent.length} Quelle(n) aus den letzten 3 Jahren (Jahr >= ${cutoff}), erwartet mindestens 2.`,
  );
}

// Regel 3: mindestens 1 systematisches Review/Meta-Analyse, plus Primärstudien
const reviews = quellen.filter((q) => q.ist_uebersichtsarbeit === true);
if (reviews.length < 1) {
  errors.push('Keine Quelle mit ist_uebersichtsarbeit:true (systematisches Review/Meta-Analyse) gefunden.');
}
if (reviews.length === quellen.length) {
  warnings.push('Alle Quellen sind Übersichtsarbeiten — es fehlen Primärstudien.');
}

// Regel 4: nicht mehr als 2 Quellen desselben Journals
const byJournal = new Map();
for (const q of quellen) {
  if (!q.journal) continue;
  byJournal.set(q.journal, (byJournal.get(q.journal) ?? 0) + 1);
}
for (const [journal, count] of byJournal) {
  if (count > 2) errors.push(`${count} Quellen im selben Journal "${journal}" (maximal 2 erlaubt).`);
}

// Regel 5: nicht mehr als 2 Quellen derselben Forschungsgruppe
const byGroup = new Map();
for (const q of quellen) {
  if (!q.forschungsgruppe) continue;
  byGroup.set(q.forschungsgruppe, (byGroup.get(q.forschungsgruppe) ?? 0) + 1);
}
for (const [gruppe, count] of byGroup) {
  if (count > 2) errors.push(`${count} Quellen derselben Forschungsgruppe "${gruppe}" (maximal 2 erlaubt).`);
}

// Weich: Open-Access-Bevorzugung — nur Warnung, kein harter Fehler, aber Pflicht-Erinnerung
// an die Abstract-only-Regel (CLAUDE.md Abschnitt 2 / 01-recherche.md).
const closed = quellen.filter((q) => q.open_access === false);
if (closed.length > 0) {
  warnings.push(
    `${closed.length} Quelle(n) ohne Open-Access-Volltext: ${closed
      .map((q) => q.titel)
      .join('; ')} — im Artikel nicht über das per Abstract Zugängliche hinaus behaupten.`,
  );
}

// Weich: Preprints müssen als solche markiert sein (kein harter Fehler hier, das
// erzwingt der SourcesBox-Rendercheck weiter unten in der Pipeline/Draft-Review).
const preprints = quellen.filter((q) => q.preprint === true);
if (preprints.length > 0) {
  warnings.push(
    `${preprints.length} Preprint(s) in der Liste — im Artikel als "Preprint, nicht begutachtet" kennzeichnen: ${preprints
      .map((q) => q.titel)
      .join('; ')}`,
  );
}

console.log(`Geprüft: ${path} (${quellen.length} Quellen)`);

if (warnings.length > 0) {
  console.log('\nWarnungen:');
  warnings.forEach((w) => console.log(`  - ${w}`));
}

if (errors.length > 0) {
  console.log('\nFehler:');
  errors.forEach((e) => console.log(`  - ${e}`));
  console.log('\nErgebnis: Diversitätsregeln NICHT erfüllt — vor Übergabe an Schritt 2 (Draft) beheben.');
  process.exit(1);
}

console.log('\nErgebnis: Alle Diversitätsregeln erfüllt.');
