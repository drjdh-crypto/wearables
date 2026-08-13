#!/usr/bin/env node
// Themeninventur-Tragfähigkeitsprüfung — siehe docs/themeninventur.md.
//
// Liest die 305 Kern-Themen aus /data/themeninventur.md, ordnet jedes einer
// der vier Content-Kategorien zu (grundlagen | genauigkeits-check |
// kaufberatung | produktzyklus), prüft je Thema automatisiert:
//   - Quellenlage: Trefferzahl bei OpenAlex und Europe PMC (kostenlose,
//     offizielle APIs, keine Keys nötig), davon Reviews/Meta-Analysen und
//     aktuelle Arbeiten (letzte 3 Jahre) — approximiert aus einer Stichprobe
//     von je 25 Treffern pro Quelle, nicht aus dem vollständigen Trefferset
//     (siehe "Grenzen" in docs/themeninventur.md).
//   - Nachfragehinweis: DuckDuckGo-Autocomplete als kostenloser Proxy für
//     "Leute fragen auch"-artige Signale — kein Ersatz für ein dediziertes
//     Keyword-Tool, aber ohne Kosten/Key nutzbar.
// und bestimmt "tragfähig" nach denselben Mindestschwellen wie die
// Diversitätsregeln der Redaktions-Pipeline (agents/pipeline/01-recherche.md):
// mindestens 6 Quellen insgesamt, mindestens 1 Review/Meta-Analyse,
// mindestens 2 aktuelle Arbeiten.
//
// Aufruf:   node agents/pipeline/scripts/themeninventur-check.mjs
// Testlauf: LIMIT=10 node agents/pipeline/scripts/themeninventur-check.mjs

import { readFileSync, writeFileSync } from 'node:fs';

const SOURCE_MD = 'data/themeninventur.md';
const OUTPUT_JSON = 'data/themeninventur.json';
const CONTACT = 'pipeline@wearables-project.dev'; // OpenAlex "polite pool"
// Konservativ statt maximal: OpenAlex begrenzt inzwischen über ein Tagesbudget statt (nur)
// über Request-Rate (siehe docs/themeninventur.md, "OpenAlex-Ausfall"). Niedrige Concurrency +
// eine explizite Mindestpause zwischen OpenAlex-Anfragen sollen das knappe Budget nicht durch
// unnötige Bursts verschwenden.
const CONCURRENCY = 2;
const OPENALEX_MIN_INTERVAL_MS = 300;
const CURRENT_YEAR = new Date().getFullYear();
const RECENT_CUTOFF = CURRENT_YEAR - 3;
const LIMIT = process.env.LIMIT ? parseInt(process.env.LIMIT, 10) : Infinity;

// ---------- 1. Kern-Themenliste parsen ----------

// Ordnet den sechs bestehenden Site-Kategorien (src/content.config.ts) eine
// Startzuordnung in die vier neuen Inventur-Kategorien zu. `praxis-alltag`
// und `hrv-recovery` haben kein sauberes 1:1-Gegenstück im neuen Schema
// (Troubleshooting/Psychologie/Datenschutz/Apps bzw. reine HRV-Grundlagen
// sind keine Kaufberatung/Genauigkeits-Check/Produktzyklus-Inhalte) — sie
// fallen auf "grundlagen" als Auffangkategorie, werden aber unten per
// Keyword-Heuristik korrigiert, wenn der konkrete Titel klarer passt.
const CLUSTER_TO_CATEGORY = {
  schlafphysiologie: 'grundlagen',
  'tracking-genauigkeit': 'genauigkeits-check',
  'hrv-recovery': 'grundlagen',
  'geraete-vergleich': 'kaufberatung',
  'praxis-alltag': 'grundlagen',
  'methodik-limitationen': 'genauigkeits-check',
};

// Neue Ring-Abschnitte (siehe data/themeninventur.md, Abschnitte H/I) taggen `category:` direkt
// mit einem der vier finalen Werte, statt über die alten sechs Kern-Cluster umzuweisen — daher
// hier direkt durchreichen, wenn der Tag bereits ein finaler Kategoriewert ist.
const FINALE_KATEGORIEN = new Set(['grundlagen', 'genauigkeits-check', 'kaufberatung', 'produktzyklus']);
function kategorieFuer(tag) {
  return FINALE_KATEGORIEN.has(tag) ? tag : CLUSTER_TO_CATEGORY[tag];
}

function classify(titel, clusterDefault) {
  const t = titel.toLowerCase();
  const isProduktzyklus =
    /\bgen\s?\d\b.*\bvs\b|\bvs\.?\s*gen\s?\d/.test(t) ||
    /\b\d\.\d\b[^.]*\bvs\.?\b[^.]*\b\d\.\d\b/.test(t) || // "4.0 vs. 5.0"
    /upgrade|refurbished|gebrauchtmarkt|firmware|software-update|übernahme/.test(t);
  const isKaufberatung =
    /^bester\b|^beste\b|kaufberatung|günstig|unter \d+\s*euro|einstieg/.test(t);
  const isGenauigkeit =
    /genauigkeit|validierung|sensitivität|bias|mythos|\bgrenzen\b|limitation|fehlerquelle|f1-wert|kappa|epoch|studienlage|replizier/.test(
      t,
    );

  if (isProduktzyklus) return 'produktzyklus';
  if (isKaufberatung) return 'kaufberatung';
  if (isGenauigkeit) return 'genauigkeits-check';
  return clusterDefault;
}

function parseThemen() {
  const md = readFileSync(SOURCE_MD, 'utf8');
  const lines = md.split('\n');
  let currentCluster = null;
  let currentRing = 'kern';
  const themen = [];
  for (const line of lines) {
    // `ring:`-Tag optional — fehlt er, ist der Abschnitt Teil des Kerns (Abschnitte A-F).
    const clusterMatch = line.match(/^## \S+\..*`category: ([a-z-]+)`(?:\s*`ring: ([a-z-]+)`)?/);
    if (clusterMatch) {
      currentCluster = clusterMatch[1];
      currentRing = clusterMatch[2] ?? 'kern';
      continue;
    }
    if (/^## \S+\./.test(line)) {
      // Header ohne category-Backtick (z.B. "## G. Glossar…") — kein Themen-Abschnitt.
      currentCluster = null;
      continue;
    }
    const itemMatch = line.match(/^- \[ \] (.+)$/);
    if (itemMatch && currentCluster && kategorieFuer(currentCluster)) {
      const titel = itemMatch[1].trim();
      themen.push({
        titel,
        cluster_original: currentCluster,
        kategorie: classify(titel, kategorieFuer(currentCluster)),
        ring: currentRing,
      });
    }
  }
  return themen;
}

// ---------- 2. Such-Query aus dem Arbeitstitel bauen ----------
//
// OpenAlex/Europe PMC indizieren fast ausschließlich englischsprachige
// Literatur — eine deutsche Suchanfrage liefert selbst für gut erforschte
// Themen (Melatonin, zirkadianer Rhythmus) praktisch immer 0 Treffer, nicht
// weil keine Literatur existiert, sondern weil falsch gesucht wird. Deshalb:
// Wörterbuch-basierte Übersetzung der wiederkehrenden Fach-/Domänenbegriffe
// (nicht der ganzen Titel — Eigennamen wie Oura/Garmin/Whoop bleiben
// unverändert). Deckt die häufigsten Begriffe aus den 305 Kern-Themen ab,
// ist aber kein vollständiger Übersetzer — Titel mit unübersetzten,
// seltenen deutschen Wörtern liefern weiterhin schwächere Treffer. Diese
// Grenze steht auch in docs/themeninventur.md.
const TRANSLATE = {
  schlaf: 'sleep', schlafes: 'sleep', schlaftracking: 'sleep tracking',
  schlaftracker: 'sleep tracker', schlaftrackern: 'sleep trackers',
  schlafdaten: 'sleep data', schlafphase: 'sleep stage', schlafphasen: 'sleep stages',
  schlafstadien: 'sleep stages', schlafstadium: 'sleep stage',
  schlafzyklus: 'sleep cycle', schlafzyklen: 'sleep cycles',
  schlafarchitektur: 'sleep architecture', schlafeffizienz: 'sleep efficiency',
  schlafqualität: 'sleep quality', schlafdauer: 'sleep duration',
  schlafbedarf: 'sleep need', schlafmangel: 'sleep deprivation',
  schlafapnoe: 'sleep apnea', schlafstörung: 'sleep disorder',
  schlafstörungen: 'sleep disorders', schlaflabor: 'sleep lab',
  schlafmedizin: 'sleep medicine', schlafscore: 'sleep score',
  schlafscores: 'sleep scores', schlaftagebuch: 'sleep diary',
  tiefschlaf: 'deep sleep', leichtschlaf: 'light sleep',
  rem: 'REM sleep', 'rem-schlaf': 'REM sleep',
  wach: 'wakefulness', wachliegen: 'wake after sleep onset',
  einschlafzeit: 'sleep onset latency', einschlaflatenz: 'sleep onset latency',
  zirkadian: 'circadian', zirkadiane: 'circadian', zirkadianer: 'circadian',
  rhythmus: 'rhythm', rhythmik: 'rhythm', chronotyp: 'chronotype',
  melatonin: 'melatonin', adenosin: 'adenosine', schlafdruck: 'sleep pressure',
  kerntemperatur: 'core body temperature', hauttemperatur: 'skin temperature',
  körpertemperatur: 'body temperature',
  jetlag: 'jet lag', schichtarbeit: 'shift work',
  koffein: 'caffeine', alkohol: 'alcohol', licht: 'light', blaulicht: 'blue light',
  gedächtnis: 'memory', gedächtniskonsolidierung: 'memory consolidation',
  träumen: 'dreaming', traum: 'dream',
  wechseljahre: 'menopause', menstruationszyklus: 'menstrual cycle',
  schwangerschaft: 'pregnancy', schwangere: 'pregnant', kinder: 'children',
  senioren: 'older adults', 'senior:innen': 'older adults',
  athletinnen: 'athletes', 'athlet:innen': 'athletes', ausdauersportlerinnen: 'endurance athletes',
  insomnie: 'insomnia', 'restless-legs-syndrom': 'restless legs syndrome',
  genauigkeit: 'accuracy', validierung: 'validation', validierungsstudie: 'validation study',
  validierungsstudien: 'validation studies', sensitivität: 'sensitivity', spezifität: 'specificity',
  fehlerquelle: 'source of error', kalibrierung: 'calibration', algorithmus: 'algorithm',
  studie: 'study', studien: 'studies', studienlage: 'evidence', 'meta-analyse': 'meta-analysis',
  'meta-analysen': 'meta-analyses', stichprobe: 'sample size', goldstandard: 'gold standard',
  bewegungssensorik: 'accelerometry', bewegungsartefakte: 'motion artifacts',
  pulsmessung: 'heart rate measurement', herzfrequenz: 'heart rate',
  herzfrequenzvariabilität: 'heart rate variability', hrv: 'heart rate variability',
  sauerstoffsättigung: 'oxygen saturation', atemfrequenz: 'respiratory rate',
  polysomnographie: 'polysomnography', psg: 'polysomnography', aktigraphie: 'actigraphy',
  eeg: 'EEG', bias: 'bias', mythos: 'myth', grenzen: 'limitations', limitation: 'limitations',
  limitationen: 'limitations', replizierbarkeit: 'reproducibility',
  recovery: 'recovery', erholung: 'recovery', recoveryscore: 'recovery score',
  recoverytracking: 'recovery tracking', trainingssteuerung: 'training load management',
  übertraining: 'overtraining', übertrainingssyndrom: 'overtraining syndrome',
  ruheherzfrequenz: 'resting heart rate', 'autonomes nervensystem': 'autonomic nervous system',
  wearable: 'wearable', wearables: 'wearables', tracker: 'tracker', tracking: 'tracking',
  consumer: 'consumer', smartwatch: 'smartwatch', matratze: 'mattress',
  gesundheitsdaten: 'health data', datenschutz: 'privacy', diagnose: 'diagnosis',
  orthosomnie: 'orthosomnia', übergewicht: 'obesity', blutzucker: 'blood glucose',
  depression: 'depression', angststörungen: 'anxiety disorders', adhs: 'ADHD',
  passiert: 'happens', körper: 'body', während: 'during', statt: 'instead of',
  messen: 'measure', misst: 'measures', grenze: 'boundary', anteil: 'proportion',
  anteile: 'proportions', dauer: 'duration', funktion: 'function', ursache: 'cause',
  ursachen: 'causes', wirkung: 'effect', unterschied: 'difference', unterschiede: 'differences',
  überschätzen: 'overestimate', unterschätzen: 'underestimate', überwachung: 'monitoring',
  training: 'training', belastung: 'load', erkennen: 'detect', erkennung: 'detection',
  klassifikation: 'classification', vorhersage: 'prediction',
  zyklus: 'cycle', zyklen: 'cycles', nacht: 'night', nächte: 'nights', nachts: 'at night',
  daten: 'data', phase: 'phase', phasen: 'phases', geräte: 'devices', gerät: 'device',
  ausschüttung: 'secretion', messbarkeit: 'measurability',
  mikroarousal: 'microarousal', mikroarousals: 'microarousals',
  störung: 'disorder', störungen: 'disorders',
  zusammenhang: 'association', zusammenhänge: 'associations',
  missverständnis: 'misconception', missverständnisse: 'misconceptions',
  kurzschläfer: 'short sleeper', langschläfer: 'long sleeper',
  schlafschuld: 'sleep debt', nachholen: 'catch up on', nachholbar: 'recoverable',
  optimal: 'optimal', optimale: 'optimal', optimalen: 'optimal', optimaler: 'optimal',
  forschung: 'research', aufwachen: 'waking up', aufwacht: 'wakes up',
  körperkerntemperatur: 'core body temperature',
};

// Nach Länge absteigend sortierte Liste der Wörterbuch-Keys, für die
// Präfix-Erkennung bei unhyphenierten deutschen Komposita (z.B.
// "Tiefschlafphase" = "tiefschlaf" + "phase", ohne Bindestrich).
const TRANSLATE_KEYS_BY_LENGTH = Object.keys(TRANSLATE).sort((a, b) => b.length - a.length);

// Rein dekorative Füllwörter, die für die Literatursuche keinen Mehrwert
// haben (Marketing-/Erklär-Ton), werden komplett fallengelassen statt
// übersetzt.
const DROP_WORDS = new Set([
  'verstehen', 'einfach', 'erklärt', 'fließend', 'überblick', 'wirklich',
  'tatsächlich', 'sinnvoll', 'praxis', 'alltag', 'richtig', 'laut', 'davon',
]);

const STOPWORDS = new Set([
  'bester', 'beste', 'kaufberatung', 'warum', 'wie', 'was', 'ist', 'sind',
  'für', 'im', 'in', 'der', 'die', 'das', 'und', 'oder', 'noch', 'nicht',
  'wirklich', 'eigentlich', 'kann', 'können', 'sich', 'eine', 'einen', 'einem',
  'am', 'an', 'auf', 'aus', 'bei', 'den', 'dem', 'des', 'dass', 'ein', 'es',
  'ihre', 'ihrer', 'man', 'mit', 'nach', 'ob', 'ohne', 'sein', 'sie', 'so',
  'über', 'um', 'unter', 'von', 'vor', 'wenn', 'werden', 'wird', 'zu', 'zum',
  'zur', 'zwischen', 'als', 'oft', 'manche', 'welche', 'welcher', 'unsere',
  'wir', 'vs',
]);

// Übersetzt ein Token — versucht zuerst den ganzen (ggf. bindestrich-
// verbundenen) Ausdruck als Wörterbucheintrag, erst danach die Hälften
// einzeln, damit z. B. "REM-Schlaf" als "REM sleep" matcht statt in
// "REM sleep" + "sleep" (Dopplung) zu zerfallen.
function translateBare(bare) {
  if (TRANSLATE[bare]) return TRANSLATE[bare];
  // Unhyphenierte deutsche Komposita (z.B. "tiefschlafphase"): längsten
  // bekannten Wörterbuch-Präfix suchen und den Rest anhängen, sofern er
  // selbst kein reines Flexionssuffix ist (Länge > 1). Nur für wirklich
  // zusammengeschriebene Wörter — bei "schlaf-score" würde "schlaf" sonst
  // als Präfix matchen und den Bindestrich unübersetzt in den Rest
  // ("-score") übernehmen; solche Fälle übernimmt stattdessen der
  // Bindestrich-Split in translateToken().
  if (!bare.includes('-')) {
    for (const key of TRANSLATE_KEYS_BY_LENGTH) {
      if (bare.length > key.length && bare.startsWith(key)) {
        const rest = bare.slice(key.length);
        return rest.length > 1 ? `${TRANSLATE[key]} ${rest}` : TRANSLATE[key];
      }
    }
  }
  return null;
}

function translateToken(token) {
  const bare = token.toLowerCase().replace(/[.,;:!?()„"—–]/g, '');
  const direct = translateBare(bare);
  if (direct) return [direct];
  if (DROP_WORDS.has(bare)) return [];
  if (bare.includes('-')) {
    return bare
      .split('-')
      .flatMap((half) => (DROP_WORDS.has(half) ? [] : [translateBare(half) ?? half]));
  }
  // bare statt token zurückgeben: sonst würde z.B. "vs." mit Punkt am Ende
  // durchrutschen, weil der Stopword-Abgleich in buildQuery() auf dem
  // bereits interpunktionsbereinigten Wort arbeitet.
  return [bare];
}

function buildQuery(titel) {
  const cleaned = titel
    .replace(/["""„]/g, '')
    .replace(/[?!:]/g, ' ')
    .replace(/\bunter \d+\s*euro\b/gi, '');
  const words = cleaned
    .split(/\s+/)
    .flatMap(translateToken)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w.toLowerCase()));

  // Aufeinanderfolgende Dopplungen entfernen (z.B. durch Übersetzung
  // entstandenes "sleep sleep").
  const deduped = words.filter((w, i) => i === 0 || w.toLowerCase() !== words[i - 1].toLowerCase());

  const query = deduped.slice(0, 8).join(' ').trim();
  return query || titel;
}

// ---------- 3. Externe APIs ----------

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Ein Retry mit kurzer Pause — bei 305 Themen × mehreren APIs sind
// vereinzelte transiente Netzwerkfehler/Timeouts normal; ohne Retry würden
// sie fälschlich als "0 Treffer" gewertet statt als Messfehler.
async function fetchJson(url, attempt = 0) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'wearables-themeninventur/1.0 (mailto:' + CONTACT + ')' },
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
    // Ein Budget-Fehler (429 "Insufficient budget") ist kein transientes Problem — ein
    // sofortiger Retry würde nur eine zweite, ebenso sinnlose Anfrage verschwenden.
    const istBudget = err?.status === 429 && typeof err.body === 'string' && err.body.includes('Insufficient budget');
    if (attempt < 1 && !istBudget) {
      await sleep(500);
      return fetchJson(url, attempt + 1);
    }
    throw err;
  }
}

// Wird nach der ersten erkannten Budget-Erschöpfung (429 "Insufficient budget") auf true
// gesetzt — alle weiteren OpenAlex-Aufrufe in diesem Lauf werden dann sofort übersprungen
// (kein sinnloses Weiterprobieren gegen 300 weitere Themen), und der nächste Lauf setzt dank
// des Checkpoints (siehe run()) genau dort fort, wo dieser aufgehört hat.
let openAlexBudgetErschoepft = false;
let openAlexLetzterAufruf = 0;

function istBudgetFehler(err) {
  return err?.status === 429 && typeof err.body === 'string' && err.body.includes('Insufficient budget');
}

async function checkOpenAlex(query) {
  if (openAlexBudgetErschoepft) {
    const err = new Error('OpenAlex-Budget bereits in diesem Lauf erschöpft — übersprungen.');
    err.budgetSkipped = true;
    throw err;
  }
  // Konservative Mindestpause zwischen OpenAlex-Anfragen (siehe CONCURRENCY-Kommentar oben).
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
    if (istBudgetFehler(err)) openAlexBudgetErschoepft = true;
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

async function checkDuckDuckGo(query) {
  try {
    const url = `https://duckduckgo.com/ac/?q=${encodeURIComponent(query)}&type=list`;
    const data = await fetchJson(url);
    return Array.isArray(data) && Array.isArray(data[1]) ? data[1].slice(0, 5) : [];
  } catch {
    return [];
  }
}

// ---------- 4. Pro Thema prüfen ----------

// `cachedOpenAlex`: ein aus einem früheren Lauf bereits erfolgreich abgefragtes OpenAlex-
// Ergebnis für dieses Thema (siehe Checkpoint-Logik in run()) — wird wiederverwendet statt
// erneut abgefragt, damit ein Budget-Erschöpfungs-Fehler in einem späteren Lauf nicht bereits
// erfolgreich geprüfte Themen wieder auf "Fehler" zurücksetzt.
async function checkThema(thema, cachedOpenAlex) {
  const query = buildQuery(thema.titel);
  const fallback = { hits: 0, reviews_in_sample: 0, recent_in_sample: 0, fehler: true };

  const [openalex, europepmc, nachfragehinweis] = await Promise.all([
    cachedOpenAlex ? Promise.resolve(cachedOpenAlex) : checkOpenAlex(query).catch(() => fallback),
    checkEuropePMC(query).catch(() => fallback),
    checkDuckDuckGo(query),
  ]);

  const gesamtQuellen = (openalex.hits ?? 0) + (europepmc.hits ?? 0);
  const reviews = (openalex.reviews_in_sample ?? 0) + (europepmc.reviews_in_sample ?? 0);
  const aktuelle = (openalex.recent_in_sample ?? 0) + (europepmc.recent_in_sample ?? 0);
  const tragfaehig = gesamtQuellen >= 6 && reviews >= 1 && aktuelle >= 2;
  const hatAbfragefehler = Boolean(openalex.fehler || europepmc.fehler);

  return {
    ...thema,
    suchquery: query,
    openalex,
    europepmc,
    nachfragehinweis,
    hatAbfragefehler,
    tragfaehig,
    begruendung: tragfaehig
      ? `${gesamtQuellen} Treffer gesamt, ${reviews} Review(s)/Meta-Analyse(n) im Sample, ${aktuelle} aktuelle (≥${RECENT_CUTOFF}) im Sample — erfüllt die Mindestschwelle (6 Quellen / 1 Review / 2 aktuelle).`
      : `${gesamtQuellen} Treffer gesamt, ${reviews} Review(s) im Sample, ${aktuelle} aktuelle im Sample — reicht (noch) nicht für 6+ Quellen / ≥1 Review / ≥2 aktuelle.`,
  };
}

// ---------- 5. Checkpoint (Wiederaufnahme nach OpenAlex-Budget-Stopp) ----------

// Lädt das Ergebnis eines früheren Laufs, falls vorhanden — Themen mit einem bereits
// erfolgreichen (fehlerfreien) OpenAlex-Ergebnis werden für OpenAlex nicht erneut abgefragt.
// So kann ein Lauf, der wegen erschöpften Budgets vorzeitig endet, im nächsten Aufruf genau
// dort fortsetzen, statt wieder bei Thema 1 zu beginnen und dasselbe knappe Budget erneut auf
// bereits geklärte Themen zu verschwenden.
function ladeCheckpoint() {
  try {
    const bisher = JSON.parse(readFileSync(OUTPUT_JSON, 'utf8'));
    const byTitel = new Map();
    for (const t of bisher) {
      if (t.openalex && !t.openalex.fehler) byTitel.set(t.titel, t.openalex);
    }
    return byTitel;
  } catch {
    return new Map();
  }
}

// ---------- 6. Runner mit Concurrency-Pool ----------

async function run() {
  const alleThemen = parseThemen().slice(0, LIMIT);
  const cache = ladeCheckpoint();
  console.log(
    `${alleThemen.length} Kern-Themen geparst (${cache.size} davon mit bereits erfolgreichem OpenAlex-Ergebnis aus einem früheren Lauf). Prüfe Quellenlage (OpenAlex + Europe PMC + DuckDuckGo)...`,
  );

  const ergebnisse = alleThemen.slice();
  let index = 0;
  let done = 0;
  let wiederverwendet = 0;

  function flush() {
    writeFileSync(OUTPUT_JSON, JSON.stringify(ergebnisse, null, 2) + '\n');
  }

  async function worker() {
    while (index < alleThemen.length) {
      const i = index++;
      const thema = alleThemen[i];
      const cachedOpenAlex = cache.get(thema.titel);
      if (cachedOpenAlex) wiederverwendet++;
      try {
        ergebnisse[i] = await checkThema(thema, cachedOpenAlex);
      } catch (err) {
        ergebnisse[i] = { ...thema, fehler: String(err), tragfaehig: false, begruendung: 'Abfragefehler.' };
      }
      done++;
      if (done % 10 === 0 || done === alleThemen.length) flush();
      if (done % 20 === 0 || done === alleThemen.length) {
        console.log(`  ${done}/${alleThemen.length} geprüft...`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  flush();

  const tragfaehigCount = ergebnisse.filter((t) => t.tragfaehig).length;
  const fehlerCount = ergebnisse.filter((t) => t.hatAbfragefehler || t.fehler).length;
  console.log(`\nFertig: ${tragfaehigCount}/${ergebnisse.length} Kern-Themen tragfähig. Ergebnis: ${OUTPUT_JSON}`);
  console.log(`OpenAlex: ${wiederverwendet} Thema(en) aus Checkpoint wiederverwendet, ${done - wiederverwendet} neu abgefragt.`);
  if (openAlexBudgetErschoepft) {
    console.log(
      `OpenAlex-Budget während dieses Laufs erschöpft — verbleibende Themen liefen nur mit Europe PMC. Skript erneut ausführen, sobald das Budget zurückgesetzt ist (siehe letzte 429-Antwort für den Reset-Zeitpunkt); dank Checkpoint werden dann nur noch die fehlenden Themen abgefragt.`,
    );
  }
  if (fehlerCount > 0) {
    console.log(`Achtung: ${fehlerCount} Thema/Themen hatten mindestens einen Abfragefehler (auch nach Retry) — deren "tragfähig:false" kann ein Messfehler statt ein echtes "nein" sein. Lauf ggf. wiederholen.`);
  }
}

run();
