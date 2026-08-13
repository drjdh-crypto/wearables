# Projektregeln — Schlaf- & Recovery-Tracking (Nischenseite)

Evidenzbasierte Nischenseite rund um Schlaf- und Recovery-Tracking (Wearables, Schlaf-Apps,
Trainingssteuerung über HRV/Recovery-Scores). Tech-Stack: Astro (Content Collections, i18n),
Deployment später via Cloudflare Pages. Diese Datei ist verbindlich für jede inhaltliche
Arbeit an diesem Repo — bei Widerspruch zwischen "schnell fertig" und diesen Regeln gelten
die Regeln.

## 1. Markenpositionierung

**"Studienlage statt Marketing."** Das ist die einzige Markenbotschaft. Die Seite grenzt sich
von Hersteller-Marketing und Hype ab, indem sie zeigt, was Studien tatsächlich hergeben —
nicht mehr und nicht weniger.

Das Thema KI/Halluzination wird **nicht** als Markenbotschaft kommuniziert. Es gibt keine
Aussagen wie "unsere KI halluziniert nicht" oder "garantiert faktentreu durch KI" — solche
Formulierungen wären selbst eine Marketing-Übertreibung und würden der Kernbotschaft
widersprechen. KI-Einsatz wird sachlich, knapp und ohne Werbewert offengelegt (siehe
Abschnitt 4), aber nie als Verkaufsargument benutzt.

## 2. Grundprinzip: Evidenzpflicht

Jede inhaltliche Behauptung mit Sachbezug (physiologische Wirkung, Studienergebnis,
Genauigkeitsangabe eines Sensors, Gesundheitsaussage, Vergleichsaussage "X ist genauer als Y")
**muss** eine Quelle im Frontmatter des jeweiligen Artikels haben, identifiziert über **DOI
oder PubMed-ID**. Keine unbelegten Gesundheits- oder Wirksamkeitsaussagen im Fließtext — auch
nicht als "Expertenmeinung", außer sie ist explizit als Meinung einer
[Persona](#5-ki-personas) gekennzeichnet und macht keine überprüfbare Faktenbehauptung.

- Bevorzugt: Peer-reviewte Studien mit DOI oder PubMed-ID (PMID).
- Zulässig ohne DOI/PMID: Herstellerdokumentation/Whitepaper (klar als solche kennzeichnen),
  offizielle Gesundheitsinstitutionen (z. B. AASM, WHO, RKI), Preprints (als Preprint
  kennzeichnen, nicht als peer-reviewed ausgeben).
- Nicht zulässig als alleinige Quelle: andere Blogartikel, Marketingseiten, Foren, "Studien
  zeigen…" ohne konkrete Angabe.
- Ein Artikel ohne mindestens einen Eintrag in `quellen` im Frontmatter gilt als **nicht
  publikationsreif**, sobald er eine Sachbehauptung enthält. Details zum Frontmatter-Schema
  (Feldnamen `quellen`, `doi`, `pubmed_id`, `studientyp` …) stehen im Artikel-Template unter
  `/content/README.md`.

### Sprache: Inhalt statt Prozess

Der Fließtext beschreibt, **was die Wissenschaft zeigt** — nicht, wie wir recherchiert haben.
Formulierungen wie „hinter einer Bezahlschranke", „nicht extrahierbar", „diese Recherche
stützt sich auf …", „die Quellenlage gibt das nicht her" gehören **nicht** in den Artikeltext,
auch wenn sie wahr sind. Sie beschreiben unseren Rechercheprozess, nicht die Sache selbst, und
sind für Lesende ohne Mehrwert bis irreführend (klingt nach Ausrede statt nach Wissensstand).

- Ist ein wissenschaftlicher Sachverhalt ungeklärt, wird das **inhaltlich** formuliert: „Wie
  stark X wirkt, ist nicht abschließend geklärt." statt „Wir konnten das mit den verfügbaren
  Quellen nicht klären." Der Unterschied: Der erste Satz macht eine Aussage über den
  Wissensstand, der zweite über unsere Recherche.
- Prozessdetails — warum eine bestimmte Quelle statt einer anderen gewählt wurde,
  Zugriffsprobleme (Bezahlschranke, nicht extrahierbare Tabellen), einzelne
  Verifikationsschritte, Unsicherheiten bei der Quellenauswahl — gehören ins **Review-Protokoll**
  (`offenePunkte` im Frontmatter, sichtbar im mobilen Review-Block, nie auf der öffentlichen
  Artikelseite), nicht in den Fließtext.
- Diese Regel gilt für Artikeltext (auch Persona-Meinungen, siehe Abschnitt 5), nicht für
  interne Dokumentation wie `docs/`, `agents/`, Commit-Nachrichten oder `offenePunkte` selbst —
  dort ist Prozesssprache erwartet und richtig.

### Praxis-Fazit

Jeder Artikel mit praktischer Relevanz bekommt **eine** Praxis-Fazit-Box am Artikelende: „Was
heißt das für die Praxis?" mit 2–4 Punkten, die die wichtigsten Konsequenzen aus dem
**Gesamttext** zusammenfassen — nicht ein Kästchen pro Quelle und nicht über den Artikel
verteilt. Feld `praxisfazit` (Liste, 2–4 Einträge) im Artikel-Frontmatter (siehe
`/content/README.md`), gerendert über die `PraxisFazit`-Komponente.

- **Alltagssprache, kein Fachjargon.** Begriffe wie „Sensitivität", „Macro-F1", „WASO" oder
  „Polysomnographie" gehören in den Fließtext (dort mit Erklärung beim ersten Vorkommen), nicht
  in die Praxis-Fazit-Box — dort werden sie umschrieben oder weggelassen („wie zuverlässig ein
  Gerät Schlafphasen erkennt" statt „Sensitivität bei der Schlafphasen-Klassifikation").
- Jeder Punkt **muss aus den im Artikel zitierten Quellen folgen** — keine allgemeine
  Ratgeberweisheit, die auch ohne die zitierten Studien stimmen würde. Test: Ließe sich der
  Punkt genauso in einem Artikel ohne diese Quellen schreiben? Wenn ja, ist er zu allgemein.
- Nicht jeder Artikel braucht eine Praxis-Fazit-Box — rein definitorische Artikel (z. B.
  Glossareinträge) meist nicht.

### Diagramme

**Mobil zuerst.** Diagramme müssen auf einem schmalen Handydisplay ohne Zoom lesbar sein —
das ist die Standard-Ansicht, nicht der Sonderfall. Kompakte Höhe statt breites Querformat,
wenige Datenpunkte (im Zweifel mehrere kleine Diagramme statt eines großen mit vielen
Kategorien), direkte Beschriftung an den Datenpunkten statt einer separaten Legende, keine
Achse, die keine eigene Aussage trägt (z. B. keine y-Achsen-Beschriftung „Wert" ohne Einheit).

**Diagrammtyp muss zur Aussage passen**, nicht umgekehrt:

- Anteile einer Gesamtheit (z. B. Schlafphasen-Verteilung einer Nacht) → gestapeltes/
  proportionales Diagramm, nicht mehrere separate Balken, die die Lesenden selbst zu 100%
  addieren müssten.
- Spannweiten/Streuung über mehrere Geräte oder Studien (z. B. Genauigkeit schwankt je nach
  Gerät zwischen X und Y, oder eine Meta-Analyse berichtet einen gepoolten Effekt mit
  Konfidenzintervall) → boxplot-artiges Spannweiten-Diagramm: Spannweite als Balken, Median/
  Mittelwert als eigene Markierung (Raute) **nur, wenn die Quelle diesen Wert selbst berichtet**
  — den Mittelpunkt der Spannweite zu erfinden, wenn nur ein Minimum/Maximum vorliegt, ist eine
  unbelegte Behauptung, keine Darstellung. Diese Darstellung überall dort einsetzen, wo mehrere
  Geräte/Studien verglichen werden — sie zeigt die Streuung, die oft der eigentliche Punkt ist.
- Abweichung von einer Referenz (z. B. Tracker misst X Minuten weniger als Polysomnographie) →
  Diagramm mit sichtbarer Nulllinie/Referenzlinie, nicht ein Balken, der bei 0 beginnt und die
  Abweichung dadurch verschleiert.
- Echte Entwicklung über eine geordnete/kontinuierliche Achse (Zeit, Alter) → Liniendiagramm —
  nur verwenden, wenn tatsächlich durchgehende, aus der Quelle rekonstruierbare Werte entlang
  dieser Achse vorliegen, nicht für zwei, drei Stützpunkte.
- **Kein Diagramm für Einzelwerte.** Ein Diagramm wird nur gebaut, wenn es mehrere Datenpunkte,
  eine echte Streuung oder einen Vergleich zeigt — eine einzelne Zahl ohne Streuung (z. B. "die
  Gesamtschlafzeit war im Mittel 17 Minuten kürzer", ohne Konfidenzintervall/Spannweite) bleibt
  im Fließtext. Kein Balken für einen einzelnen Punktwert, auch nicht als Hero-Chart.
- Kein Diagramm ohne eigenen analytischen Punkt — ein Diagramm, das nur illustriert, was der
  Satz daneben schon sagt, ohne zusätzliche Information (Bandbreite, Vergleich, Struktur) zu
  liefern, wird weggelassen.

**Kleine, eingebettete Diagramme sind besser als ein großes.** An jeder Stelle im Artikel, an
der eine Zahl im Fließtext auftaucht, prüfen: Zeigt eine kleine Inline-Visualisierung direkt an
dieser Textstelle den Punkt besser als der reine Zahlensatz? Wenn ja, dort einbetten — nicht
alle Diagramme in einen einzigen Hero-Chart am Artikelanfang packen.

Abbildungen/Diagramme aus Studien werden **nie kopiert** (Urheberrecht, aber auch redaktionelle
Kontrolle über Darstellung) — sie werden aus den zugrunde liegenden Werten **neu erzeugt**.
Jede solche Grafik bekommt eine Bildunterschrift der Form:

> Datenquelle: Nachname et al. (Jahr), DOI/PMID — eigene Darstellung.

Wenn die Rohwerte aus der Studie nicht rekonstruierbar sind, wird keine Grafik erstellt,
sondern die Kernzahl im Fließtext mit Kurzbeleg genannt. Die Quellenangabe (Bildunterschrift)
bleibt bei jedem Diagramm immer sichtbar, auch bei kleinen Inline-Diagrammen.

## 3. Zitierformat

**Im Fließtext:** Kurzbeleg nach APA-Stil, verlinkt auf den Quellenverzeichnis-Eintrag:
`(Altini et al., 2023)`. Bei direkter Zahlen-/Ergebnisangabe die Zahl selbst verlinken, nicht
nur den Satz.

**Im Quellenverzeichnis am Artikelende** (automatisch aus `quellen` im Frontmatter gerendert
über die `SourcesBox`-Komponente, nicht manuell im Body pflegen), Format:

```
Altini, M. et al. (2023). Sleep stage classification via accelerometer and photoplethysmography
sensors. Sensors, 23(13), 5778. DOI: 10.3390/s23135778
```

Herstellerquellen und institutionelle Quellen werden im selben Verzeichnis geführt, aber mit
Zusatzlabel `[Herstellerangabe]` bzw. `[Institutionell]` statt Journal/Band/Heft.

## 4. KI-Kennzeichnung (rechtliche Transparenzpflicht)

Alle KI-generierten oder KI-unterstützt erstellten Texte werden gekennzeichnet — das ist eine
rechtliche Transparenzpflicht (u. a. EU AI Act, Transparenzpflichten für KI-generierte
Inhalte), keine Marketingaussage (siehe Abschnitt 1).

- Der Hinweis steht **dezent am Artikelende**, nicht prominent, nicht als Banner über dem
  Artikel, nicht in der Überschrift. Ein kurzer Satz in kleiner Schrift reicht, z. B.:
  „Dieser Text wurde mit KI-Unterstützung erstellt und redaktionell nach den Regeln in
  CLAUDE.md geprüft."
- Die Kennzeichnung einzelner Personas als KI-Perspektiven (Abschnitt 5) ersetzt diesen
  allgemeinen Hinweis nicht — beides existiert nebeneinander: die Persona-Box sagt, *wer*
  spricht, der Artikel-Fußhinweis sagt, *dass* der Text KI-generiert ist.
- Kein Alarmismus und keine Dramatisierung ("Achtung, KI-Text!") — sachlich und knapp.

## 5. KI-Personas

Es gibt 10 feste Charaktere (definiert in `/personas`), die offen als KI-Perspektiven
gekennzeichnet sind und in Meinungs-/Erfahrungsboxen auftreten. Regeln:

1. **Kennzeichnungspflicht:** Jede Persona ist im Frontmatter UND sichtbar im Artikel
   (Meinungsblock) als KI-Perspektive ausgewiesen — kein Vortäuschen einer realen Person.
   Format in der Anzeige: „KI-Perspektive: [Name]".
2. **Dürfen widersprechen und kritisch sein, müssen aber nicht:** Zwei Personas können zum
   selben Thema unterschiedliche Einschätzungen abgeben, das ist erwünscht, wenn es der
   Evidenzlage bzw. unterschiedlichen Prioritäten entspricht. Widerspruch darf nicht künstlich
   erzwungen werden, wenn die Evidenz eindeutig ist — kein "Both-Sideism" bei klar belegten
   Fakten. Persona-Meinungen dürfen nie Abschnitt 2 (Evidenzpflicht) unterlaufen: Meinung ≠
   Freibrief für unbelegte Faktenbehauptungen.
3. **Quality-Gate-Personas:** Ein Teil der Personas trägt `quality_gate: true` in der eigenen
   Definition (z. B. die Schlafforscherin für Studienqualität, der Somnologe für medizinische
   Unbedenklichkeit, der Sportwissenschaftler für praktische Plausibilität, der Einsteiger für
   Verständlichkeit). Ein Artikel, der ihren jeweiligen Prüfbereich berührt, sollte inhaltlich
   so stehen, dass diese Persona ihm nicht widersprechen müsste, ohne dass ihr Widerspruch
   erzwungen oder unterdrückt wird — das Quality-Gate ist ein Prüf-Framing, keine Zensur der
   übrigen, nicht-quality-gate-tragenden Personas.
4. Persona-Definitionen leben in `/personas/<slug>.md`, siehe README dort — inklusive
   Stimmfassungen je Sprache (de, en; es als vorbereiteter Platzhalter, siehe Abschnitt 7).

## 6. Affiliate-Links & Werbekennzeichnung

- Jeder Affiliate-/Partnerlink wird unmittelbar am Link oder im ihn umgebenden Absatz als
  Werbung gekennzeichnet, z. B. `[Oura Ring 4 ansehen*](...)` mit Fußnote „*Affiliate-Link —
  wir erhalten ggf. eine Provision, ohne Mehrkosten für dich" oder ein sichtbares
  „Werbung"/„Anzeige"-Label direkt am Link (siehe `ProductBox`-Komponente). Kein Verstecken in
  Buttons ohne Label, kein generisches „Disclosure" nur am Artikelanfang, wenn der Link erst
  weit unten folgt.
- Enthält ein Artikel mindestens einen Affiliate-Link, MUSS `affiliate: true` im Frontmatter
  gesetzt sein — das steuert den globalen Hinweisbanner der Seite.
- Affiliate-Links sind regionsabhängig (siehe `/data/products.json` und Abschnitt 8) — die
  Werbekennzeichnung gilt unabhängig davon, welche Region gerade angezeigt wird.
- Produktempfehlungen/Vergleiche mit Affiliate-Bezug müssen weiterhin Abschnitt 2 erfüllen:
  Genauigkeits-/Wirksamkeitsaussagen brauchen Quellen, unabhängig von der Kommerzialisierung.
- Keine Sponsored-Artikel ohne redaktionelle Kennzeichnung; Trennung von Redaktion und Werbung
  bleibt jederzeit erkennbar (Trennungsgebot, § 5a UWG / § 22 MStV als Richtschnur).

## 7. Internationalisierung

- Aktive Sprachen: Deutsch (`de`, Standard) und Englisch (`en`). Spanisch (`es`) ist
  vollständig vorbereitet (Übersetzungsdateien, Persona-Stimmfassungen), aber über
  `src/i18n/config.ts` deaktiviert, bis redaktionell entschieden wird, live zu gehen.
- Keine hartkodierten UI-Strings — alle Texte laufen über Übersetzungsschlüssel in
  `/src/i18n/`.
- Sprachumschalter (UI-Sprache) und Regionsumschalter (für Affiliate-Links) sind zwei
  getrennte Einstellungen, beide in `localStorage`, nie vermischt. Die Sprache wird beim
  ersten Besuch aus der Browser-Sprache vorbelegt — keine IP-Geolokalisierung.

## 8. Tech-Stack & Deployment

- **Framework:** Astro, Content Collections für Artikel/Personas/Produkte
  (`src/content.config.ts`), Zod-Schema erzwingt das Frontmatter aus Abschnitt 2 (inkl.
  `quellen`, `affiliate`).
- **Deployment:** später Cloudflare Pages (statischer Build via `astro build` → `dist/`).
  Bis dahin nur lokale Entwicklung; keine Deployment-spezifischen Annahmen (z. B. Cloudflare
  Functions/KV) fest einbauen, ohne das explizit zu besprechen.
- **Dev-Server im Hintergrund starten:**
  ```
  astro dev --background
  ```
  Verwaltung über `astro dev stop`, `astro dev status`, `astro dev logs`.
- Weiterführende Doku vor verwandten Aufgaben konsultieren:
  - [Routing](https://docs.astro.build/en/guides/routing/)
  - [Internationalisierung](https://docs.astro.build/en/guides/internationalization/)
  - [Astro-Komponenten](https://docs.astro.build/en/basics/astro-components/)
  - [Content Collections](https://docs.astro.build/en/guides/content-collections/)
  - [Styling](https://docs.astro.build/en/guides/styling/)

## 9. Ordnerstruktur

| Ordner       | Zweck |
|--------------|-------|
| `/content`   | Redaktionelle Inhalte (Artikel, Vergleiche, Glossar) — siehe README dort |
| `/personas`  | Definitionen der 10 KI-Personas inkl. Stimmfassungen je Sprache — siehe README dort |
| `/data`      | Strukturierte Rohdaten (Produkte, Studien-Register, Preise, Themeninventur) — siehe README dort |
| `/agents`    | Definitionen/Prompts für unterstützende Arbeits-Agents (Recherche, Faktencheck, Redaktion) — siehe README dort |
| `/src/i18n`  | Übersetzungsschlüssel, Sprachkonfiguration, Locale-Utilities |
| `/src`       | Astro-Applikation (Layouts, Komponenten, Content-Collection-Schema, Seiten) |

## 10. Rechtliches

- Kein Cookie-Banner: Die Seite nutzt ausschließlich funktionalen `localStorage`
  (Sprache/Region/Theme-Präferenz) ohne Tracking-Zweck und später cookielose Analytics — dafür
  ist nach aktueller Einschätzung keine Einwilligung nötig. Wird das Analytics-Konzept
  geändert (z. B. klassisches Cookie-basiertes Tracking), muss diese Regel und die
  Datenschutzerklärung neu bewertet werden.
- Impressum und Datenschutzerklärung existieren pro Sprache unter `/[lang]/impressum` und
  `/[lang]/datenschutz` und sind bis zur rechtlichen Prüfung als Platzhalter gekennzeichnet.

## 11. Qualitätssicherung

- Vor Veröffentlichung: Prüfen, ob jede Sachbehauptung eine `quellen`-Referenz hat (DOI oder
  PubMed-ID), ob der Link funktioniert, ob Affiliate-Links gekennzeichnet sind, ob die
  KI-Kennzeichnung am Artikelende vorhanden ist und ob Persona-Kennzeichnung vorhanden ist.
- Widersprüche zwischen Personas sind kein Fehler, aber ein Artikel, der eine falsche
  Tatsachenbehauptung als "nur Meinung" tarnt, ist ein Fehler.
