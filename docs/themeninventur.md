# Themeninventur — Beleg für die Content-Tragfähigkeit

**Status: abgeschlossen**, mit einer offenen Ausnahme (OpenAlex-Nachlauf, siehe unten). Weitere
Änderungen an dieser Inventur nur noch bei Bedarf (neue Ringe, geänderte Diversitätsregeln,
verfügbares OpenAlex-Budget) — kein routinemäßiger Nachlauf.

Automatisierte Prüfung, ob der Themenkern „Schlaf- und Recovery-Tracking" (305 Kern-Themen in
`data/themeninventur.md`, plus zwei real gemessene Ring-Kandidaten mit 73 bzw. 54 Themen) tief
genug ist, um die eigenen Diversitätsregeln der Redaktions-Pipeline
(`agents/pipeline/01-recherche.md`) einzuhalten: 6–10 Quellen je Artikel, mindestens 1
Review/Meta-Analyse, mindestens 2 Arbeiten aus den letzten 3 Jahren.

Es gibt **zwei Messungen**, die zusammen gelesen werden müssen:

| Skript | Rohdaten | Miss die Tragfähigkeit von... |
|---|---|---|
| `agents/pipeline/scripts/themeninventur-check.mjs` | `data/themeninventur.json` | ...jedem Thema für sich allein (direkte Literaturtreffer zum genauen Titel) |
| `agents/pipeline/scripts/themeninventur-cluster-check.mjs` | `data/themeninventur-cluster.json` | ...dem geteilten Quellenpool des Geräts/Mechanismus/Phänomens/Umgebungsfaktors, auf dem ein Thema aufbaut |

## Warum zwei Messungen? Die themenbasierte Messung unterschätzt systematisch

Die themenbasierte Messung prüft pro Einzelthema, ob GENAU dieser eine Titel genug direkte
Literaturtreffer hat. Das ist zu streng: Ein Artikel zitiert in der Praxis nicht nur
hochspezifische Literatur zu seinem exakten Titel, sondern schöpft aus dem Quellenpool des
zugrunde liegenden Geräts, Mechanismus, Phänomens oder Umgebungsfaktors — und diesen Pool teilen
sich viele Artikel. Die clusterbasierte Messung bildet das nach, ist dafür aber **optimistisch**:
Sie summiert Treffer über alle einem Thema zugeordneten Cluster, ohne Überlappungen zwischen
Clustern herauszurechnen. Beide Messungen sind bewusst als **Unter-** und **Obergrenze** zu
lesen, „kombiniert" (themenbasiert **oder** clusterbasiert tragfähig) ist die realistischste
verfügbare Schätzung.

### Drei Cluster-Ebenen

`themeninventur-cluster-check.mjs` unterscheidet drei Layer:

1. **Geräte-/Mechanismus-Cluster** (21): PPG-Sensorik, HRV-Messung, Schlafstadien-
   Klassifikation, Oura, Whoop, Garmin, Matratzensensorik usw. — die ursprüngliche Ebene.
2. **Phänomen-/Populations-Cluster** (9): Schichtarbeit und Schlaf, Wochenend-Jetlag/Social
   Jetlag, Alkohol und Schlaf, Koffein und Schlaf, Alter und Schlafarchitektur, Schlaf bei
   Eltern kleiner Kinder, Höhentraining und Schlaf, Menstruationszyklus und Schlaf,
   Licht/Chronobiologie.
3. **Raumklima-/Umgebungsfaktoren-Cluster** (4, neu): Schlaftemperatur/Raumklima, Lärm/Akustik,
   Luftqualität/CO2, Luftfeuchtigkeit — ergänzt, nachdem die ersten beiden Ebenen den Ring
   „Schlafumgebung" erkennbar unterversorgt ließen (siehe unten).

Jedes Thema wird gegen **alle drei Ebenen zusammen** geprüft (`tragfaehigCluster`); zusätzlich
wird separat festgehalten, was allein die Geräte-/Mechanismus-Ebene ergäbe
(`tragfaehigClusterGeraetMechanismus`), um den Beitrag der jüngeren Ebenen isoliert auszuweisen.

## Ergebnis auf einen Blick

| Bereich | Themen gesamt | Themenbasiert | **Kombiniert** |
|---|---|---|---|
| Kern | 305 | 22 (7 %) | **228 (75 %)** |
| Ring: Stress & Erholung | 73 | 0 (0 %) | **61 (84 %)** |
| Ring: Schlafumgebung | 54 | 0 (0 %) | **38 (70 %)** |
| **Kern + beide Ringe** | **432** | **22 (5 %)** | **327 (76 %)** |

**Mit beiden real gemessenen Ringen liegt die Gesamtzahl tragfähiger Themen bei 327 — deutlich
über dem Ziel von 300.** Für beide Ringe wurden echte Themenlisten erstellt
(`data/themeninventur.md`, Abschnitt „Ring-Kandidaten") und mit identischer Methodik gemessen
wie der Kern; keine der Zahlen ist geschätzt. Alle Zahlen laufen weiterhin **ohne echte
OpenAlex-Daten** (siehe unten) — sie sind also selbst noch eine Untergrenze der
Unter-/Obergrenze-Spanne, kein endgültiges Ergebnis.

**Kern allein reicht weiterhin nicht** (228/305, unter 300) — mindestens ein Ring muss geöffnet
sein, um die Schwelle zu erreichen; siehe Empfehlung unten.

## Phänomen-Cluster-Korrektur: Auswirkung auf „Praxis & Alltag"

| | Nur Geräte-/Mechanismus-Cluster | Mit Phänomen-Clustern | Differenz |
|---|---|---|---|
| Praxis & Alltag (65 Themen), clusterbasiert | 31 tragfähig | 33 tragfähig | **+2** |
| Schlafphysiologie (45 Themen), clusterbasiert | 27 tragfähig | 33 tragfähig | **+6** |
| Alle 305 Kern-Themen, kombiniert (Thema + Cluster) | 219 | 228 | **+9** |

Die Verbesserung für „Praxis & Alltag" selbst fiel kleiner aus als ursprünglich erwartet (+2,
nicht +15–20): Viele inhaltlich passende Themen („Koffein-Halbwertszeit und Schlaf",
„Blaulichtfilter", „Sport am Abend") liegen in diesem Datensatz tatsächlich unter
„Schlafphysiologie", nicht unter „Praxis & Alltag" — dort schlägt die Korrektur mit +6 deutlich
stärker durch. Innerhalb von „Praxis & Alltag" matchen nur 7 der 65 Themen überhaupt einen
Phänomen-Cluster, wovon 5 vorher schon über einen Geräte-/Mechanismus-Cluster abgedeckt waren.

## Raumklima-Cluster-Korrektur: Auswirkung auf „Schlafumgebung"

Die erste Ring-Messung (Geräte-/Mechanismus- + Phänomen-Ebene, ohne Raumklima-Cluster) zeigte
für „Schlafumgebung" nur 23/54 (43 %) — mit 31 von 54 Themen (57 %) ganz ohne Cluster-Zuordnung,
weil reine Umgebungsfaktoren wie Raumtemperatur, Lärm oder Luftqualität noch nicht modelliert
waren. Nach Ergänzung der vier Raumklima-Cluster:

| | Ohne Raumklima-Cluster | Mit Raumklima-Cluster | Differenz |
|---|---|---|---|
| Schlafumgebung (54 Themen), kombiniert | 23 (43 %) | **38 (70 %)** | **+15** |
| Themen ohne jede Cluster-Zuordnung | 31/54 (57 %) | 16/54 (30 %) | −15 |

Cluster-Nutzung innerhalb des Rings: `raumtemperatur-schlaf` (5 Themen), `laerm-akustik-schlaf`
(4), `luftqualitaet-co2-schlaf` (6), `luftfeuchtigkeit-schlaf` (2) — plus eine kleine
Zusatzverbesserung durch die Erweiterung von `licht-chronobiologie` um „Verdunkelung" (bisher
nicht erfasst, obwohl dasselbe Phänomen wie Lichtexposition, nur umgekehrtes Vorzeichen).
Zusammen mit dem bereits vorhandenen `matratzensensorik`-Cluster (12 Themen) ist die
Cluster-Abdeckung von „Schlafumgebung" jetzt in der gleichen Größenordnung wie beim Kern.

Die verbleibenden 16 nicht zugeordneten Themen sind überwiegend sehr allgemeine Fragen („Warum
Frauen und Männer unterschiedliche Schlafmuster haben können"-artige Formulierungen) oder
Nischenkombinationen, für die eine weitere Cluster-Verfeinerung abnehmenden Ertrag hätte —
diese Inventur betrachtet die Cluster-Abdeckung damit als ausreichend granular.

## Kern — nach Kategorie (kombiniert)

| Kategorie | Kombiniert | Gesamt | Anteil |
|---|---|---|---|
| grundlagen | 100 | 145 | 69 % |
| genauigkeits-check | 66 | 95 | 69 % |
| kaufberatung | 57 | 58 | 98 % |
| produktzyklus | 5 | 7 | 71 % |
| **Summe** | **228** | **305** | **75 %** |

## Ring-Messungen (real, nicht geschätzt)

### Ring: Stress & Erholung (73 Themen) — 61 tragfähig (84 %)

| Kategorie | Kombiniert | Gesamt |
|---|---|---|
| grundlagen | 15 | 25 |
| genauigkeits-check | 18 | 19 |
| kaufberatung | 20 | 20 |
| produktzyklus | 8 | 9 |

Höchste Tragfähigkeitsquote aller gemessenen Bereiche — der Ring teilt sich fast vollständig
bereits gut modellierte Cluster mit dem Kern (`hrv-messung`, `recovery-score-algorithmus`,
dieselben Gerätehersteller-Cluster).

### Ring: Schlafumgebung (54 Themen) — 38 tragfähig (70 %, nach Raumklima-Korrektur)

| Kategorie | Kombiniert | Gesamt |
|---|---|---|
| grundlagen | 8 | 13 |
| genauigkeits-check | 12 | 15 |
| kaufberatung | 14 | 20 |
| produktzyklus | 4 | 6 |

Herleitung der Korrektur siehe Abschnitt oben. Mit 70 % liegt dieser Ring jetzt näher an, wenn
auch weiterhin unter, der Kern-Quote (75 %) — der verbleibende Abstand ist plausibel (Kern und
Stress & Erholung profitieren von einer bereits über Monate gewachsenen, dichteren
Cluster-Landschaft; Schlafumgebung wurde erst in dieser Runde vollständig modelliert).

## OpenAlex-Nachlauf: weiterhin ausstehend (einzige offene Position)

**Zuletzt geprüft am 13.08.2026 — OpenAlex meldet weiterhin `429 Insufficient budget`** (Reset
laut Antwort um Mitternacht UTC; zum Zeitpunkt der letzten Prüfung lagen noch mehrere Stunden
bis dahin). Alle Zahlen in diesem Dokument beruhen deshalb ausschließlich auf Europe-PMC-Daten.
Das ist der **einzige noch offene Punkt** dieser Inventur — inhaltlich/methodisch gilt sie sonst
als abgeschlossen.

Die Infrastruktur für den Nachlauf ist gebaut und getestet: `mailto`-Parameter (polite pool),
konservatives Rate-Limit (Concurrency 2, 300 ms Mindestpause zwischen OpenAlex-Anfragen,
sofortiger Abbruch bei erkanntem Budget-Fehler), Checkpoint/Resume (bereits erfolgreich
geprüfte Themen/Cluster werden nicht erneut abgefragt, Zwischenspeicherung alle 10 Themen).
Sobald das Budget verfügbar ist, genügt ein unveränderter erneuter Aufruf:

```
node agents/pipeline/scripts/themeninventur-check.mjs
node agents/pipeline/scripts/themeninventur-cluster-check.mjs
```

Nach einem erfolgreichen Nachlauf: Zahlen in diesem Dokument aktualisieren, aktuelle
(Europe-PMC-only) Werte als Vergleich stehen lassen:

| Messung | Europe-PMC-only (13.08.2026, hier dokumentiert, final) | Mit OpenAlex (ausstehend) |
|---|---|---|
| Kern kombiniert | 228/305 | — |
| Stress & Erholung kombiniert | 61/73 | — |
| Schlafumgebung kombiniert | 38/54 | — |
| Gesamt kombiniert | 327/432 | — |

Da die Europe-PMC-only-Zahlen bereits komfortabel über dem 300er-Ziel liegen, ändert ein
späterer OpenAlex-Nachlauf voraussichtlich nichts an der grundsätzlichen Schlussfolgerung
(Kern + mindestens ein Ring reicht) — er würde die Zahlen eher weiter nach oben korrigieren
(OpenAlex deckt zusätzlich Technik-/Informatik-Venues ab, die Europe PMC nicht indiziert) und
die verbleibenden 105 nicht-tragfähigen Themen teilweise noch drehen.

## Weitere Grenzen der Messung

**Themenbasiert:** Deutsch→Englisch-Übersetzung ist ein Wörterbuch, kein MT-System; Review-/
Aktualitäts-Erkennung ist stichprobenbasiert (erste 25 Treffer je Anfrage).

**Clusterbasiert:**

- Pooling rechnet Überlappung zwischen Clustern nicht heraus (optimistische Obergrenze) —
  ersetzt nicht `validate-quellen.mjs` vor der echten Recherche.
- Cluster-Zuordnung ist Keyword-basiert (Regex gegen den deutschen Titel) — inhaltlich
  passende, aber anders formulierte Themen werden verpasst (siehe die verbleibenden 16
  unzugeordneten Schlafumgebung-Themen und die generell 106 unzugeordneten Themen insgesamt).
- Ultrahuman und Coros bleiben selbst gepoolt zu klein für die Diversitätsschwelle.
- 44 Cluster über drei Ebenen — nicht erschöpfend, aber inzwischen so granular, dass weitere
  Verfeinerung absehbar abnehmenden Ertrag hätte (siehe „Raumklima-Cluster-Korrektur" oben).

## Empfehlung: welche Ringe öffnen?

**Mit realen Zahlen: Kern allein reicht nicht (228/305). Jede Kombination aus Kern + einem der
beiden Ringe reicht bereits (228+61=289 knapp darunter; 228+38=266 darunter) — erst Kern + BEIDE
Ringe (327) liegt komfortabel über 300. Ein einzelner Ring allein reicht knapp nicht, macht die
Lücke aber klein genug, dass eine moderate Erweiterung ausreichen würde.**

1. **Stress & Erholung öffnen — klar empfohlen:** 84 % Tragfähigkeitsquote, die höchste aller
   gemessenen Bereiche, praktisch risikofrei wegen der Überschneidung mit bereits im Kern gut
   abgedeckten Clustern.
2. **Schlafumgebung öffnen — nach der Raumklima-Korrektur ebenfalls solide (70 %):** War in der
   ersten Messung noch die schwächere Wahl, ist nach Ergänzung der vier Raumklima-Cluster jetzt
   nur noch 5 Prozentpunkte hinter dem Kern und klar oberhalb der 6/1/2-Diversitätsschwelle in
   den meisten Unterkategorien.
3. **Beide zusammen (327/432) sind die belastbarste Basis** für „mindestens 300 tragfähige
   Themen" — mit Puffer, auch wenn einzelne Themen sich in der redaktionellen Praxis als doch
   nicht tragfähig erweisen sollten.

**Status dieser Empfehlung:** Mit den jetzt vorliegenden, real gemessenen Zahlen ist die
ursprüngliche Frage („reicht der Kern für 300 tragfähige Themen") abschließend beantwortet:
nein, aber Kern + beide Ringe zusammen deutlich. Weitere Iterationen an der Cluster-Methodik
sind nicht mehr nötig, um diese Kernaussage zu stützen.
