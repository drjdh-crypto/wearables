#!/usr/bin/env node
// Clusterbasierte Tragfähigkeitsprüfung — Korrektur/Ergänzung zu
// themeninventur-check.mjs (siehe docs/themeninventur.md, Abschnitt "Zwei Messungen").
//
// Die themenbasierte Messung (themeninventur-check.mjs) prüft pro Einzelthema, ob GENAU
// dieses eine Thema für sich genommen genug direkte Literaturtreffer hat. Das unterschätzt
// systematisch: ein Artikel zitiert nicht nur hochspezifische Literatur zu seinem exakten
// Titel, sondern schöpft aus dem Quellenpool des zugrunde liegenden Geräts/Mechanismus, den
// sich mehrere Artikel teilen (z. B. teilen sich alle Oura-Themen dieselbe Oura-Studienlage).
// Dieses Skript misst deshalb stattdessen auf Cluster-Ebene (Geräte + Mess-Mechanismen, siehe
// CLUSTERS unten — abgeleitet aus der Geräte-/Metriken-Achse in data/themeninventur.md,
// Abschnitt "Methodik"), ordnet jedem Thema seine tragenden Cluster zu und prüft, ob der
// GEMEINSAME Quellenpool dieser Cluster die Diversitätsregeln erfüllt.
//
// Aufruf:   node agents/pipeline/scripts/themeninventur-cluster-check.mjs
// Testlauf: LIMIT=10 node agents/pipeline/scripts/themeninventur-cluster-check.mjs

import { readFileSync, writeFileSync } from 'node:fs';

const SOURCE_MD = 'data/themeninventur.md';
const OUTPUT_JSON = 'data/themeninventur-cluster.json';
const CONTACT = 'pipeline@wearables-project.dev';
const CONCURRENCY = 2;
const OPENALEX_MIN_INTERVAL_MS = 300;
const CURRENT_YEAR = new Date().getFullYear();
const RECENT_CUTOFF = CURRENT_YEAR - 3;
const LIMIT = process.env.LIMIT ? parseInt(process.env.LIMIT, 10) : Infinity;

// ---------- 1. Cluster-Definition ----------
//
// Zwei Achsen, deckungsgleich mit der Geräte-/Metriken-Achse aus data/themeninventur.md
// ("Methodik: Wie diese Liste entstanden ist"): Mess-Mechanismus (was wird gemessen/wie) und
// Gerät/System (wer misst es). `query`: eine handformulierte, repräsentative englische Anfrage
// für OpenAlex/Europe PMC (bewusst nicht aus dem Titel übersetzt — diese Queries sind
// eigenständig formuliert, um den Cluster als Ganzes gut zu repräsentieren, nicht ein
// Einzelthema). `match`: Regex gegen den deutschen Original-Titel, um Themen diesem Cluster
// zuzuordnen.
const CLUSTERS = [
  // --- Mess-Mechanismen (layer: geraet-mechanismus) ---
  {
    id: 'ppg-sensorik',
    label: 'PPG-Sensorik',
    layer: 'geraet-mechanismus',
    query: 'photoplethysmography wearable heart rate accuracy validation',
    match: /\bppg\b|photoplethysmog|pulsmessung|pulssensor/i,
  },
  {
    id: 'aktigraphie',
    label: 'Aktigraphie/Bewegungssensorik',
    query: 'actigraphy accelerometer sleep wake accuracy validation',
    match: /aktigraph|bewegungssensor|beschleunigungssensor|bewegungsartefakt/i,
  },
  {
    id: 'hrv-messung',
    label: 'HRV-Messung',
    query: 'heart rate variability wearable measurement accuracy',
    match: /\bhrv\b|herzfrequenzvariabilit/i,
  },
  {
    id: 'schlafstadien-klassifikation',
    label: 'Schlafstadien-Klassifikation',
    query: 'sleep stage classification algorithm wearable accuracy',
    match: /schlafstadi|schlafphasen?\b|tiefschlaf|leichtschlaf|rem-schlaf|\brem\b|\bnrem\b|klassifikation|epoch-by-epoch|\bepoch\b/i,
  },
  {
    id: 'zirkadiane-rhythmik',
    label: 'Zirkadiane Rhythmik/Melatonin',
    query: 'circadian rhythm sleep melatonin regulation',
    // Jetlag/Schichtarbeit bewusst NICHT hier (verschoben in die eigenen
    // Phänomen-Cluster unten, um Doppelzuordnung zu vermeiden).
    match: /zirkadian|melatonin|chronotyp|schlafdruck|adenosin/i,
  },
  {
    id: 'schlaf-architektur-grundlagen',
    label: 'Schlafarchitektur/-zyklen (Grundlagen)',
    query: 'sleep architecture cycle duration efficiency healthy adults normative',
    match: /schlafzyklus|schlafzyklen|schlafarchitektur|schlafeffizienz|einschlaflatenz|einschlafzeit|sleep onset|schlafdauer|schlafbedarf|mikroarousal|wachliegen|schlafmangel/i,
  },
  {
    id: 'eeg-psg-referenz',
    label: 'EEG/Polysomnographie als Referenz',
    query: 'polysomnography EEG gold standard sleep validation',
    match: /\beeg\b|polysomnograph|\bpsg\b|goldstandard/i,
  },
  {
    id: 'hauttemperatur-sensorik',
    label: 'Hauttemperatur-/Kerntemperatur-Sensorik',
    query: 'skin temperature core body temperature wearable sleep measurement',
    match: /hauttemperatur|körpertemperatur|kerntemperatur/i,
  },
  {
    id: 'spo2-sensorik',
    label: 'SpO2-/Sauerstoffsättigungs-Sensorik',
    query: 'pulse oximetry oxygen saturation wearable accuracy',
    match: /sauerstoffsättig|spo2/i,
  },
  {
    id: 'atemfrequenz-sensorik',
    label: 'Atemfrequenz-Sensorik',
    query: 'respiratory rate wearable sleep measurement accuracy',
    match: /atemfrequenz|\batmung\b/i,
  },
  {
    id: 'schlafapnoe-erkennung',
    label: 'Schlafapnoe-Erkennung',
    query: 'sleep apnea detection wearable screening accuracy',
    match: /schlafapnoe/i,
  },
  {
    id: 'recovery-score-algorithmus',
    label: 'Recovery-Score/Trainingssteuerung',
    query: 'recovery score training load heart rate variability algorithm athletes',
    match: /recovery[- ]?score|recoveryscore|trainingssteuerung|übertraining|ruheherzfrequenz/i,
  },
  // --- Geräte/Systeme (Geräte-Achse aus data/themeninventur.md) ---
  {
    id: 'oura',
    label: 'Oura',
    query: 'Oura ring sleep tracking accuracy validation',
    match: /\boura\b/i,
  },
  {
    id: 'whoop',
    label: 'Whoop',
    query: 'Whoop wearable recovery strain accuracy validation',
    match: /\bwhoop\b/i,
  },
  {
    id: 'apple-watch',
    label: 'Apple Watch',
    query: 'Apple Watch sleep tracking accuracy validation',
    match: /apple watch/i,
  },
  {
    id: 'garmin',
    label: 'Garmin',
    query: 'Garmin wearable sleep accuracy validation',
    match: /\bgarmin\b/i,
  },
  {
    id: 'polar',
    label: 'Polar',
    query: 'Polar wearable heart rate sleep accuracy validation',
    match: /\bpolar\b/i,
  },
  {
    id: 'fitbit-pixel-watch',
    label: 'Fitbit/Pixel Watch',
    query: 'Fitbit wearable sleep tracking accuracy validation',
    match: /\bfitbit\b|pixel watch/i,
  },
  {
    id: 'samsung-galaxy-watch',
    label: 'Samsung Galaxy Watch',
    query: 'Samsung Galaxy Watch sleep tracking accuracy',
    match: /samsung|galaxy watch/i,
  },
  {
    id: 'withings',
    label: 'Withings',
    query: 'Withings sleep tracking device accuracy validation',
    match: /withings/i,
  },
  {
    id: 'matratzensensorik',
    label: 'Matratzensensorik (Eight Sleep, Emfit)',
    query: 'under-mattress sensor ballistocardiography sleep tracking accuracy',
    match: /eight sleep|\bemfit\b|matratzensensor|matratzenauflage/i,
  },
  {
    id: 'amazfit',
    label: 'Amazfit',
    query: 'Amazfit wearable sleep tracking accuracy',
    match: /amazfit/i,
  },
  {
    id: 'coros',
    label: 'Coros',
    query: 'Coros wearable sleep tracking accuracy',
    match: /\bcoros\b/i,
  },
  {
    id: 'ultrahuman',
    label: 'Ultrahuman',
    query: 'Ultrahuman ring wearable sleep tracking accuracy',
    match: /ultrahuman/i,
  },
  {
    id: 'circul-plus',
    label: 'Circul+',
    query: 'Circul ring pulse oximetry sleep tracking accuracy',
    match: /circul\+?/i,
  },
  {
    id: 'muse-s',
    label: 'Muse S',
    query: 'Muse S EEG headband sleep tracking accuracy',
    match: /muse s\b/i,
  },
  {
    id: 'biostrap',
    label: 'Biostrap',
    query: 'Biostrap wearable sleep tracking accuracy',
    match: /biostrap/i,
  },
  {
    id: 'ringconn',
    label: 'RingConn',
    query: 'RingConn smart ring sleep tracking accuracy',
    match: /ringconn/i,
  },
  {
    id: 'movano',
    label: 'Movano',
    query: 'Movano wearable ring sleep tracking accuracy',
    match: /movano/i,
  },
  {
    id: 'cpap-oekosysteme',
    label: 'CPAP-Ökosysteme',
    query: 'CPAP therapy adherence data sleep apnea',
    match: /\bcpap\b/i,
  },
].map((c) => ({ ...c, layer: 'geraet-mechanismus' }));

// Zweite Cluster-Ebene: Phänomene/Populationen statt Geräte/Sensoren. Deckt genau die Art
// Themen ab, die die Geräte-/Mechanismus-Cluster oben verpassen — "Praxis & Alltag" besteht
// überwiegend aus Fragen wie "Wie wirkt Koffein auf den Schlaf?", die sich nicht auf ein
// bestimmtes Gerät oder eine Sensor-Technologie beziehen, aber trotzdem einen geteilten
// Quellenpool haben (alle Koffein-Themen ziehen aus derselben Koffein-Schlaf-Literatur).
// Absichtlich schmal an der Nutzerliste orientiert (siehe Auftrag), nicht künstlich erweitert.
const PHENOMENON_CLUSTERS = [
  {
    id: 'schichtarbeit-schlaf',
    label: 'Schichtarbeit und Schlaf',
    query: 'shift work sleep circadian misalignment health',
    match: /schichtarbeit/i,
  },
  {
    id: 'social-jetlag',
    label: 'Wochenend-Jetlag/Social Jetlag',
    query: 'social jetlag jet lag circadian misalignment sleep',
    match: /jetlag|wochenend.{0,20}rhythmus/i,
  },
  {
    id: 'alkohol-schlaf',
    label: 'Alkohol und Schlaf',
    query: 'alcohol sleep quality architecture effects',
    match: /alkohol/i,
  },
  {
    id: 'koffein-schlaf',
    label: 'Koffein und Schlaf',
    query: 'caffeine sleep quality half-life effects',
    match: /koffein/i,
  },
  {
    id: 'alter-schlafarchitektur',
    label: 'Alter und Schlafarchitektur',
    query: 'aging sleep architecture older adults normative changes',
    match: /\balter\b|altern|älter|senior/i,
  },
  {
    id: 'eltern-kleinkinder',
    label: 'Schlaf bei Eltern kleiner Kinder',
    query: 'parents infant sleep deprivation postpartum newborn',
    match: /eltern|\bbaby\b|säugling|kleinkind|neugeboren/i,
  },
  {
    id: 'hoehentraining-schlaf',
    label: 'Höhentraining und Schlaf',
    query: 'altitude training sleep hypoxia athletes',
    match: /höhentraining|höhenlage|höhenmedizin/i,
  },
  {
    id: 'menstruationszyklus-schlaf',
    label: 'Menstruationszyklus und Schlaf',
    query: 'menstrual cycle sleep quality hormones',
    match: /menstruation/i,
  },
  {
    id: 'licht-chronobiologie',
    label: 'Licht/Chronobiologie',
    query: 'light exposure circadian sleep chronobiology',
    // "Verdunkelung" bewusst mit drin: gleiches Phänomen (Lichtexposition im Schlafzimmer),
    // nur die Verhinderung statt die Anwesenheit von Licht — ohne dieses Wort blieben mehrere
    // Schlafumgebung-Ring-Themen ("Verdunkelung und Melatoninausschüttung" usw.) unzugeordnet.
    match: /\blicht\b|blaulicht|lichtexposition|lichttherapie|verdunkelung/i,
  },
].map((c) => ({ ...c, layer: 'phaenomen-population' }));

// Dritte Cluster-Ebene: Raumklima-/Umgebungsfaktoren — ergänzt nach der ersten Ring-Messung
// (siehe docs/themeninventur.md), weil der Schlafumgebung-Ring mit den ersten beiden Ebenen
// (Geräte/Mechanismus, Phänomen/Population) unterversorgt blieb: 57 % seiner Themen
// (Raumtemperatur, Lärm, Luftqualität) hatten keinen Cluster, weil bis dahin nur Geräte
// (Matratzensensoren) und keine reinen Umgebungsfaktoren modelliert waren.
const RAUMKLIMA_CLUSTERS = [
  {
    id: 'raumtemperatur-schlaf',
    label: 'Schlaftemperatur/Raumklima',
    query: 'bedroom temperature sleep quality thermoregulation cooling',
    match: /raumtemperatur|schlafzimmertemperatur|temperaturregelung|aktive kühlung|kühlung im bett/i,
  },
  {
    id: 'laerm-akustik-schlaf',
    label: 'Lärm/Akustik im Schlaf',
    query: 'noise sleep disturbance white noise acoustic environment',
    match: /lärm|dezibel|weißes rauschen|weisses rauschen|geräusch|akustik|ohrstöpsel/i,
  },
  {
    id: 'luftqualitaet-co2-schlaf',
    label: 'Luftqualität/CO2 im Schlafzimmer',
    query: 'indoor air quality CO2 bedroom sleep ventilation',
    match: /luftqualität|\bco2\b|kohlendioxid|luftreiniger/i,
  },
  {
    id: 'luftfeuchtigkeit-schlaf',
    label: 'Luftfeuchtigkeit im Schlafzimmer',
    query: 'humidity bedroom sleep quality',
    match: /luftfeuchtigkeit|luftbefeuchter/i,
  },
].map((c) => ({ ...c, layer: 'umgebungsfaktoren' }));

// Fängt Themen auf, die keinem der obigen Cluster zugeordnet werden können (generische
// Wearable-/Tracker-Diskussion ohne Geräte-/Mechanismus-Bezug) — sonst würden sie ganz ohne
// Quellenpool dastehen, statt wenigstens den allgemeinen Consumer-Wearable-Pool zu erhalten.
const FALLBACK_CLUSTER = {
  id: 'consumer-wearables-allgemein',
  label: 'Consumer-Wearables allgemein',
  layer: 'geraet-mechanismus',
  query: 'consumer wearable sleep tracker accuracy validation',
  match: /wearable|tracker|schlaftrack|smartwatch|consumer/i,
};

// ---------- 2. Themen parsen + Cluster zuordnen ----------

function parseThemen() {
  const md = readFileSync(SOURCE_MD, 'utf8');
  const lines = md.split('\n');
  let currentCluster = null;
  let currentRing = 'kern';
  const themen = [];
  for (const line of lines) {
    const clusterMatch = line.match(/^## \S+\..*`category: ([a-z-]+)`(?:\s*`ring: ([a-z-]+)`)?/);
    if (clusterMatch) {
      currentCluster = clusterMatch[1];
      currentRing = clusterMatch[2] ?? 'kern';
      continue;
    }
    if (/^## \S+\./.test(line)) {
      currentCluster = null;
      continue;
    }
    const itemMatch = line.match(/^- \[ \] (.+)$/);
    if (itemMatch && currentCluster) {
      themen.push({ titel: itemMatch[1].trim(), cluster_original: currentCluster, ring: currentRing });
    }
  }
  return themen;
}

const ALLE_CLUSTER = [...CLUSTERS, ...PHENOMENON_CLUSTERS, ...RAUMKLIMA_CLUSTERS, FALLBACK_CLUSTER];

// Ordnet ein Thema seinen Clustern zu — optional beschränkt auf eine Layer-Teilmenge, damit
// sich der Beitrag der Phänomen-/Populations-Cluster gegenüber den Geräte-/Mechanismus-
// Clustern isoliert ausweisen lässt (siehe run(), Vergleich "nur Geräte/Mechanismus" vs. "voll").
function ordneCluster(titel, nurLayer) {
  const kandidaten = nurLayer ? ALLE_CLUSTER.filter((c) => c.layer === nurLayer) : ALLE_CLUSTER;
  const treffer = kandidaten.filter((c) => c.id !== FALLBACK_CLUSTER.id && c.match.test(titel)).map((c) => c.id);
  if (treffer.length === 0 && FALLBACK_CLUSTER.match.test(titel) && (!nurLayer || nurLayer === FALLBACK_CLUSTER.layer)) {
    treffer.push(FALLBACK_CLUSTER.id);
  }
  return treffer;
}

// ---------- 3. Externe APIs (siehe themeninventur-check.mjs für dieselbe Logik/Begründung) ----------

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url, attempt = 0) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'wearables-themeninventur-cluster/1.0 (mailto:' + CONTACT + ')' },
    });
    if (!res.ok) {
      const err = new Error(`HTTP ${res.status} für ${url}`);
      err.status = res.status;
      try {
        err.body = await res.text();
      } catch {
        /* Body nicht lesbar, ignorieren. */
      }
      throw err;
    }
    return await res.json();
  } catch (err) {
    const istBudget = err?.status === 429 && typeof err.body === 'string' && err.body.includes('Insufficient budget');
    if (attempt < 1 && !istBudget) {
      await sleep(500);
      return fetchJson(url, attempt + 1);
    }
    throw err;
  }
}

let openAlexBudgetErschoepft = false;
let openAlexLetzterAufruf = 0;

async function checkOpenAlex(query) {
  if (openAlexBudgetErschoepft) {
    const err = new Error('OpenAlex-Budget bereits erschöpft — übersprungen.');
    err.budgetSkipped = true;
    throw err;
  }
  const wartezeit = OPENALEX_MIN_INTERVAL_MS - (Date.now() - openAlexLetzterAufruf);
  if (wartezeit > 0) await sleep(wartezeit);
  openAlexLetzterAufruf = Date.now();

  const url = `https://api.openalex.org/works?search=${encodeURIComponent(query)}&per-page=25&mailto=${CONTACT}`;
  try {
    const data = await fetchJson(url);
    const results = data.results ?? [];
    return {
      hits: data.meta?.count ?? 0,
      reviews_in_sample: results.filter((w) => w.type === 'review').length,
      recent_in_sample: results.filter((w) => (w.publication_year ?? 0) >= RECENT_CUTOFF).length,
    };
  } catch (err) {
    if (err?.status === 429 && typeof err.body === 'string' && err.body.includes('Insufficient budget')) {
      openAlexBudgetErschoepft = true;
    }
    throw err;
  }
}

async function checkEuropePMC(query) {
  const url = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodeURIComponent(query)}&format=json&pageSize=25`;
  const data = await fetchJson(url);
  const results = data.resultList?.result ?? [];
  return {
    hits: data.hitCount ?? 0,
    reviews_in_sample: results.filter((r) => /review/i.test(r.pubType ?? '')).length,
    recent_in_sample: results.filter((r) => parseInt(r.pubYear, 10) >= RECENT_CUTOFF).length,
  };
}

// ---------- 4. Cluster prüfen (mit Checkpoint wie themeninventur-check.mjs) ----------

function ladeClusterCheckpoint() {
  try {
    const bisher = JSON.parse(readFileSync(OUTPUT_JSON, 'utf8'));
    const byId = new Map();
    for (const c of bisher.cluster ?? []) {
      if (c.openalex && !c.openalex.fehler) byId.set(c.id, c.openalex);
    }
    return byId;
  } catch {
    return new Map();
  }
}

async function checkCluster(cluster, cachedOpenAlex) {
  const fallback = { hits: 0, reviews_in_sample: 0, recent_in_sample: 0, fehler: true };
  const [openalex, europepmc] = await Promise.all([
    cachedOpenAlex ? Promise.resolve(cachedOpenAlex) : checkOpenAlex(cluster.query).catch(() => fallback),
    checkEuropePMC(cluster.query).catch(() => fallback),
  ]);
  const hits = (openalex.hits ?? 0) + (europepmc.hits ?? 0);
  const reviews = (openalex.reviews_in_sample ?? 0) + (europepmc.reviews_in_sample ?? 0);
  const recent = (openalex.recent_in_sample ?? 0) + (europepmc.recent_in_sample ?? 0);
  return {
    ...cluster,
    match: undefined, // Regex nicht serialisieren
    openalex,
    europepmc,
    hits,
    reviews,
    recent,
    hatAbfragefehler: Boolean(openalex.fehler || europepmc.fehler),
  };
}

// ---------- 5. Runner ----------

// Pool: Summe über die DISTINKTEN zugeordneten Cluster — siehe docs/themeninventur.md für die
// Einordnung dieses Werts als optimistische Obergrenze (mögliche Überlappung zwischen Clustern
// wird nicht herausgerechnet), im Gegensatz zur konservativen Untergrenze der themenbasierten
// Einzelmessung. null = nicht anwendbar (keine Cluster-Zuordnung in diesem Layer-Ausschnitt),
// nicht false — kein Cluster heißt "diese Messung deckt das Thema nicht ab", nicht "nicht
// tragfähig".
function bewerteClusterPool(clusterIds, clusterById) {
  const relevante = clusterIds.map((id) => clusterById.get(id)).filter(Boolean);
  const poolHits = relevante.reduce((s, c) => s + c.hits, 0);
  const poolReviews = relevante.reduce((s, c) => s + c.reviews, 0);
  const poolRecent = relevante.reduce((s, c) => s + c.recent, 0);
  const tragfaehig = clusterIds.length === 0 ? null : poolHits >= 6 && poolReviews >= 1 && poolRecent >= 2;
  return { poolHits, poolReviews, poolRecent, tragfaehig };
}

async function run() {
  const alleCluster = ALLE_CLUSTER;
  const cache = ladeClusterCheckpoint();
  console.log(`${alleCluster.length} Cluster definiert (${cache.size} mit Checkpoint-OpenAlex-Daten). Prüfe Cluster-Quellenlage...`);

  const clusterErgebnisse = new Array(alleCluster.length);
  let index = 0;
  async function clusterWorker() {
    while (index < alleCluster.length) {
      const i = index++;
      const c = alleCluster[i];
      try {
        clusterErgebnisse[i] = await checkCluster(c, cache.get(c.id));
      } catch (err) {
        clusterErgebnisse[i] = { ...c, match: undefined, fehler: String(err), hits: 0, reviews: 0, recent: 0, hatAbfragefehler: true };
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, () => clusterWorker()));
  console.log(`Cluster geprüft (${clusterErgebnisse.filter((c) => !c.hatAbfragefehler).length}/${alleCluster.length} ohne Abfragefehler).`);

  const clusterById = new Map(clusterErgebnisse.map((c) => [c.id, c]));

  const alleThemen = parseThemen().slice(0, LIMIT);
  const themenErgebnisse = alleThemen.map((thema) => {
    // Voll (alle Layer) — die eigentliche, maßgebliche clusterbasierte Bewertung.
    const clusterIds = ordneCluster(thema.titel);
    const voll = bewerteClusterPool(clusterIds, clusterById);

    // Nur Geräte-/Mechanismus-Layer — isoliert den Beitrag der neuen Phänomen-/Populations-
    // Cluster (Layer-Vergleich, siehe docs/themeninventur.md, Abschnitt "Phänomen-Cluster").
    const clusterIdsGeraet = ordneCluster(thema.titel, 'geraet-mechanismus');
    const geraetOnly = bewerteClusterPool(clusterIdsGeraet, clusterById);

    return {
      ...thema,
      cluster: clusterIds,
      poolHits: voll.poolHits,
      poolReviews: voll.poolReviews,
      poolRecent: voll.poolRecent,
      tragfaehigCluster: voll.tragfaehig,
      clusterGeraetMechanismus: clusterIdsGeraet,
      tragfaehigClusterGeraetMechanismus: geraetOnly.tragfaehig,
      begruendung: clusterIds.length === 0
        ? 'Keinem Cluster zuordenbar (weder Geräte-/Mechanismus- noch Phänomen-/Populations-Keyword im Titel gefunden) — clusterbasierte Messung nicht anwendbar, themenbasierte Messung bleibt maßgeblich.'
        : `Cluster [${clusterIds.join(', ')}]: ${voll.poolHits} Treffer, ${voll.poolReviews} Review(s), ${voll.poolRecent} aktuelle im gepoolten Cluster-Sample → ${voll.tragfaehig ? 'erfüllt' : 'erfüllt nicht'} die Mindestschwelle (6/1/2).`,
    };
  });

  const output = {
    geprueft_am: new Date().toISOString(),
    cluster: clusterErgebnisse,
    themen: themenErgebnisse,
  };
  writeFileSync(OUTPUT_JSON, JSON.stringify(output, null, 2) + '\n');

  const tragfaehigCount = themenErgebnisse.filter((t) => t.tragfaehigCluster === true).length;
  const ohneCluster = themenErgebnisse.filter((t) => t.cluster.length === 0).length;
  const anwendbar = themenErgebnisse.length - ohneCluster;
  console.log(`\nFertig: ${tragfaehigCount}/${anwendbar} clusterbasiert-anwendbare Kern-Themen tragfähig (von ${themenErgebnisse.length} insgesamt). Ergebnis: ${OUTPUT_JSON}`);
  console.log(`${ohneCluster} Thema(en) ohne jede Cluster-Zuordnung (clusterbasierte Messung dort nicht anwendbar).`);

  const praxisAlltag = themenErgebnisse.filter((t) => t.cluster_original === 'praxis-alltag');
  const praxisNurGeraet = praxisAlltag.filter((t) => t.tragfaehigClusterGeraetMechanismus === true).length;
  const praxisVoll = praxisAlltag.filter((t) => t.tragfaehigCluster === true).length;
  console.log(
    `Praxis & Alltag (${praxisAlltag.length} Themen): nur Geräte-/Mechanismus-Cluster ${praxisNurGeraet} tragfähig → mit Phänomen-/Populations-Clustern ${praxisVoll} tragfähig (Differenz: +${praxisVoll - praxisNurGeraet}).`,
  );

  if (openAlexBudgetErschoepft) {
    console.log('OpenAlex-Budget während dieses Laufs erschöpft — Cluster-Zahlen basieren teilweise nur auf Europe PMC. Skript erneut ausführen, sobald das Budget zurückgesetzt ist (Checkpoint setzt bei den fehlenden Clustern fort).');
  }
}

run();
