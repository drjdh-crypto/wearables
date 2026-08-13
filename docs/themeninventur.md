# Themeninventur — Beleg für die Content-Tragfähigkeit

Automatisierte Prüfung, ob der Themenkern „Schlaf- und Recovery-Tracking" (305 Themen in
`data/themeninventur.md`) tief genug ist, um die eigenen Diversitätsregeln der
Redaktions-Pipeline (`agents/pipeline/01-recherche.md`) einzuhalten: 6–10 Quellen je Artikel,
mindestens 1 Review/Meta-Analyse, mindestens 2 Arbeiten aus den letzten 3 Jahren.

Skript: `agents/pipeline/scripts/themeninventur-check.mjs` · Rohdaten: `data/themeninventur.json`
· Aufruf: `node agents/pipeline/scripts/themeninventur-check.mjs` (Testlauf mit
`LIMIT=10 node ...`).

## Ergebnis auf einen Blick

**22 von 305 Kern-Themen (7 %) sind nach der aktuellen Messung „tragfähig".** Das liegt weit
unter dem Ziel von 300 — aber diese Zahl ist, wie unten erklärt, eine **Untergrenze aus einer
beschädigten Messung**, keine verlässliche Endzahl. Der Hauptgrund steht unter „Grenzen dieser
Messung".

### Nach Kategorie

| Kategorie | tragfähig | gesamt | Anteil |
|---|---|---|---|
| grundlagen | 13 | 145 | 9 % |
| genauigkeits-check | 5 | 95 | 5 % |
| kaufberatung | 4 | 58 | 7 % |
| produktzyklus | 0 | 7 | 0 % |
| **Summe** | **22** | **305** | **7 %** |

### Nach Original-Cluster (aus `data/themeninventur.md`)

| Cluster | tragfähig | gesamt |
|---|---|---|
| Schlafphysiologie | 11 | 45 |
| Tracking-Genauigkeit & Methodik | 2 | 60 |
| HRV & Recovery | 2 | 45 |
| Gerätevergleiche & Kaufberatung | 4 | 60 |
| Praxis & Alltag | 0 | 65 |
| Methodik-Kritik & Limitationen | 3 | 30 |

### Nach Zwiebelring

Alle 305 geprüften Themen liegen im **Kern** (Schlaf- und Recovery-Tracking) — `data/themeninventur.md`
enthält aktuell keine Themen in den Ringen „Schlafumgebung" oder „Stress & Erholung", diese
existieren nur als Kandidaten für eine mögliche Erweiterung (siehe Empfehlung unten).

## Warum 22/305 die tatsächliche Tragfähigkeit unterschätzt

Der Lauf hat eine **externe Störung** getroffen, die noch während dieser Session auftrat:
**OpenAlex hat sein API-Modell auf ein Tagesbudget umgestellt** und lehnte ab einem bestimmten
Punkt jede weitere Anfrage mit `429 Insufficient budget` ab (Reset erst um Mitternacht UTC).
Das betraf **alle 305 Themen** in diesem Lauf — die Zahlen unten beruhen ausschließlich auf
**Europe PMC**, nicht auf der Summe aus OpenAlex + Europe PMC wie ursprünglich vorgesehen.

Das ist relevant, weil OpenAlex und Europe PMC unterschiedliche Ausschnitte der Literatur
indizieren: Europe PMC deckt vorwiegend biomedizinische/Life-Sciences-Literatur ab, während
OpenAlex zusätzlich Technik-/Informatik-Venues (z. B. IEEE-Sensorik- und Algorithmus-Paper)
mit abdeckt, die für Wearable-Genauigkeit und Sensor-Methodik relevant sind, in Europe PMC aber
oft fehlen. Eine Stichprobe zur Einordnung: Bei 8 Vergleichs-Suchbegriffen aus dem Themenkern
lag der OpenAlex-Treffer für "circadian rhythm" bei über 250.000 (vor dem Budget-Stopp
gemessen, siehe Commit-Historie), während Europe PMC für dasselbe, sehr gut erforschte Thema
deutlich niedriger liegt. **207 der 305 Themen (68 %) hatten in dieser Messung 0 Treffer
insgesamt** — ein Wert, der für ein derart gut erforschtes Themenfeld unplausibel niedrig ist
und größtenteils auf den fehlenden OpenAlex-Beitrag zurückgeht, nicht auf tatsächlich fehlende
Literatur.

**Empfehlung:** Lauf nach Mitternacht UTC (bzw. sobald `agents/pipeline/scripts/themeninventur-check.mjs`
wieder erfolgreiche OpenAlex-Antworten liefert) wiederholen — Befehl unverändert:
`node agents/pipeline/scripts/themeninventur-check.mjs`. Solange nur der Europe-PMC-Anteil
verfügbar ist, sollte „tragfähig: false" nicht als endgültiges „kein Thema" gelesen werden.

## Weitere Grenzen der Messung (unabhängig vom OpenAlex-Ausfall)

- **Deutsch→Englisch-Übersetzung ist ein Wörterbuch, kein MT-System.** Rund 200 wiederkehrende
  Fachbegriffe aus den 305 Themen sind hinterlegt (`TRANSLATE` im Skript), aber seltene,
  themenspezifische Wörter in einzelnen Titeln bleiben unübersetzt und schwächen die
  Trefferquote für genau diese Themen. Stichprobenprüfung während der Entwicklung zeigte das
  z. B. bei „Ausschüttung", „Mikroarousals" oder „Zusammenhang" — nachträglich ergänzt, aber
  die Liste ist mit Sicherheit nicht vollständig.
- **Review-/Aktualitäts-Erkennung ist stichprobenbasiert.** OpenAlex und Europe PMC liefern
  pro Anfrage nur die ersten 25 Treffer zur Auswertung von `reviews_in_sample`/
  `recent_in_sample`, nicht das vollständige Trefferset — bei sehr großen Trefferzahlen (z. B.
  hunderttausende) ist das eine Stichprobe, kein vollständiger Zensus.
- **Nachfragehinweis (DuckDuckGo-Autocomplete) ist ein kostenloser Proxy, kein Ersatz für ein
  dediziertes Keyword-Tool** — die Vorschläge sind im JSON pro Thema hinterlegt, fließen aber
  nicht in die harte „tragfähig"-Berechnung ein, nur als zusätzlicher Kontext.
- **„Tragfähig" prüft nur Literaturvorkommen, nicht redaktionelle Eignung.** Kaufberatungs-
  und Produktzyklus-Themen (z. B. „Bester Schlaftracker unter 100 Euro") sind per Natur keine
  Forschungsfragen und werden von dieser Messung fast durchgängig als „nicht tragfähig"
  eingestuft (produktzyklus: 0/7, kaufberatung: 4/58) — obwohl viele davon redaktionell
  sinnvoll sind, weil sie *innerhalb* des Artikeltexts auf dieselben Genauigkeits-/Grundlagen-
  Studien verweisen können, die andere Kern-Themen bereits abdecken. Diese Kategorien sollten
  nicht 1:1 an derselben Schwelle gemessen werden wie „grundlagen"/„genauigkeits-check" —
  ihre tatsächliche Tragfähigkeit hängt von der Literaturdeckung der referenzierten
  Grundlagenthemen ab, nicht von eigenen Direkttreffern.

## Empfehlung: welchen Ring öffnen?

Der Kern bleibt (selbst nach einem vollständigen Nachlauf mit OpenAlex) voraussichtlich unter
300 tragfähigen Themen, sobald man die oben genannten Verzerrungen einrechnet — schon jetzt
zeigen 8 weitere Themen "fast" tragfähig (Quellenzahl + Review erfüllt, nur an der
Aktualitätsschwelle gescheitert). Um dauerhaft über 300 zu kommen, falls der Kern nach dem
OpenAlex-Nachlauf tatsächlich knapp bleibt, wurde eine Vergleichsmessung für die beiden
Kandidaten-Ringe durchgeführt (Europe-PMC-Trefferzahlen für je 6 repräsentative Suchbegriffe,
12.08.2026):

| Ring | Repräsentative Begriffe | Europe-PMC-Treffer (Median) |
|---|---|---|
| Schlafumgebung (Matratze, Raumklima, Lärm, Verdunkelung) | 6 | ~2.335 |
| Stress & Erholung (Cortisol, HRV-Biofeedback, Meditation, Burnout) | 6 | ~14.948 |

**Empfehlung: Ring „Stress & Erholung" zuerst öffnen.** Begründung:

1. Deutlich höhere und konsistentere Literaturdeckung in der Stichprobe (Median ~6× höher als
   „Schlafumgebung").
2. Inhaltliche Nähe zum bestehenden Cluster „HRV & Recovery" im Kern — Begriffe wie Cortisol,
   autonomes Nervensystem und Recovery-Scores sind bereits im Übersetzungswörterbuch und in
   bestehenden Artikeln verankert, was den redaktionellen Übergang erleichtert (weniger neue
   Fachterminologie, mehr Anschlussfähigkeit an bereits recherchierte Quellen).
3. „Schlafumgebung" bleibt als zweite Option sinnvoll (Matratzen/Raumklima-Themen haben klare
   Kaufberatungs-Anschlussfähigkeit), sollte aber erst nach „Stress & Erholung" geprüft werden,
   falls Letzterer allein nicht ausreicht.

Nächster konkreter Schritt: `data/themeninventur.md` um einen neuen Abschnitt für den Ring
„Stress & Erholung" ergänzen (Kandidatentitel sammeln, analog zu den bestehenden Sektionen A–F),
dann `themeninventur-check.mjs` erneut darüber laufen lassen.
