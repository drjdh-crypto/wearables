# Themeninventur — Beleg für die Content-Tragfähigkeit

Automatisierte Prüfung, ob der Themenkern „Schlaf- und Recovery-Tracking" (305 Themen in
`data/themeninventur.md`) tief genug ist, um die eigenen Diversitätsregeln der
Redaktions-Pipeline (`agents/pipeline/01-recherche.md`) einzuhalten: 6–10 Quellen je Artikel,
mindestens 1 Review/Meta-Analyse, mindestens 2 Arbeiten aus den letzten 3 Jahren.

Es gibt **zwei Messungen**, die zusammen gelesen werden müssen (Begründung siehe unten):

| Skript | Rohdaten | Miss die Tragfähigkeit von... |
|---|---|---|
| `agents/pipeline/scripts/themeninventur-check.mjs` | `data/themeninventur.json` | ...jedem Thema für sich allein (direkte Literaturtreffer zum genauen Titel) |
| `agents/pipeline/scripts/themeninventur-cluster-check.mjs` | `data/themeninventur-cluster.json` | ...dem geteilten Quellenpool des Geräts/Mechanismus, auf dem ein Thema aufbaut |

## Warum zwei Messungen? Die themenbasierte Messung unterschätzt systematisch

Die ursprüngliche, rein themenbasierte Messung prüft pro Einzelthema, ob GENAU dieser eine
Titel genug direkte Literaturtreffer hat. Das ist zu streng: Ein Artikel zitiert in der Praxis
nicht nur hochspezifische Literatur zu seinem exakten Titel, sondern schöpft aus dem
Quellenpool des zugrunde liegenden Geräts oder Messmechanismus — und diesen Pool teilen sich
viele Artikel. Ein Beispiel: Die Themen „Oura Ring 4: Wie genau ist die Schlafphasen-Erkennung?“,
„Oura vs. Whoop: Recovery-Score im Vergleich“ und „Oura Gen 3 vs. Gen 4: Was hat sich an der
Sensorik verändert?“ sind drei verschiedene Einzelthemen mit vermutlich je < 6 direkten
Treffern — aber alle drei können aus derselben, deutlich größeren Oura-Studienlage zitieren.
Die themenbasierte Messung sieht das nicht; die clusterbasierte Messung (neu) schon.

Die clusterbasierte Messung ist im Gegenzug **optimistisch**: Sie summiert Treffer über alle
einem Thema zugeordneten Cluster, ohne Überlappungen zwischen den Clustern herauszurechnen
(ein Paper, das sowohl in der PPG- als auch in der HRV-Cluster-Suche auftaucht, wird potenziell
doppelt gezählt). Die beiden Messungen sind deshalb bewusst als **Unter-** und **Obergrenze**
zu lesen, nicht als zwei unabhängige, gleichwertige Schätzungen.

## Ergebnis auf einen Blick

| Messung | Tragfähig | Basis | Charakter |
|---|---|---|---|
| Themenbasiert | 22 / 305 (7 %) | Direkte Treffer zum exakten Titel | Konservative Untergrenze |
| Clusterbasiert | 219 / 221 anwendbar (99 %; 84 Themen ohne Cluster-Zuordnung) | Gepoolter Quellenpool der zugeordneten Geräte-/Mechanismus-Cluster | Optimistische Obergrenze (Überlappung nicht herausgerechnet) |
| **Kombiniert** (thematisch **oder** clusterbasiert tragfähig) | **222 / 305 (73 %)** | Bestes verfügbares Bild aus beiden Messungen | Realistischste aktuell verfügbare Schätzung |

**222 von 305 Kern-Themen (73 %) sind nach der kombinierten Messung tragfähig — deutlich näher
am Ziel von 300 als die ursprüngliche themenbasierte Zahl (22/305), aber noch nicht dort.** Die
Lücke von 78 Themen wird unten mit einer konkreten Ring-Öffnungsempfehlung adressiert. Beide
Messungen laufen aktuell **ohne echte OpenAlex-Daten** (siehe nächster Abschnitt) — die
kombinierte Zahl ist deshalb selbst noch eine Untergrenze der Untergrenze/Obergrenze-Spanne,
kein Endergebnis.

### Warum die Differenz so groß ist (22 vs. 222)

Am deutlichsten zeigt sich der Effekt in den geräte-/mechanismus-lastigen Kategorien — dort
schließt die clusterbasierte Messung fast die gesamte Lücke:

| Original-Cluster | Themenbasiert | Kombiniert | Differenz |
|---|---|---|---|
| Gerätevergleiche & Kaufberatung | 4/60 | **59/60** | +55 |
| HRV & Recovery | 2/45 | **41/45** | +39 |
| Tracking-Genauigkeit & Methodik | 2/60 | **44/60** | +42 |
| Schlafphysiologie | 11/45 | 29/45 | +18 |
| Methodik-Kritik & Limitationen | 3/30 | 17/30 | +14 |
| Praxis & Alltag | 0/65 | 32/65 | +32 |

„Gerätevergleiche & Kaufberatung" und „HRV & Recovery" sind nach der kombinierten Messung
praktisch vollständig abgedeckt (98 % bzw. 91 %) — exakt die Kategorien, in denen Themen sich
laut der ursprünglichen Konstruktionslogik der Liste (Geräte-Achse × Metriken-Achse, siehe
`data/themeninventur.md`, Abschnitt „Methodik") am stärksten einen Quellenpool teilen. Das
bestätigt die eingangs genannte Hypothese direkt.

„Praxis & Alltag" bleibt mit 32/65 (49 %) am schwächsten — diese Kategorie besteht überwiegend
aus Alltagsfragen (Koffein-Halbwertszeit, Sport am Abend, Erste-Nacht-Effekt, Winterzeitumstellung),
die weder einem Gerät/Mechanismus noch einer eng gefassten Forschungsfrage entsprechen und
deshalb von keiner der beiden Messungen gut erfasst werden — nicht, weil die Themen redaktionell
unsinnig wären, sondern weil ihre Literatur breiter verteilt und schwerer automatisiert zu
finden ist. 83 der 305 Themen erreichen auf keiner der beiden Messungen die Schwelle; die
meisten davon fallen in genau dieses Muster.

### Nach Kategorie (kombiniert)

| Kategorie | Kombiniert | Gesamt | Anteil |
|---|---|---|---|
| grundlagen | 95 | 145 | 66 % |
| genauigkeits-check | 65 | 95 | 68 % |
| kaufberatung | 57 | 58 | 98 % |
| produktzyklus | 5 | 7 | 71 % |
| **Summe** | **222** | **305** | **73 %** |

### Nach Zwiebelring

Alle 305 geprüften Themen liegen im **Kern**. Die Ringe „Schlafumgebung" und „Stress &
Erholung" existieren nur als Kandidaten für eine mögliche Erweiterung (siehe Empfehlung unten)
— für sie gibt es noch keine Themenliste und damit noch keine Messung, nur eine grobe
Vergleichsschätzung auf Cluster-Ebene.

## OpenAlex-Nachlauf: Status und wie er weiterläuft

**Noch nicht möglich zum Zeitpunkt dieser Messung** — OpenAlex hat sein Tagesbudget weiterhin
bei $0 (`429 Insufficient budget`, Reset laut letzter Antwort um Mitternacht UTC). Beide Skripte
laufen deshalb bislang ausschließlich auf Europe-PMC-Daten; alle oben genannten Zahlen sind
entsprechend vorläufig.

Damit ein künftiger Lauf nicht wieder bei Thema 1 beginnt und dasselbe knappe Budget erneut auf
bereits geklärte Themen verschwendet, wurden beide Skripte um drei Dinge ergänzt:

1. **`mailto`-Parameter** (polite pool) bei jeder OpenAlex-Anfrage — unverändert vorhanden.
2. **Konservatives Rate-Limit:** Concurrency von 5 auf 2 gesenkt, plus eine explizite
   Mindestpause von 300 ms zwischen OpenAlex-Anfragen. Zusätzlich erkennt das Skript den
   spezifischen Budget-Fehler (429 mit „Insufficient budget" im Antworttext) und bricht
   OpenAlex-Anfragen für den Rest des Laufs sofort ab, statt alle verbleibenden Themen einzeln
   erfolglos durchzuprobieren.
3. **Zwischenspeicherung/Checkpoint:** Beide Skripte laden vor dem Start das Ergebnis des
   letzten Laufs. Themen/Cluster mit einem bereits **erfolgreichen** (fehlerfreien)
   OpenAlex-Ergebnis werden nicht erneut abgefragt, sondern aus der vorherigen Datei
   übernommen. Zusätzlich wird die Ausgabedatei alle 10 abgeschlossenen Themen auf die Platte
   geschrieben (nicht erst am Ende), sodass auch ein hart abgebrochener Lauf seinen Fortschritt
   nicht verliert. Verifiziert per Test: Ein Thema mit injiziertem Erfolgs-Ergebnis wurde beim
   nächsten Lauf korrekt übernommen statt erneut abgefragt (siehe Commit-Historie).

**Nächster Schritt, sobald das Budget zurückgesetzt ist:** beide Skripte unverändert erneut
ausführen —

```
node agents/pipeline/scripts/themeninventur-check.mjs
node agents/pipeline/scripts/themeninventur-cluster-check.mjs
```

— und diesen Abschnitt sowie die Ergebnistabellen oben mit den dann echten OpenAlex-Zahlen
aktualisieren, wobei die aktuellen (Europe-PMC-only) Zahlen als Vergleichswert stehen bleiben:

| Messung | Europe-PMC-only (13.08.2026, hier dokumentiert) | Mit OpenAlex (ausstehend) |
|---|---|---|
| Themenbasiert | 22/305 | — |
| Clusterbasiert (anwendbar) | 219/221 | — |
| Kombiniert | 222/305 | — |

## Weitere Grenzen der Messung

**Themenbasiert** (unverändert gegenüber der letzten Fassung dieses Dokuments):

- Deutsch→Englisch-Übersetzung ist ein ~200-Begriffe-Wörterbuch, kein MT-System — seltene,
  themenspezifische Wörter bleiben vereinzelt unübersetzt.
- Review-/Aktualitäts-Erkennung ist stichprobenbasiert (erste 25 Treffer je Anfrage).
- Nachfragehinweis (DuckDuckGo-Autocomplete) ist ein kostenloser Proxy, fließt nicht in die
  harte Berechnung ein.

**Clusterbasiert** (neu):

- **Pooling rechnet Überlappung nicht heraus** (siehe oben) — die 99 %-Quote unter den
  anwendbaren Themen ist eine Obergrenze, kein Beleg, dass jedes einzelne Thema tatsächlich 6
  nicht-überlappende, diverse Quellen bekäme. Vor der echten Recherche (Schritt 1 der Pipeline)
  ersetzt das nicht die Diversitätsprüfung mit `validate-quellen.mjs`.
- **84 von 305 Themen (28 %) sind keinem Cluster zuordenbar** — meist Alltags-/
  Populationsthemen ohne Geräte-/Mechanismus-Bezug (Koffein, Sport-Timing, Jahreszeitwechsel,
  Menstruationszyklus, Kurzschläfer-Gen). Für sie bleibt die themenbasierte Zahl maßgeblich,
  die clusterbasierte Messung liefert dort explizit `null` (nicht anwendbar), nicht `false`.
- **Zwei sehr kleine Geräte-Cluster fallen selbst gepoolt durch:** Ultrahuman (3 Treffer,
  1 Thema) und Coros (4 Treffer, 1 Thema) — diese Marken haben schlicht noch kaum unabhängige
  Validierungsliteratur, unabhängig von der Messmethode.
- **Cluster-Zuordnung ist Keyword-basiert** (Regex gegen den deutschen Titel) — ein Thema, das
  inhaltlich zu einem Cluster gehört, aber das Schlüsselwort nicht im Titel trägt (z. B.
  „Warum Hautton die Genauigkeit optischer Sensoren beeinflussen kann" für PPG), wird verpasst
  und landet in den 84 nicht zugeordneten Themen statt im richtigen Cluster.
- **31 Cluster** decken die Geräte-Achse (19 Geräte/Systeme) und Mechanismus-/Metriken-Achse
  (12) aus der ursprünglichen Konstruktionslogik der Themenliste ab (`data/themeninventur.md`,
  Abschnitt „Methodik") — nicht jedes denkbare Cluster wurde einzeln modelliert.

## Empfehlung: welche Ringe öffnen, in welcher Reihenfolge?

**Ja — auch die kombinierte, deutlich großzügigere Messung bleibt mit 222/305 unter 300.** Die
Lücke beträgt 78 Themen. Da für die Kandidaten-Ringe noch keine Themenliste existiert, lässt
sich ihr Beitrag nicht direkt messen — hier eine Schätzung auf Basis der bereits am 12.08.2026
durchgeführten Vergleichsmessung (Europe-PMC-Treffer für je 6 repräsentative Suchbegriffe) plus
der heute gemessenen kombinierten Tragfähigkeitsquote:

| Ring | Literaturdichte (Europe-PMC-Median, 6 Suchbegriffe) | Geschätzte Themenzahl bei ähnlicher Dichte wie bestehende Kategorien | Geschätzte tragfähige Themen (bei ~70–75 % kombinierter Quote) |
|---|---|---|---|
| Stress & Erholung | ~14.948 | 70–90 | ~50–65 |
| Schlafumgebung | ~2.335 | 50–65 | ~35–45 |

**Empfehlung: Beide Ringe öffnen, in dieser Reihenfolge — Stress & Erholung zuerst.**

1. **Stress & Erholung zuerst:** höhere und konsistentere Literaturdichte (Median ~6× höher als
   Schlafumgebung), inhaltliche Nähe zum bereits stark abgedeckten Kern-Cluster „HRV & Recovery"
   (91 % kombiniert tragfähig) — neue Themen wie „Cortisol und HRV-Erholung nach Belastung" oder
   „HRV-Biofeedback: Was zeigt die Studienlage" würden vermutlich direkt vom bestehenden
   `hrv-messung`- und `recovery-score-algorithmus`-Cluster mitprofitieren, ohne dass neue
   Cluster aufgebaut werden müssten. Geschätzter Beitrag: ~50–65 tragfähige Themen — allein
   reicht das voraussichtlich **nicht**, um die Lücke von 78 vollständig zu schließen.
2. **Schlafumgebung danach, falls nötig:** geringere, aber immer noch klar ausreichende
   Literaturdichte (Matratze, Raumklima, Lärm, Verdunkelung), zusätzlich mit natürlicher
   Kaufberatungs-Anschlussfähigkeit (Matratzen-/Kissen-Vergleiche). Geschätzter Beitrag: ~35–45
   weitere tragfähige Themen.
3. **Zusammen (~85–110 geschätzte neue tragfähige Themen)** würden die Lücke von 78 mit
   Puffer schließen — vorausgesetzt, die tatsächliche Themenerstellung für beide Ringe erreicht
   eine ähnliche Dichte wie der bestehende Kern. Das ist eine Schätzung, keine Messung: Erst
   nach dem Anlegen konkreter Themenlisten für beide Ringe (analog zu den Abschnitten A–F in
   `data/themeninventur.md`) liefern beide Check-Skripte echte Zahlen.

**Nächster konkreter Schritt:** `data/themeninventur.md` um einen neuen Abschnitt „Stress &
Erholung" ergänzen (Kandidatentitel sammeln, Geräte-/Mechanismus-Bezug wo möglich explizit im
Titel benennen, damit die clusterbasierte Zuordnung greift — z. B. „HRV" statt nur
„Erholung"), dann beide Check-Skripte erneut laufen lassen. Bei Bedarf danach „Schlafumgebung"
ergänzen.
