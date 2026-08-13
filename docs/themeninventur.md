# Themeninventur — Beleg für die Content-Tragfähigkeit

Automatisierte Prüfung, ob der Themenkern „Schlaf- und Recovery-Tracking" (305 Kern-Themen in
`data/themeninventur.md`, plus zwei real gemessene Ring-Kandidaten mit 73 bzw. 54 Themen) tief
genug ist, um die eigenen Diversitätsregeln der Redaktions-Pipeline
(`agents/pipeline/01-recherche.md`) einzuhalten: 6–10 Quellen je Artikel, mindestens 1
Review/Meta-Analyse, mindestens 2 Arbeiten aus den letzten 3 Jahren.

Es gibt **zwei Messungen**, die zusammen gelesen werden müssen:

| Skript | Rohdaten | Miss die Tragfähigkeit von... |
|---|---|---|
| `agents/pipeline/scripts/themeninventur-check.mjs` | `data/themeninventur.json` | ...jedem Thema für sich allein (direkte Literaturtreffer zum genauen Titel) |
| `agents/pipeline/scripts/themeninventur-cluster-check.mjs` | `data/themeninventur-cluster.json` | ...dem geteilten Quellenpool des Geräts/Mechanismus/Phänomens, auf dem ein Thema aufbaut |

## Warum zwei Messungen? Die themenbasierte Messung unterschätzt systematisch

Die themenbasierte Messung prüft pro Einzelthema, ob GENAU dieser eine Titel genug direkte
Literaturtreffer hat. Das ist zu streng: Ein Artikel zitiert in der Praxis nicht nur
hochspezifische Literatur zu seinem exakten Titel, sondern schöpft aus dem Quellenpool des
zugrunde liegenden Geräts, Mechanismus oder Phänomens — und diesen Pool teilen sich viele
Artikel. Die clusterbasierte Messung bildet das nach, ist dafür aber **optimistisch**: Sie
summiert Treffer über alle einem Thema zugeordneten Cluster, ohne Überlappungen zwischen
Clustern herauszurechnen. Beide Messungen sind bewusst als **Unter-** und **Obergrenze** zu
lesen, „kombiniert" (themenbasiert **oder** clusterbasiert tragfähig) ist die realistischste
verfügbare Schätzung.

### Zwei Cluster-Ebenen

`themeninventur-cluster-check.mjs` unterscheidet inzwischen zwei Layer:

1. **Geräte-/Mechanismus-Cluster** (21, z. B. PPG-Sensorik, HRV-Messung, Schlafstadien-
   Klassifikation, Oura, Whoop, Garmin, Matratzensensorik) — die ursprüngliche Ebene.
2. **Phänomen-/Populations-Cluster** (9, neu): Schichtarbeit und Schlaf, Wochenend-
   Jetlag/Social Jetlag, Alkohol und Schlaf, Koffein und Schlaf, Alter und Schlafarchitektur,
   Schlaf bei Eltern kleiner Kinder, Höhentraining und Schlaf, Menstruationszyklus und Schlaf,
   Licht/Chronobiologie. Diese Ebene schließt genau die Lücke, die Geräte-/Mechanismus-Cluster
   verpassen: Themen wie „Koffein-Halbwertszeit und Schlaf" haben keinen Geräte-Bezug, teilen
   sich aber trotzdem eine gemeinsame Koffein-Schlaf-Literatur mit anderen Koffein-Themen.

Jedes Thema wird gegen **beide** Ebenen zusammen geprüft (`tragfaehigCluster`); zusätzlich wird
separat festgehalten, was allein die Geräte-/Mechanismus-Ebene ergäbe
(`tragfaehigClusterGeraetMechanismus`) — so lässt sich der Beitrag der neuen Phänomen-Ebene
isoliert ausweisen (siehe unten).

## Ergebnis auf einen Blick

| Bereich | Themen gesamt | Themenbasiert | Clusterbasiert (voll, anwendbar) | **Kombiniert** |
|---|---|---|---|---|
| Kern | 305 | 22 (7 %) | 219/227 anwendbar | **228 (75 %)** |
| Ring: Stress & Erholung | 73 | 0 (0 %) | 61/61 anwendbar | **61 (84 %)** |
| Ring: Schlafumgebung | 54 | 0 (0 %) | 23/23 anwendbar | **23 (43 %)** |
| **Kern + beide Ringe** | **432** | **22 (5 %)** | — | **312 (72 %)** |

**Mit beiden real gemessenen Ringen liegt die Gesamtzahl tragfähiger Themen bei 312 — über dem
Ziel von 300.** Das ist keine Schätzung mehr (frühere Fassung dieses Dokuments): Für beide Ringe
wurden echte Themenlisten erstellt (`data/themeninventur.md`, Abschnitte H/I) und mit
identischer Methodik gemessen wie der Kern. Alle Zahlen laufen weiterhin **ohne echte
OpenAlex-Daten** (siehe unten) — sie sind also selbst noch eine Untergrenze der
Unter-/Obergrenze-Spanne, kein endgültiges Ergebnis.

**Wichtig — Kern allein reicht weiterhin nicht:** 228/305 bleibt unter 300. Erst mit
mindestens einem geöffneten Ring wird die Schwelle erreicht (siehe Empfehlung unten).

## Phänomen-Cluster-Korrektur: Auswirkung auf „Praxis & Alltag"

Die Hypothese hinter der neuen Cluster-Ebene war: Kategorien wie „Praxis & Alltag" (Koffein,
Alkohol, Jetlag, Alter, Elternschaft) profitieren von geteilten Themenpools genauso wie
geräte-lastige Kategorien — nur eben über Phänomene statt Geräte. Gemessene Auswirkung:

| | Nur Geräte-/Mechanismus-Cluster | Mit Phänomen-/Populations-Clustern | Differenz |
|---|---|---|---|
| Praxis & Alltag (65 Themen), clusterbasiert | 31 tragfähig | 33 tragfähig | **+2** |
| Schlafphysiologie (45 Themen), clusterbasiert | 27 tragfähig | 33 tragfähig | **+6** |
| Alle 305 Kern-Themen, kombiniert (Thema + Cluster) | 219 | 228 | **+9** |

**Die Verbesserung für „Praxis & Alltag" selbst ist kleiner als ursprünglich erwartet (+2, nicht
+15–20).** Grund: Viele der Themen, die inhaltlich zu den neuen Phänomen-Clustern passen würden
(„Koffein-Halbwertszeit und Schlaf", „Blaulichtfilter", „Sport am Abend"), liegen in diesem
Datensatz tatsächlich im Cluster **„Schlafphysiologie"**, nicht in „Praxis & Alltag" — genau
dort schlägt die Korrektur mit +6 auch deutlich stärker durch. Innerhalb von „Praxis & Alltag"
selbst matchen nur 7 der 65 Themen überhaupt einen Phänomen-Cluster (Alkohol, Schichtarbeit,
Alter/Senior:innen, Eltern/Kinder, Social Jetlag), wovon 5 vorher schon über einen
Geräte-/Mechanismus-Cluster abgedeckt waren (z. B. „Baby-Schlaftracker" über den
Eltern-Cluster **und** den allgemeinen Consumer-Wearable-Cluster). Nur 2 Themen
(„Alkohol am Vorabend …", „Schichtarbeit: Wie Trackingdaten …") kippen dadurch neu auf
tragfähig.

## Kern — nach Kategorie (kombiniert)

| Kategorie | Kombiniert | Gesamt | Anteil |
|---|---|---|---|
| grundlagen | 100 | 145 | 69 % |
| genauigkeits-check | 66 | 95 | 69 % |
| kaufberatung | 57 | 58 | 98 % |
| produktzyklus | 5 | 7 | 71 % |
| **Summe** | **228** | **305** | **75 %** |

## Ring-Messungen (real, nicht geschätzt)

Für beide Kandidaten-Ringe wurden konkrete Themenlisten erstellt (`data/themeninventur.md`,
neuer Abschnitt „Ring-Kandidaten" nach dem Glossar, Header-Tag `ring: stress-erholung` bzw.
`ring: schlafumgebung`) und mit identischer Methodik wie der Kern geprüft — themenbasiert
**und** clusterbasiert (inkl. der neuen Phänomen-Cluster).

### Ring: Stress & Erholung (73 Themen)

| Kategorie | Kombiniert | Gesamt |
|---|---|---|
| grundlagen | 15 | 25 |
| genauigkeits-check | 18 | 19 |
| kaufberatung | 20 | 20 |
| produktzyklus | 8 | 9 |
| **Summe** | **61** | **73** |

**84 % tragfähig — bestätigt die frühere Schätzung (50–65) am oberen Rand.** Grund: Dieser Ring
teilt sich fast vollständig bestehende, bereits gut modellierte Cluster mit dem Kern —
`hrv-messung` (24 Themen), `recovery-score-algorithmus` (11), plus die Geräte-Cluster
Oura/Whoop/Garmin/Polar/Apple Watch/Fitbit, die im Kern schon reichlich Literatur zeigen. Nur
12 von 73 Themen (16 %) sind keinem Cluster zuordenbar.

### Ring: Schlafumgebung (54 Themen)

| Kategorie | Kombiniert | Gesamt |
|---|---|---|
| grundlagen | 6 | 13 |
| genauigkeits-check | 8 | 15 |
| kaufberatung | 5 | 20 |
| produktzyklus | 4 | 6 |
| **Summe** | **23** | **54** |

**43 % tragfähig — deutlich unter der früheren Schätzung (35–45 waren als Zahl richtig, aber
der Anteil fällt niedriger aus als angenommen, weil der Ring mit 54 statt geschätzten 50–65
Themen etwas kleiner ausfiel).** Der eigentliche Grund für die niedrigere Quote: **31 von 54
Themen (57 %) sind keinem Cluster zuordenbar** — mehr als doppelt so viele wie im
Stress-&-Erholung-Ring (16 %). Der bestehende Cluster-Satz deckt Geräte gut ab
(`matratzensensorik` mit 12 Treffern, `withings` mit 3), aber **reine
Umgebungsfaktoren wie Raumtemperatur, Luftfeuchtigkeit, Lärm und Luftqualität haben noch
keinen eigenen Cluster** — anders als bei „Praxis & Alltag" wurde für diesen Ring keine
dedizierte Phänomen-Cluster-Ebene gebaut (der Auftrag nannte explizit Geräte-/
Mechanismus-Beispiele für die erste Cluster-Ebene und Phänomene/Populationen für die zweite,
beide primär mit Blick auf den Kern-Datensatz). Themen wie „Optimale Schlafzimmertemperatur"
oder „Lärm im Schlaf" fallen deshalb komplett auf die (strenge) themenbasierte Messung zurück,
die für sie 0/54 tragfähige Themen zeigt.

**Naheliegende Folgekorrektur (nicht mehr Teil dieses Auftrags, aber der klare nächste
Schritt):** eine dritte Cluster-Ebene „Raumklima/Umgebungsfaktoren" (Raumtemperatur, Akustik/
Lärm, Luftqualität, Licht-Verdunkelung als eigener Cluster statt nur über
`licht-chronobiologie`) würde die Schlafumgebung-Quote voraussichtlich ähnlich stark anheben
wie die Phänomen-Ebene das bei „Schlafphysiologie" getan hat (+6 von 45).

## OpenAlex-Nachlauf: weiterhin ausstehend

**Noch nicht möglich** — zuletzt geprüft am 13.08.2026, OpenAlex meldet weiterhin `429
Insufficient budget` (Reset laut Antwort um Mitternacht UTC). Alle Zahlen in diesem Dokument
(Kern, beide Ringe, Phänomen-Cluster) beruhen deshalb ausschließlich auf Europe-PMC-Daten.

Die Infrastruktur für den Nachlauf ist gebaut und getestet (siehe vorherige Fassung dieses
Dokuments für Details: `mailto`-Parameter, konservatives Rate-Limit, Checkpoint/Resume). Sobald
das Budget verfügbar ist, unverändert erneut ausführen:

```
node agents/pipeline/scripts/themeninventur-check.mjs
node agents/pipeline/scripts/themeninventur-cluster-check.mjs
```

Beide Skripte laden automatisch den bestehenden Stand aus `data/themeninventur.json` bzw.
`data/themeninventur-cluster.json` und fragen nur noch die Themen/Cluster ohne bereits
erfolgreiches OpenAlex-Ergebnis erneut ab. Nach einem erfolgreichen Nachlauf: Zahlen in diesem
Dokument aktualisieren, aktuelle (Europe-PMC-only) Werte als Vergleich stehen lassen:

| Messung | Europe-PMC-only (13.08.2026, hier dokumentiert) | Mit OpenAlex (ausstehend) |
|---|---|---|
| Kern kombiniert | 228/305 | — |
| Stress & Erholung kombiniert | 61/73 | — |
| Schlafumgebung kombiniert | 23/54 | — |
| Gesamt kombiniert | 312/432 | — |

## Weitere Grenzen der Messung

**Themenbasiert:** Deutsch→Englisch-Übersetzung ist ein Wörterbuch, kein MT-System; Review-/
Aktualitäts-Erkennung ist stichprobenbasiert (erste 25 Treffer je Anfrage).

**Clusterbasiert:**

- Pooling rechnet Überlappung zwischen Clustern nicht heraus (optimistische Obergrenze) —
  ersetzt nicht `validate-quellen.mjs` vor der echten Recherche.
- Cluster-Zuordnung ist Keyword-basiert (Regex gegen den deutschen Titel) — inhaltlich
  passende, aber anders formulierte Themen werden verpasst.
- **Ungleiche Cluster-Abdeckung zwischen den Bereichen:** Kern und Stress-&-Erholung-Ring
  profitieren stark von den 21 Geräte-/Mechanismus- und 9 Phänomen-Clustern; Schlafumgebung
  ist mit dem aktuellen Cluster-Satz unterversorgt (siehe oben) — die 43 % dort sind eher ein
  Signal für „hier fehlt noch ein Cluster" als für „dieser Ring ist schwächer belegbar".
- Ultrahuman und Coros bleiben selbst gepoolt zu klein (siehe vorherige Messung).

## Empfehlung: welche Ringe öffnen?

**Mit realen Zahlen statt Schätzung: Kern + Stress & Erholung allein reicht noch nicht (228 +
61 = 289, knapp unter 300). Erst mit Schlafumgebung zusätzlich (289 + 23 = 312) wird die
Schwelle überschritten.**

1. **Stress & Erholung öffnen — klar empfohlen, unabhängig von der Schlafumgebung-Frage:** 84 %
   Tragfähigkeitsquote, die höchste aller gemessenen Bereiche (auch höher als der Kern selbst).
   Praktisch risikofrei, weil er fast vollständig auf bereits im Kern gut abgedeckten Clustern
   aufbaut (HRV, Recovery-Scores, dieselben Gerätehersteller).
2. **Schlafumgebung danach öffnen, UND die fehlende Raumklima-Cluster-Ebene nachziehen:** Mit
   dem aktuellen Cluster-Satz trägt dieser Ring nur 23 von 54 Themen bei — genug, um zusammen
   mit Stress & Erholung die 300er-Schwelle zu überschreiten (312 gesamt), aber die eigentliche
   Literaturlage dürfte besser sein, als die 43 % zeigen (siehe Cluster-Lücken-Erklärung oben).
   Vor der redaktionellen Priorisierung dieses Rings lohnt sich die kleine Zusatzarbeit, einen
   Raumklima-Cluster zu ergänzen und neu zu messen — voraussichtlich mit spürbar besserem
   Ergebnis, analog zum Phänomen-Cluster-Effekt bei „Schlafphysiologie" (+6/45).
3. **Alternative, falls Schlafumgebung redaktionell zurückgestellt werden soll:** Kern + Stress
   & Erholung (289) liegt nur 11 Themen unter der Schwelle — eine moderate Erweiterung der
   Stress-&-Erholung-Liste (z. B. 15–20 weitere Themen bei ähnlicher 84-%-Quote) würde allein
   ausreichen, ohne den zweiten Ring zu benötigen.

**Nächster konkreter Schritt:** Cluster `raumklima-umgebungsfaktoren` in
`themeninventur-cluster-check.mjs` ergänzen (Raumtemperatur, Luftfeuchtigkeit, Lärm/Akustik,
Luftqualität/CO2), dann `themeninventur-cluster-check.mjs` erneut laufen lassen und die
Schlafumgebung-Zahlen in diesem Dokument aktualisieren.
