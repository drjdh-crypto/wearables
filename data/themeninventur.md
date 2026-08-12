# Themeninventur — Schlaf- & Recovery-Tracking

Ziel: mindestens 300 tragfähige Artikelthemen im Kern Schlaf- und Recovery-Tracking, sauber auf
die sechs Kategorien aus `src/content.config.ts` verteilt, damit jede Kategorie ausreichend
Tiefe bekommt statt nur an der Oberfläche zu kratzen.

Status wird pro Zeile als Checkbox geführt: `[ ]` = Idee/nicht begonnen, `[x]` = veröffentlicht.
Arbeitstitel sind vorläufig und werden beim Anlegen des Artikels final formuliert. Jeder Titel
braucht beim Ausformulieren mindestens eine Quelle gemäß `CLAUDE.md` Abschnitt 1, bevor er als
`draft: false` geht — die Aufnahme in diese Liste ist keine Freigabe, "tragfähig" heißt hier
"thematisch sinnvoll und plausibel belegbar", nicht "bereits mit Quelle geprüft".

## Methodik: Wie diese Liste entstanden ist (und wie sie weiterwächst)

Statt Themen zufällig zu sammeln, wurde ein kombinatorisches Raster genutzt, das sich auch für
Nachschub über die 300 hinaus wiederverwenden lässt:

1. **Geräte-Achse:** ~20 real am Markt relevante Geräte/Systeme (Oura, Whoop, Apple Watch,
   Garmin, Polar, Fitbit/Pixel Watch, Samsung, Withings, Eight Sleep, Emfit, Amazfit, Coros,
   Ultrahuman, Circul+, Muse S, Biostrap, RingConn, Movano, Sleep-Cycle-App, CPAP-Ökosysteme …)
   × wiederkehrende Artikeltypen (Genauigkeits-Deep-Dive, Vs.-Vergleich, Kaufberatungs-Slot)
   erzeugt automatisch nicht-redundante Themen, weil jedes Gerät eine eigene Studienlage hat.
2. **Metriken-Achse:** Jede zentrale Messgröße (Schlafstadien, HRV, SpO2, Atemfrequenz,
   Hauttemperatur, Recovery-Score) bekommt einen Grundlagen-, einen Genauigkeits- und einen
   Praxis-Artikel.
3. **Populations-/Lebensphasen-Achse:** Athlet:innen, Schwangere, Eltern/Kinder, Senior:innen,
   Schichtarbeitende, Menschen mit chronischen Erkrankungen — dieselbe Grundfrage
   ("Wie zuverlässig/sinnvoll ist Tracking für mich?") ergibt pro Gruppe einen eigenständigen,
   nicht redundanten Artikel.
4. **Kritik-Achse:** Zu jedem Hype-Claim (z. B. "97 % Genauigkeit", "erkennt Krankheit, bevor
   Symptome auftreten") existiert bewusst ein methodenkritischer Gegenpart — das erfüllt
   direkt die Persona-Vielfalt aus `CLAUDE.md` Abschnitt 3.
5. **Glossar-Achse:** Jeder Fachbegriff, der in obigen Artikeln vorausgesetzt wird, bekommt
   einen eigenen kurzen Glossareintrag (separate Content Collection `glossary`), der intern
   verlinkt wird — das erhöht die Themenzahl nicht künstlich (Glossar zählt separat), reduziert
   aber Wiederholungen in den Artikeln selbst.

**Weiterwachsen:** Neue Geräte-Generationen, neue Studien und neue Regulierungs-Entwicklungen
(z. B. EU-Medizinprodukterecht) speisen automatisch neue Zeilen in Achse 1–4. Vor dem Anlegen
eines neuen Themas: prüfen, ob es bereits eine sehr ähnliche Zeile gibt (Duplikatvermeidung),
und ob mindestens eine plausible Quellenart (peer-reviewed/Hersteller/institutionell) real
existiert — sonst gehört das Thema (noch) nicht auf die Liste.

## Verteilung nach Kategorie

| Kategorie | Cluster | Anzahl |
|---|---|---|
| `schlafphysiologie` | A — Grundlagen, Zirkadianik, Physiologie | 45 |
| `tracking-genauigkeit` | B — Sensorik, Validierungsmethodik, Geräte-Deep-Dives | 60 |
| `hrv-recovery` | C — HRV, Recovery-Scores, Trainingssteuerung | 45 |
| `geraete-vergleich` | D — Vs.-Vergleiche, Kaufberatung | 60 |
| `praxis-alltag` | E — Troubleshooting, Psychologie, Lebensphasen, Apps, Datenschutz | 65 |
| `methodik-limitationen` | F — Kritik, Bias, Grenzen | 30 |
| **Summe (Artikel)** | | **305** |
| `glossary` (separate Collection, bonus) | G — Fachbegriffe | ~40 |

---

## A. Schlafphysiologie (45) — `category: schlafphysiologie`

- [ ] Was passiert im Körper während der Tiefschlafphase?
- [ ] REM-Schlaf: Funktion, Dauer, warum Tracker ihn oft falsch erkennen
- [ ] Leichtschlaf vs. Tiefschlaf: Warum die Grenze fließend ist
- [ ] Schlafzyklen verstehen: Wie viele Zyklen pro Nacht sind normal?
- [ ] Der zirkadiane Rhythmus einfach erklärt
- [ ] Melatonin: Wirkung, Ausschüttung, Messbarkeit
- [ ] Kerntemperatur und Schlaf: Warum Wearables Hauttemperatur statt Körperkerntemperatur messen
- [ ] Schlafdruck (Adenosin) vs. zirkadianer Rhythmus: Das Zwei-Prozess-Modell
- [ ] Warum wir nachts aufwachen — normale Mikroarousals vs. Störung
- [ ] Wie viel Schlaf brauchen Erwachsene wirklich? Was die Evidenz sagt
- [ ] Schlafeffizienz: Definition, Berechnung, sinnvoller Zielwert
- [ ] Sleep Onset Latency: Warum die Einschlafzeit so schwer zu messen ist
- [ ] Was ist eine "normale" Schlafarchitektur nach Alter?
- [ ] Warum Frauen und Männer unterschiedliche Schlafmuster haben können
- [ ] Der Einfluss des Menstruationszyklus auf Schlafparameter
- [ ] Wechseljahre und Schlaf: Was sich verändert und was Tracker davon sehen
- [ ] Schlaf und Gedächtniskonsolidierung: Was Tiefschlaf wirklich leistet
- [ ] Träumen und REM-Schlaf: Zusammenhang und Missverständnisse
- [ ] Warum Schlafbedarf individuell und teils genetisch bestimmt ist
- [ ] Kurzschläfer-Gen (DEC2): Mythos oder Realität?
- [ ] Was ist Schlafschuld ("Sleep Debt") — und kann man sie wirklich nachholen?
- [ ] Power Napping: Optimale Dauer laut Forschung
- [ ] Warum ein "perfekter" Schlaf-Score nicht immer gesunden Schlaf bedeutet
- [ ] Atmung im Schlaf: Was normale Atemfrequenz-Schwankungen bedeuten
- [ ] Herzfrequenz im Schlaf: Warum sie nachts absinkt und was das aussagt
- [ ] Körpertemperaturkurve über die Nacht: Was sie über Schlafqualität verrät
- [ ] Bewegung im Schlaf: Wie viel ist normal, wann wird es zum Warnsignal?
- [ ] Schlafspindeln und K-Komplexe: Was EEG sieht, was Wearables nicht sehen
- [ ] Warum Schlaf nicht linear "besser" mit mehr Tiefschlaf wird
- [ ] Der Erste-Nacht-Effekt: Warum neue Umgebungen den Schlaf stören
- [ ] Sozialer Jetlag: Wenn Wochenend- und Wochentag-Rhythmus auseinanderdriften
- [ ] Licht am Abend und Melatoninsuppression: Was Studien zeigen
- [ ] Blaulichtfilter: Wirkt das wirklich auf den Schlaf?
- [ ] Koffein-Halbwertszeit und Schlaf: Wie lange wirkt ein Nachmittagskaffee nach?
- [ ] Alkohol und Schlafarchitektur: Warum die "Einschlafhilfe" den Tiefschlaf stört
- [ ] Sport am Abend: Fördert oder stört es den Schlaf?
- [ ] Schlaf und Blutzucker: Wechselwirkungen, die CGM-Nutzer:innen sehen
- [ ] Thermoregulation im Schlaf: Warum eine kühle Umgebung hilft
- [ ] Schichtarbeit und zirkadiane Fehlanpassung
- [ ] Jetlag: Wie schnell sich der Rhythmus wirklich anpasst
- [ ] Winterzeit/Sommerzeit-Umstellung: Messbare Effekte auf Schlafdaten
- [ ] Schlafapnoe verstehen: Was physiologisch passiert, was SpO2-Tracking zeigt
- [ ] Insomnie: Physiologische und psychologische Mechanismen
- [ ] Restless-Legs-Syndrom und Schlaftracking
- [ ] Schlaf im Alter: Warum sich Architektur und Bedarf verändern

## B. Tracking-Genauigkeit & Methodik (60) — `category: tracking-genauigkeit`

### Sensorik-Grundlagen
- [ ] Wie funktioniert PPG (photoplethysmographische) Pulsmessung am Handgelenk/Finger?
- [ ] EKG vs. PPG: Unterschiede in Genauigkeit und Einsatzzweck
- [ ] Wie erkennen Wearables Schlafstadien überhaupt? (Algorithmus-Grundlagen)
- [ ] Aktigraphie erklärt: Bewegung als Proxy für Schlaf/Wachzustand
- [ ] Was ist SpO2-Tracking und wie zuverlässig ist es am Handgelenk?
- [ ] Hauttemperatur-Sensoren: Was sie messen und was nicht
- [ ] Warum Hautton die Genauigkeit optischer Sensoren beeinflussen kann
- [ ] Abtastrate und Batterie: Der technische Kompromiss hinter "24/7 HRV"
- [ ] Kontaktlose Schlaftracker (Radar/Sonar): Wie Somnofy & Co. funktionieren
- [ ] Matratzensensoren (Withings, Emfit) vs. Wearables: Messprinzip im Vergleich
- [ ] Machine-Learning-Modelle in Schlaf-Apps: Black Box oder nachvollziehbar?
- [ ] Warum Firmware-Updates die "Genauigkeit" eines Geräts über Nacht verändern können
- [ ] Kalibrierung bei Wearables: Was Nutzer:innen selbst beeinflussen können
- [ ] Warum Bewegungsartefakte die häufigste Fehlerquelle bei Schlaftracking sind
- [ ] Sensordrift: Warum ältere Geräte ungenauer werden können

### Validierungsstudien-Methodik
- [ ] Wie liest man eine Wearable-Validierungsstudie richtig?
- [ ] Sensitivität vs. Spezifität: Was diese Kennzahlen bei Schlaftrackern bedeuten
- [ ] Epoch-by-Epoch-Vergleich: Der Standard für Schlafstadien-Validierung
- [ ] Warum PSG (Polysomnographie) der Goldstandard bleibt — und wo sie an Grenzen stößt
- [ ] Bland-Altman-Plots verstehen: Wie Genauigkeit statistisch dargestellt wird
- [ ] Warum kleine Stichproben (n<30) Validierungsstudien angreifbar machen
- [ ] Herstellerfinanzierte Studien: Wie man Interessenkonflikte erkennt
- [ ] Warum "klinisch validiert" nicht dasselbe ist wie "medizinisch zugelassen"
- [ ] FDA-Zulassung vs. CE-Kennzeichnung: Was Wearables tatsächlich dürfen
- [ ] Consumer-Wearable oder Medizinprodukt? Die regulatorische Grauzone
- [ ] Warum Labor- und Feldstudien (in-lab vs. at-home) unterschiedliche Ergebnisse liefern
- [ ] Wie oft werden Wearable-Algorithmen tatsächlich unabhängig nachgetestet?
- [ ] Meta-Analysen zu Consumer-Schlaftrackern: Was der Forschungsstand insgesamt zeigt
- [ ] Warum "Genauigkeit" je nach Schlafstadium stark variiert (Tiefschlaf schwerer als Gesamtschlafzeit)
- [ ] Reproduzierbarkeit: Warum dieselbe Person in zwei Nächten unterschiedliche Werte bekommt

### Geräte-Einzelvalidierungen (Deep-Dives)
- [ ] Oura Ring (Gen 3/4): Was Validierungsstudien zur Schlafstadien-Genauigkeit zeigen
- [ ] Whoop 4.0/5.0: Wie genau ist die Schlafstadien-Erkennung wirklich?
- [ ] Apple Watch Schlaftracking: Genauigkeit im Studienvergleich
- [ ] Garmin Schlaf-Tracking (Elevate-Sensor): Was Studien zur Genauigkeit sagen
- [ ] Fitbit/Google Pixel Watch: Genauigkeit der Schlafstadien im Test
- [ ] Samsung Galaxy Watch Schlaftracking: Validierungsstand
- [ ] Polar Nightly Recharge & Schlaftracking: Wie zuverlässig ist der Vantage/Ignite-Algorithmus?
- [ ] Withings Sleep Analyzer (Matte): Genauigkeit ohne Tragekomfort-Nachteil
- [ ] Ultrahuman Ring Air: Unabhängige Validierungsdaten im Überblick
- [ ] Eight Sleep Pod: Wie misst die Matratzenauflage Schlafstadien?
- [ ] Emfit QS: Ballistokardiographie-basiertes Tracking im Genauigkeitsvergleich
- [ ] Amazfit Schlaftracking: Was unabhängige Tests zeigen
- [ ] Coros Schlaf- und Recovery-Tracking: Genauigkeit für Ausdauersportler:innen
- [ ] RingConn und Movano Evie: Neue Ring-Anbieter im Genauigkeitscheck
- [ ] Biostrap: Wie unterscheidet sich der Ansatz von Ring/Uhr-Trackern?
- [ ] Circul+ (Ring mit kontinuierlichem SpO2): Genauigkeit bei Sauerstoffsättigung
- [ ] Muse S (EEG-Stirnband): Wie nah kommt konsumentennahes EEG an PSG heran?
- [ ] Sleep-Cycle-App (mikrofonbasiert): Wie zuverlässig ist Tracking ganz ohne Wearable?
- [ ] AutoSleep (Apple-Watch-Companion-App): Bringt die App mehr Genauigkeit als Apples Bordmittel?
- [ ] SpO2-Genauigkeit im Vergleich: Ring vs. Uhr vs. medizinisches Pulsoxymeter
- [ ] HRV nachts: Wie genau messen Consumer-Geräte im Vergleich zum EKG-Brustgurt?
- [ ] Atemfrequenz-Tracking im Schlaf: Genauigkeit verschiedener Gerätekategorien
- [ ] Warum CPAP-integrierte Schlafdaten oft genauer sind als externe Wearables
- [ ] Wie gut erkennen Wearables Schlafapnoe-Verdachtsfälle wirklich?
- [ ] EKG-Funktion in Uhren: Wie zuverlässig für Vorhofflimmern-Screening?
- [ ] Was leisten günstige Fitness-Tracker (<50 €) beim Schlaftracking wirklich?
- [ ] Brustgurt vs. Handgelenk vs. Ring: Wo sitzt der genaueste Pulssensor?
- [ ] Warum Genauigkeit bei dunkler Hautfarbe in manchen Studien schlechter ausfällt
- [ ] Wie verändert sich Trackinggenauigkeit bei Bewegungsstörungen (z. B. PLMD)?
- [ ] Unabhängige Testlabore für Wearables: Wer prüft eigentlich, was Hersteller behaupten?

## C. HRV & Recovery (45) — `category: hrv-recovery`

- [ ] Was ist Herzfrequenzvariabilität (HRV) eigentlich?
- [ ] RMSSD vs. SDNN: Welche HRV-Kennzahl nutzen welche Anbieter?
- [ ] Warum HRV-Werte zwischen Oura, Whoop und Garmin so unterschiedlich ausfallen
- [ ] Baseline-Denken: Warum absolute HRV-Werte wenig aussagen
- [ ] Wie stark schwankt HRV natürlicherweise von Tag zu Tag?
- [ ] Recovery-Score-Algorithmen im Vergleich: Was fließt wirklich ein?
- [ ] Whoop Recovery vs. Oura Readiness vs. Garmin Body Battery: Methodik im Vergleich
- [ ] Warum ein niedriger Recovery-Score nicht automatisch "Trainingspause" bedeutet
- [ ] HRV und Übertraining: Was die Sportwissenschaft wirklich zeigt
- [ ] Overreaching erkennen: Welche HRV-Muster sind Warnsignale?
- [ ] HRV-geführtes Training: Bringt es nachweislich bessere Ergebnisse als starre Pläne?
- [ ] Ruheherzfrequenz als Recovery-Indikator: Aussagekraft und Grenzen
- [ ] Warum HRV bei Frauen über den Zyklus systematisch schwankt
- [ ] Alkohol und HRV: Wie stark und wie lange ist der Effekt messbar?
- [ ] Krankheit erkennen, bevor Symptome auftreten: Was HRV-Abfälle wirklich vorhersagen können
- [ ] Atemübungen und HRV: Kurzfristige Biofeedback-Effekte vs. langfristige Trends
- [ ] Kälteexposition (Eisbad, kalte Dusche) und HRV: Was Studien zeigen
- [ ] Koffein und HRV: Messbarer Effekt oder Rauschen?
- [ ] Stress-Tracking über HRV: Wie zuverlässig erkennen Wearables mentalen Stress?
- [ ] Warum HRV-Trends aussagekräftiger sind als Tageswerte
- [ ] Trainingsbelastung (Load) vs. Recovery: Wie Wearables beides gegenrechnen
- [ ] Tapering vor Wettkämpfen: Wie Recovery-Daten die Planung unterstützen können
- [ ] HRV bei Ausdauersportler:innen vs. Kraftsportler:innen: Unterschiedliche Zielbereiche?
- [ ] Warum Altersnormwerte für HRV mit Vorsicht zu genießen sind
- [ ] Genetische Einflussfaktoren auf die individuelle HRV-Bandbreite
- [ ] Wearable-HRV vs. EKG-Brustgurt-HRV: Wann reicht welche Genauigkeit?
- [ ] Body-Battery-Konzept (Garmin) im Detail erklärt
- [ ] Was bedeutet ein "grüner", "gelber", "roter" Readiness-Score wirklich?
- [ ] HRV-gestützte Periodisierung im Ausdauersport: Praxisleitfaden
- [ ] Warum Reisen und Zeitzonenwechsel HRV-Daten verzerren
- [ ] Menstruationszyklus-Phasen und Trainingssteuerung über Recovery-Daten
- [ ] HRV in der Schwangerschaft: Was sich verändert und was Tracking zeigt
- [ ] Post-virale Recovery: Wie HRV-Daten nach Infekten den Wiedereinstieg begleiten können
- [ ] Übertrainingssyndrom: Diagnosekriterien vs. das, was ein Recovery-Score zeigt
- [ ] Warum ein "schlechter" Recovery-Score nach hartem Training normal ist
- [ ] HRV-Apps ohne Wearable (kamerabasiert am Smartphone): Wie genau sind sie?
- [ ] Elite HRV, Kubios & Co.: Spezial-Apps für HRV-Analyse im Vergleich zu Consumer-Wearables
- [ ] Wie beeinflusst Schlafmangel die HRV am Folgetag?
- [ ] Autonomes Nervensystem verstehen: Sympathikus/Parasympathikus einfach erklärt
- [ ] Warum manche Menschen dauerhaft niedrige HRV-Werte haben, ohne krank zu sein
- [ ] Recovery-Tracking für Kraftsport: Sinnvoll oder Overkill?
- [ ] Wearable-Daten und Return-to-Play nach Verletzungen im Leistungssport
- [ ] Warum Stimmung und subjektives Befinden oft schlechter mit HRV korrelieren als gedacht
- [ ] HRV-Coaching-Programme: Was steckt hinter automatisierten Trainingsempfehlungen?
- [ ] Grenzen von Recovery-Scores: Wann man ihnen bewusst nicht folgen sollte

## D. Gerätevergleiche & Kaufberatung (60) — `category: geraete-vergleich`

### Vs.-Vergleiche
- [ ] Oura Ring vs. Whoop: Welches Gerät für welchen Nutzertyp?
- [ ] Oura Ring vs. Ultrahuman Ring Air: Ring-Duell im Detailvergleich
- [ ] Whoop vs. Garmin: Recovery-Tracking im direkten Vergleich
- [ ] Apple Watch vs. Oura Ring: Alltagstauglichkeit vs. Spezialisierung
- [ ] Garmin vs. Polar: Welche Marke für Ausdauersportler:innen?
- [ ] Fitbit vs. Apple Watch: Schlaftracking im Vergleich
- [ ] Samsung Galaxy Watch vs. Apple Watch: Schlaf- und Recovery-Features
- [ ] Whoop 4.0 vs. Whoop 5.0/MG: Lohnt sich das Upgrade?
- [ ] Oura Gen3 vs. Gen4: Was hat sich wirklich verbessert?
- [ ] Ring vs. Uhr vs. Brustgurt: Formfaktor-Vergleich für Schlaftracking
- [ ] Withings Sleep Analyzer vs. Ring/Uhr: Matte gegen Wearable
- [ ] Eight Sleep vs. klassischer Wearable-Tracker: Aktive Kühlung vs. passives Tracking
- [ ] Garmin Venu vs. Garmin Forerunner: Welche Serie fürs Schlaftracking?
- [ ] Polar Vantage vs. Polar Ignite: Unterschiede im Recovery-Feature-Set
- [ ] Amazfit vs. Xiaomi Mi Band: Budget-Tracker im Vergleich
- [ ] Coros vs. Garmin: Recovery-Metriken für Ultra-Ausdauersportler:innen
- [ ] Ultrahuman vs. Circul+: Ring-Vergleich mit Fokus auf SpO2
- [ ] Muse S vs. klassische Wearables: EEG-Stirnband als Alternative?
- [ ] Sleep-Cycle-App vs. Wearable-Tracking: Reicht das Smartphone-Mikrofon?
- [ ] Emfit QS vs. Withings Sleep Analyzer: Kontaktlose Systeme im Vergleich
- [ ] RingConn vs. Oura: Günstige Alternative oder echte Konkurrenz?
- [ ] Movano Evie vs. Oura: Ring-Tracking mit Fokus auf Frauengesundheit
- [ ] Google Pixel Watch vs. Fitbit-Geräte seit der Google-Übernahme
- [ ] Biostrap vs. Whoop: Unterschiedliche Zielgruppen im Vergleich
- [ ] Garmin Body Battery vs. Whoop Recovery vs. Oura Readiness: Methodik-Vergleich
- [ ] CPAP-Tracking-Apps (ResMed myAir, Philips DreamMapper) vs. externe Wearables
- [ ] Kostenloses Schlaftagebuch vs. Premium-Wearable: Was bringt der Umstieg wirklich?
- [ ] Whoop-Abo vs. Kaufgerät: Geschäftsmodelle im Vergleich
- [ ] Oura vs. Apple Watch Ultra für Trailrunning und Schlaf zugleich
- [ ] Garmin Instinct vs. Fenix: Recovery-Features je Preisklasse

### Kaufberatung & Best-of
- [ ] Bester Schlaftracker 2026: Übersicht nach Nutzertyp
- [ ] Bester Schlaftracker für Ausdauersportler:innen
- [ ] Bester Schlaftracker für Kraftsportler:innen
- [ ] Bester Schlaftracker unter 100 Euro
- [ ] Bester Schlaftracker ohne Abo-Zwang
- [ ] Bester Ring-Tracker im Vergleich
- [ ] Beste Smartwatch mit Schlaftracking für Alltagsnutzer:innen
- [ ] Bester Schlaftracker für Schichtarbeiter:innen
- [ ] Bester Schlaftracker für Schwangere
- [ ] Bester Schlaftracker für Menschen mit Schlafapnoe-Verdacht
- [ ] Beste kontaktlose Schlaftracking-Lösung (ohne Wearable am Körper)
- [ ] Bester Schlaftracker für Senior:innen
- [ ] Bester Schlaftracker für Teenager/junge Erwachsene
- [ ] Bester wasserdichter Schlaftracker für Schwimmer:innen
- [ ] Bester Schlaftracker mit langer Akkulaufzeit
- [ ] Bester Schlaftracker für CPAP-Nutzer:innen (Formfaktor-Frage)
- [ ] Beste App zur Schlafanalyse ganz ohne Wearable
- [ ] Bester Recovery-Tracker für HYROX/Functional Fitness
- [ ] Bester Schlaftracker für Reisende/Vielflieger:innen (Jetlag-Tracking)
- [ ] Bester günstiger Einstieg ins Schlaftracking unter 50 Euro
- [ ] Bester Schlaftracker mit Smart-Alarm-Funktion
- [ ] Bester Schlaftracker für Paare (getrennte Auswertung im Doppelbett)
- [ ] Bester Schlaftracker mit Raumklima-Sensor (Licht, Lärm, Temperatur)
- [ ] Bester Schlaftracker mit medizinisch anmutenden Zusatzfeatures (EKG, SpO2-Alarm)
- [ ] Bester Schlaftracker für Kinder (mit Datenschutz-Einordnung)
- [ ] Bester minimalistischer Tracker ohne Smartwatch-Funktionen
- [ ] Bester Schlaftracker mit langfristiger Trendanalyse (Jahresverlauf)
- [ ] Kaufberatung: Lohnt sich ein Wechsel vom Fitness-Tracker zum Spezial-Schlaftracker?
- [ ] Kaufberatung: Wann reicht die Smartphone-App statt Hardware?
- [ ] Wearable-Refurbished/Gebrauchtmarkt: Worauf beim Gebrauchtkauf achten?

## E. Praxis & Alltag (65) — `category: praxis-alltag`

### Troubleshooting & Dateninterpretation
- [ ] Warum zeigt mein Tracker plötzlich viel weniger Tiefschlaf an?
- [ ] Warum unterscheiden sich die Werte von zwei Geräten in derselben Nacht so stark?
- [ ] Tracker erkennt Einschlafzeit falsch: Ursachen und Abhilfe
- [ ] Warum "0 % Tiefschlaf"-Nächte meist ein Messfehler sind, kein Alarmsignal
- [ ] Wie interpretiere ich einen dauerhaft niedrigen Schlaf-Score richtig?
- [ ] Warum mein Recovery-Score trotz gutem Gefühl niedrig ist — und umgekehrt
- [ ] Akku leer über Nacht: Wie Datenlücken die Trendanalyse verfälschen
- [ ] Warum Nickerchen die Nachtschlaf-Statistik verzerren können
- [ ] Tracker im Flugzeug/Zeitzonenwechsel: Warum die App durcheinanderkommt
- [ ] Wie exportiere und sichere ich meine eigenen Schlafdaten? (anbieterübergreifend)
- [ ] Warum Firmware-Updates rückwirkend alte Nächte neu bewerten können
- [ ] Sync-Probleme zwischen Wearable und App: Häufige Ursachen
- [ ] Warum Ringe bei kalten Händen ungenauer messen
- [ ] Warum ein zu lockeres/zu enges Armband die Messqualität beeinflusst
- [ ] Wie lese ich meinen persönlichen HRV-Trend richtig, statt Tageswerte zu überinterpretieren
- [ ] Warum Alkohol am Vorabend am nächsten Morgen die Werte "einbrechen" lässt
- [ ] Wie verändert ein Haustier im Bett die Trackinggenauigkeit?
- [ ] Warum Paare im selben Bett gegenseitig ihre Bewegungsdaten verfälschen können
- [ ] Tracker zeigt "wach" trotz Schlaf: Häufige Fehlklassifikation und Ursachen
- [ ] Wie oft sollte man Sensoren/Ring/Uhr reinigen, damit die Messung stabil bleibt?

### Psychologie des Trackings
- [ ] Orthosomnie: Wenn die Jagd nach dem perfekten Schlaf-Score selbst zum Problem wird
- [ ] Warum ein täglicher Blick auf den Score Angst statt Beruhigung auslösen kann
- [ ] Digital Detox vom eigenen Schlaftracker: Wann eine Pause sinnvoll ist
- [ ] Placebo- und Nocebo-Effekte durch Schlaf-Scores
- [ ] Wie Schlaf-Scores das subjektive Schlafempfinden verzerren können
- [ ] Warum ein "schlechter" Score nicht automatisch schlechten Schlaf bedeutet
- [ ] Tracking als Beruhigung bei Insomnie: Hilfreich oder kontraproduktiv?
- [ ] Wie man Schlafdaten nutzt, ohne in Kontrollzwang zu verfallen
- [ ] Gamification von Schlaf: Motivierend oder Druck erzeugend?
- [ ] Wie Therapeut:innen Wearable-Daten in der Schlaftherapie sinnvoll einsetzen (oder bewusst weglassen)

### Spezialgruppen & Lebensphasen im Alltag
- [ ] Schlaftracking in der Schwangerschaft: Was sich in den Daten typischerweise verändert
- [ ] Schlaftracking im Wochenbett: Realistische Erwartungen an Datenqualität
- [ ] Baby-Schlaftracker: Was sie leisten und wo die Grenzen liegen
- [ ] Schlaftracking bei Kindern: Ab welchem Alter sinnvoll, was ist Spielerei?
- [ ] Schlaftracking für Senior:innen: Sturzsensoren, Nachtaufwachen, Besonderheiten
- [ ] Schichtarbeit: Wie Trackingdaten bei Tagschlaf anders interpretiert werden müssen
- [ ] Schlaftracking auf Reisen: Praktische Tipps gegen Jetlag mit Datenunterstützung
- [ ] Schlaftracking im Homeoffice: Nickerchen, unregelmäßige Zeiten, was die Daten zeigen
- [ ] Schlaftracking während Diäten/Kalorienrestriktion: Bekannte Wechselwirkungen
- [ ] Schlaftracking bei Menschen mit ADHS: Besonderheiten und Grenzen
- [ ] Schlaftracking bei Depression/Angststörungen: Chancen und Risiken
- [ ] Wearables und Wechseljahresbeschwerden: Was Hitzewallungen in den Daten zeigen
- [ ] Schlaftracking für Vegetarier:innen/Veganer:innen: Ernährungsbedingte Unterschiede in HRV/Schlaf?
- [ ] Studierende und unregelmäßiger Schlaf: Was Trackingdaten über Prüfungsphasen zeigen
- [ ] Schlaftracking im Pflegeberuf/Schichtdienst: Besondere Herausforderungen

### Apps & Software-Ökosystem
- [ ] Sleep as Android: Funktionsumfang und Einordnung
- [ ] SnoreLab & Co.: Schnarch-Tracking-Apps im Überblick
- [ ] Wie offene Schnittstellen (Apple Health, Google Fit) Trackerdaten bündeln
- [ ] Warum Datenexport zwischen Anbietern oft schwieriger ist, als er sein sollte
- [ ] Drittanbieter-Dashboards (z. B. für Oura/Whoop-Daten): Sinnvoll oder Datenschutzrisiko?
- [ ] Automatisierungen mit Schlafdaten (z. B. Smart-Home-Wecklicht per API)
- [ ] Wie KI-gestützte Coaching-Features in Apps tatsächlich funktionieren
- [ ] Warum manche Apps Schlafdaten mit Kalender/Wetter/Zyklus-Apps verknüpfen — und was das bringt
- [ ] Kostenlose vs. Premium-Tier-Features gängiger Schlaf-Apps im Überblick
- [ ] Wie verlässlich sind Community-/Crowd-Vergleichswerte in Schlaf-Apps?

### Datenschutz & Recht
- [ ] Was passiert mit meinen Schlafdaten? Ein Blick in die Datenschutzerklärungen großer Anbieter
- [ ] Sind Schlafdaten "Gesundheitsdaten" im Sinne der DSGVO?
- [ ] Wie lange speichern Hersteller Schlaf- und HRV-Daten — und wo?
- [ ] Was bedeutet die Übernahme eines Anbieters (z. B. Fitbit → Google) für die eigenen Daten?
- [ ] Können Krankenversicherungen Zugriff auf Wearable-Daten verlangen?
- [ ] Wearable-Daten vor Gericht: Wurden Schlafdaten schon als Beweismittel genutzt?
- [ ] Kinder-Schlaftracker und Datenschutz: Worauf Eltern achten sollten
- [ ] Wie man Schlafdaten dauerhaft löschen lässt (anbieterübergreifende Anleitung)
- [ ] Cloud- vs. lokale Speicherung von Schlafdaten: Was bieten die Hersteller wirklich?
- [ ] Medizinprodukt-Zulassung einfach erklärt: Was "FDA-cleared" bei einer Smartwatch bedeutet

## F. Methodik-Kritik & Limitationen (30) — `category: methodik-limitationen`

- [ ] Warum kein Consumer-Wearable eine Schlafapnoe-Diagnose ersetzen kann
- [ ] Die Grenzen der Schlafstadien-Erkennung ohne EEG
- [ ] Warum "97 % Genauigkeit" in Herstellerangaben oft irreführend ist
- [ ] Confirmation Bias beim Interpretieren eigener Trackingdaten
- [ ] Warum ein einzelner schlechter Score-Tag statistisch kaum Aussagekraft hat
- [ ] Der Unterschied zwischen Korrelation und Kausalität in Wearable-Marketing
- [ ] Warum Alterseffekte in Normwerten oft auf zu kleinen Stichproben beruhen
- [ ] Wie Hersteller "wissenschaftlich validiert" nutzen, ohne die Studie offenzulegen
- [ ] Warum proprietäre Algorithmen die unabhängige Überprüfung erschweren
- [ ] Publikationsbias: Warum überwiegend positive Wearable-Studien veröffentlicht werden
- [ ] Warum manche Wearable-Studien vom Hersteller selbst durchgeführt werden — und was das für die Aussagekraft bedeutet
- [ ] Der Mythos "80 % Genauigkeit bei Schlafstadien" — was diese Zahl wirklich (nicht) bedeutet
- [ ] Warum Recovery-Scores keine medizinischen Biomarker sind
- [ ] Warum sich Wearable-Algorithmen über Softwareupdates ändern, ohne dass Nutzer:innen es merken
- [ ] Warum internationale Studienpopulationen nicht 1:1 auf jede Nutzergruppe übertragbar sind
- [ ] Die Grenzen von Aktigraphie bei der Erkennung von "wach, aber bewegungslos"
- [ ] Warum Schlaf-Scores zwischen Herstellern nicht direkt vergleichbar sind (unterschiedliche Formeln)
- [ ] Survivorship Bias in Erfahrungsberichten zu Wearables
- [ ] Warum manche vielzitierten Wearable-Studien nie repliziert wurden
- [ ] Die Rolle von Marketing-Sprache ("klinisch getestet") vs. tatsächlicher Evidenzlage
- [ ] Warum ein hoher Preis nicht automatisch höhere Messgenauigkeit bedeutet
- [ ] Grenzen der SpO2-Messung am Handgelenk bei Bewegung
- [ ] Warum manche gesundheitlichen "Trends" in Wearable-Apps reines Rauschen sind
- [ ] Die Debatte um Wearables als Frühwarnsystem für Infekte: Wie belastbar ist die Evidenz wirklich?
- [ ] Warum unabhängige Studien oft Jahre nach Produkteinführung erst erscheinen
- [ ] Wie Algorithmus-Änderungen rückwirkende Vergleiche über Jahre unmöglich machen
- [ ] Warum "mehr Daten" nicht automatisch "bessere Entscheidungen" bedeutet
- [ ] Die Grenzen von Recovery-Scores bei psychischer statt körperlicher Belastung
- [ ] Warum Studienteilnehmer:innen in Wearable-Validierungen oft jung und gesund sind — ein Selektionsproblem
- [ ] Regression-zur-Mitte-Effekt: Warum extreme Score-Tage oft von selbst "besser" werden

## G. Glossar (Bonus, separate Content Collection `glossary`, ~40 Begriffe)

HRV, RMSSD, SDNN, REM-Schlaf, Tiefschlaf, Leichtschlaf, Schlafeffizienz, Sleep Onset Latency,
Zirkadianer Rhythmus, Chronotyp, Melatonin, Adenosin, Zwei-Prozess-Modell des Schlafs, PPG, EKG,
SpO2, Aktigraphie, Polysomnographie (PSG), Bland-Altman-Plot, Sensitivität/Spezifität, Epoch,
Ballistokardiographie, Recovery Score, Readiness Score, Body Battery, Sleep Debt, Sozialer
Jetlag, Orthosomnie, Übertrainingssyndrom, Autonomes Nervensystem, Sympathikus, Parasympathikus,
Schlafspindel, K-Komplex, Mikroarousal, Schlafapnoe, Restless-Legs-Syndrom, CPAP, Wearable
(Begriffsabgrenzung zu Fitness-/Schlaftracker), Medizinprodukt (regulatorischer Begriff),
Gesundheitsdaten im Sinne der DSGVO.

---

## Nächste Schritte

1. Cluster A–F priorisieren (z. B. zuerst B + F, weil sie das evidenzbasierte Profil der Seite
   am stärksten prägen) und je 8–10 Themen für die erste Redaktionsrunde auswählen.
2. Pro ausgewähltem Thema vor dem Schreiben mindestens eine reale, prüfbare Quelle (DOI/Link)
   suchen — Themen ohne auffindbare Quelle zurückstellen oder umformulieren.
3. Persona(s) je Thema zuordnen (siehe `/personas`), besonders in Cluster F und E bewusst
   gegensätzliche Perspektiven einplanen, wo die Evidenzlage das hergibt.
4. Fortschritt in dieser Datei über die Checkboxen pflegen, bis eine Redaktionsplanung (z. B.
   in `/agents`) das übernimmt.
