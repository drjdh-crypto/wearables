#!/usr/bin/env node
// Quellen-Relevanzindex: berechnet einen 0–100-Score pro Quelle in einer
// data/quellen/<slug>.json-Datei und schreibt ihn zusammen mit Teilwerten und
// einer Begründung in dieselbe Datei zurück. Vollständige Gewichtung, ihre
// Herleitung und ihre Grenzen: docs/quellenbewertung.md (von dort auch von
// der Methodik-Seite verlinkt).
//
// Aufruf:
//   node agents/pipeline/scripts/score-quellen.mjs data/quellen/<slug>.json
//   node agents/pipeline/scripts/score-quellen.mjs            (alle Dateien unter data/quellen/*.json)

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const CONTACT = 'pipeline@wearables-project.dev';
const CURRENT_YEAR = new Date().getFullYear();
const QUELLEN_DIR = 'data/quellen';

// ---------- Gewichtung (max. 100 Punkte, siehe docs/quellenbewertung.md) ----------
// Reihenfolge = Priorität aus dem Auftrag: Studientyp > Zitationsrate > Stichprobengröße
// ≈ Aktualität > Journal-Qualität (niedrigstes Gewicht, kein Clarivate Impact Factor).
const MAX_PUNKTE = { studientyp: 35, zitationsrate: 25, n: 15, aktualitaet: 15, journal: 10 };
const PREPRINT_MALUS = 10;

// Punkte je Studiendesign, nach Evidenzpyramide (Meta-Analyse/systematisches Review > RCT >
// Kohorte/Querschnitt > Fallserie/Einzelfall). Eine narrative (nicht-systematische)
// Übersichtsarbeit fasst zwar viel zusammen, hat aber kein reproduzierbares Suchprotokoll und
// steht deshalb methodisch UNTER Primärstudien, nicht darüber — anders als in der Alltagssprache
// ("Review" klingt nach "mehr Überblick = mehr wert"), aber konsistent mit gängigen
// Evidenzhierarchien (z. B. Oxford CEBM). Details/Diskussion: docs/quellenbewertung.md.
const STUDIENDESIGN_PUNKTE = {
  'meta-analyse': 35,
  'systematisches-review': 35,
  rct: 27,
  kohorte: 18,
  querschnitt: 16,
  review: 12,
  fallserie: 6,
  sonstige: 8,
};

// Fällt eine Quelle nicht unter eines der obigen Designs (z. B. weil `studiendesign` in der
// Recherche-Ausgabe noch fehlt, ältere Dateien vor Einführung dieses Felds), wird ein
// konservativer Standardwert geschätzt — klar als Schätzung markiert, nicht stillschweigend.
// Ab jetzt sollte Schritt 1 (Recherche) `studiendesign` direkt mitliefern (siehe
// agents/pipeline/01-recherche.md).
function inferStudiendesign(q) {
  if (q.studiendesign) return { wert: q.studiendesign, geschaetzt: false };
  if (q.ist_uebersichtsarbeit === true) return { wert: 'meta-analyse', geschaetzt: true };
  if (q.studientyp === 'institutional' || q.studientyp === 'manufacturer') {
    return { wert: 'sonstige', geschaetzt: true };
  }
  if (q.n == null) return { wert: 'review', geschaetzt: true };
  return { wert: 'kohorte', geschaetzt: true };
}

function punkteStudientyp(q) {
  const { wert, geschaetzt } = inferStudiendesign(q);
  const punkte = STUDIENDESIGN_PUNKTE[wert] ?? STUDIENDESIGN_PUNKTE.sonstige;
  const hinweis = geschaetzt
    ? ` (Studiendesign "${wert}" automatisch geschätzt, nicht von Schritt 1 mitgeliefert — bei Bedarf manuell in der Quellen-JSON korrigieren)`
    : '';
  return { punkte, begruendung: `Studiendesign: ${wert} → ${punkte}/${MAX_PUNKTE.studientyp}.${hinweis}` };
}

function punkteZitationsrate(q) {
  if (q.zitationen == null) {
    return { punkte: 0, begruendung: `Keine Zitationsdaten verfügbar (0/${MAX_PUNKTE.zitationsrate}) — üblich bei nicht in OpenAlex indizierten Referenzwerken, kein Qualitätsmangel per se.` };
  }
  const alterJahre = Math.max(1, CURRENT_YEAR - q.jahr);
  const rate = q.zitationen / alterJahre;
  let punkte;
  if (rate >= 100) punkte = 25;
  else if (rate >= 50) punkte = 20;
  else if (rate >= 20) punkte = 15;
  else if (rate >= 5) punkte = 10;
  else if (rate >= 1) punkte = 5;
  else punkte = 2;
  return {
    punkte,
    begruendung: `${q.zitationen} Zitationen ÷ ${alterJahre} Jahre = ${rate.toFixed(1)}/Jahr → ${punkte}/${MAX_PUNKTE.zitationsrate}.`,
  };
}

function punkteN(q) {
  if (q.n == null) {
    return { punkte: 0, begruendung: `Keine eigene Stichprobe (0/${MAX_PUNKTE.n}) — erwartet bei Übersichtsarbeiten/Methodenpapieren ohne eigene Kohorte.` };
  }
  let punkte;
  if (q.n >= 1000) punkte = 15;
  else if (q.n >= 300) punkte = 12;
  else if (q.n >= 100) punkte = 9;
  else if (q.n >= 30) punkte = 6;
  else punkte = 3;
  return { punkte, begruendung: `n = ${q.n} → ${punkte}/${MAX_PUNKTE.n}.` };
}

function punkteAktualitaet(q) {
  const alter = CURRENT_YEAR - q.jahr;
  let punkte;
  if (alter <= 2) punkte = 15;
  else if (alter <= 5) punkte = 12;
  else if (alter <= 10) punkte = 8;
  else if (alter <= 15) punkte = 4;
  else punkte = 1;
  return { punkte, begruendung: `Publikationsjahr ${q.jahr} (${alter} Jahre alt) → ${punkte}/${MAX_PUNKTE.aktualitaet}.` };
}

// ---------- Externe APIs ----------

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url, attempt = 0) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'wearables-quellenbewertung/1.0 (mailto:' + CONTACT + ')' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} für ${url}`);
    return await res.json();
  } catch (err) {
    if (attempt < 1) {
      await sleep(500);
      return fetchJson(url, attempt + 1);
    }
    throw err;
  }
}

// Journal-/Venue-Qualität über OpenAlex-Journalmetriken (`summary_stats.2yr_mean_citedness`,
// eine offene, nicht-proprietäre Kennzahl vergleichbar mit einem 2-Jahres-Impact-Faktor).
// Explizit KEIN Clarivate Journal Impact Factor (proprietär, nicht frei zugänglich). Ein frei
// zugängliches, live abfragbares Scimago-SJR-API existiert nach Prüfung nicht — Scimago
// veröffentlicht nur jährliche CSV-Downloads, keine Live-API ohne Konto. Diese Kennzahl bleibt
// deshalb vorerst auf OpenAlex beschränkt (siehe docs/quellenbewertung.md, Abschnitt "Grenzen").
async function punkteJournal(q) {
  if (!q.journal) {
    return { punkte: 0, begruendung: `Kein Journal (Referenzwerk) — 0/${MAX_PUNKTE.journal}.` };
  }
  try {
    const url = `https://api.openalex.org/sources?search=${encodeURIComponent(q.journal)}&per-page=1&mailto=${CONTACT}`;
    const data = await fetchJson(url);
    const top = data.results?.[0];
    const metrik = top?.summary_stats?.['2yr_mean_citedness'];
    if (metrik == null) {
      return { punkte: 0, begruendung: `OpenAlex-Journalmetrik für "${q.journal}" nicht gefunden — 0/${MAX_PUNKTE.journal}.` };
    }
    let punkte;
    if (metrik >= 6) punkte = 10;
    else if (metrik >= 3) punkte = 7;
    else if (metrik >= 1.5) punkte = 5;
    else if (metrik >= 0.5) punkte = 3;
    else punkte = 1;
    return {
      punkte,
      begruendung: `OpenAlex 2-Jahres-Zitationsmittel für "${q.journal}": ${metrik.toFixed(2)} → ${punkte}/${MAX_PUNKTE.journal}.`,
    };
  } catch (err) {
    return {
      punkte: 0,
      begruendung: `OpenAlex-Journalmetrik nicht verfügbar (${err.message}) — 0/${MAX_PUNKTE.journal} vergeben, kein echtes "niedrige Qualität". Nachlauf empfohlen, sobald OpenAlex wieder erreichbar ist.`,
      fehler: true,
    };
  }
}

// Retraction-Check über Crossref (bindet seit 2023 Retraction-Watch-Daten ein): ein Werk gilt
// als zurückgezogen, wenn Crossref einen `update-to`-Eintrag vom Typ "retraction" führt.
// HARTER Ausschluss (Score wird auf 0 gezwungen), nicht nur eine Abwertung — siehe Auftrag.
async function pruefeRetraction(q) {
  if (!q.doi) return { zurueckgezogen: false, geprueft: false };
  try {
    const url = `https://api.crossref.org/works/${encodeURIComponent(q.doi)}?mailto=${CONTACT}`;
    const data = await fetchJson(url);
    const updateTo = data.message?.['update-to'] ?? [];
    const zurueckgezogen = updateTo.some((u) => u.type === 'retraction');
    return { zurueckgezogen, geprueft: true };
  } catch {
    return { zurueckgezogen: false, geprueft: false, fehler: true };
  }
}

// ---------- Score je Quelle ----------

async function scoreQuelle(q) {
  const st = punkteStudientyp(q);
  const zr = punkteZitationsrate(q);
  const n = punkteN(q);
  const ak = punkteAktualitaet(q);
  const jo = await punkteJournal(q);
  const retraction = await pruefeRetraction(q);

  const rohsumme = st.punkte + zr.punkte + n.punkte + ak.punkte + jo.punkte;
  const preprintMalus = q.preprint ? PREPRINT_MALUS : 0;
  const vorRetraction = Math.max(0, rohsumme - preprintMalus);
  const score = retraction.zurueckgezogen ? 0 : vorRetraction;

  const teilwerte = {
    studientyp: st.punkte,
    zitationsrate: zr.punkte,
    n: n.punkte,
    aktualitaet: ak.punkte,
    journal: jo.punkte,
    preprint_malus: -preprintMalus,
  };

  const begruendungTeile = [st.begruendung, zr.begruendung, n.begruendung, ak.begruendung, jo.begruendung];
  if (preprintMalus > 0) begruendungTeile.push(`Preprint, nicht begutachtet → -${preprintMalus} Punkte.`);
  if (retraction.zurueckgezogen) {
    begruendungTeile.unshift(
      'ZURÜCKGEZOGEN (Crossref update-to: retraction) — Score auf 0 gesetzt, harter Ausschluss. Nicht in Artikeln verwenden, aus data/quellen/ entfernen.',
    );
  } else if (retraction.fehler) {
    begruendungTeile.push('Retraction-Check bei Crossref fehlgeschlagen (Netzwerkfehler) — vor Veröffentlichung erneut prüfen.');
  }

  return {
    ...q,
    score,
    teilwerte,
    zurueckgezogen: retraction.zurueckgezogen,
    begruendung: begruendungTeile.join(' '),
  };
}

// ---------- Runner ----------

async function scoreFile(path) {
  const quellen = JSON.parse(readFileSync(path, 'utf8'));
  const bewertet = [];
  for (const q of quellen) {
    bewertet.push(await scoreQuelle(q));
  }
  writeFileSync(path, JSON.stringify(bewertet, null, 2) + '\n');
  const zurueckgezogen = bewertet.filter((q) => q.zurueckgezogen);
  console.log(`${path}: ${bewertet.length} Quellen bewertet (Scores: ${bewertet.map((q) => q.score).join(', ')}).`);
  if (zurueckgezogen.length > 0) {
    console.log(`  ACHTUNG: ${zurueckgezogen.length} zurückgezogene Quelle(n) gefunden — vor Freigabe entfernen: ${zurueckgezogen.map((q) => q.titel).join('; ')}`);
  }
}

async function run() {
  const arg = process.argv[2];
  const files = arg ? [arg] : readdirSync(QUELLEN_DIR).filter((f) => f.endsWith('.json')).map((f) => join(QUELLEN_DIR, f));
  for (const file of files) {
    await scoreFile(file);
  }
}

run();
