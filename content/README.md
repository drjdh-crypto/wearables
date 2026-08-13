# /content

Redaktionelle Inhalte der Seite: Artikel, Vergleiche, Glossareinträge. Wird von Astro als
Content Collection eingebunden (Schema siehe `src/content.config.ts`).

Verbindliche Inhaltsregeln stehen in [`CLAUDE.md`](../CLAUDE.md) (Abschnitte 2–6):
Quellenpflicht (DOI/PubMed-ID), Zitierformat, KI-Kennzeichnung, Persona-Kennzeichnung,
Affiliate-Kennzeichnung.

## Struktur

```
content/
  articles/           # einzelne Artikel, ein Markdown/MDX-File pro Artikel
    _template.md        # Vorlage, entwurf:true, nie veröffentlichen
    <slug>.md
  comparisons/         # Produktvergleiche (gleiches Frontmatter-Schema wie articles)
    <slug>.md
  glossary/            # Glossareinträge (Kurzdefinitionen, z. B. "HRV", "REM-Schlaf")
    <slug>.md
```

## Frontmatter-Schema (Artikel & Vergleiche)

```yaml
---
titel: "…"
beschreibung: "…"
sprache: "de"                # de | en | es — muss zu enabledLocales passen, um gebaut zu werden
datum: 2026-08-12             # Erstveröffentlichung
historie:                     # Pflicht, mind. 1 Eintrag — jüngster liefert "Zuletzt geprüft am"
  - datum: 2026-08-12
    notiz: "Erstveröffentlichung"
kategorie: "tracking-genauigkeit"
schlagworte: ["hrv", "oura", "validierungsstudie"]
kernaussagen:                 # 1–5 Sätze, empfohlen genau 3 — Kernaussagen-Box im Artikelkopf
  - "…"
  - "…"
  - "…"
praxisfazit:                   # optional, 2–4 Punkte — EINE Box am Artikelende, Alltagssprache
  - "…"                          # ohne Fachjargon, muss aus dem Gesamttext folgen (CLAUDE.md Abschnitt 2)
  - "…"
affiliate: false               # true, sobald der Artikel mind. einen Eintrag in `produkte` hat
entwurf: false                 # true = wird nicht öffentlich gebaut/gelistet, aber unter /entwurf/<id>/ vorschaubar
offenePunkte:                  # optional, nur relevant solange entwurf:true — erscheint im mobilen
  - "…"                          # ReviewBlock auf /entwurf/<id>/ (siehe /agents/commands/freigabe.md)
featured: false                # true = Aufmacher der Startseite (max. 1 Artikel gleichzeitig sinnvoll)
istSaeule: false                # true = Säulen-Artikel der Pillar-Seite dieser kategorie+sprache
heroChart: "schlafphasen-anteile"   # optional, Chart-ID aus /data/charts/
produkte: ["oura-ring-4"]      # IDs aus /data/products.json — rendert je eine ProductBox
personas: ["dr-marlene", "kai", "ben"]   # Kandidat:innen für PersonaOpinionBlock (>= 3 empfohlen)
meinungen:                     # optional — themenspezifische Statements statt generischer Stimme
  - persona: "kai"                # muss in `personas` oben enthalten sein
    de: "…"
    en: "…"
quellen:
  - aussage: "PSG-validierte Schlafstadien-Erkennung liegt bei ~79% Genauigkeit"
    studientyp: "peer-reviewed"    # peer-reviewed | preprint | manufacturer | institutional
    autoren: "Altini M. et al."
    jahr: 2023
    titel: "Sleep stage classification..."
    journal: "Sensors"
    doi: "10.3390/s23135778"       # oder pubmed_id — mindestens eins bei peer-reviewed Pflicht
    url: "https://doi.org/10.3390/s23135778"
    n: 120                          # optional, Stichprobengröße — zeigt SourcesBox neben studientyp
    evidenzstufe: "kohorte"         # optional, siehe docs/quellenbewertung.md
    score: 55                       # optional, Quellen-Relevanzindex — nur im ReviewBlock sichtbar
    teilwerte: { studientyp: 18, zitationsrate: 10, n: 6, aktualitaet: 15, journal: 0, preprint_malus: 0 }
    begruendung: "…"                # optional, Score-Herleitung — nur im ReviewBlock sichtbar
---
```

`quellen` ist eine Liste — mehrere Behauptungen im Artikel referenzieren dieselbe oder
unterschiedliche Einträge über `aussage`. Peer-reviewte Einträge (`studientyp:
peer-reviewed`) brauchen zwingend `doi` oder `pubmed_id`, sonst schlägt der Build fehl (Zod-
Validierung in `src/content.config.ts`). `n`, `evidenzstufe`, `score`, `teilwerte` und
`begruendung` kommen aus `agents/pipeline/scripts/score-quellen.mjs` — siehe
`/data/quellen/README.md`.

Artikel sind normalerweise `.md`. Wird ein Chart *mitten im Fließtext* gebraucht (nicht nur als
Hero-Chart), die Datei stattdessen als `.mdx` anlegen und die Komponente direkt im Body
verwenden (MDX-Integration ist installiert, Astro-Komponenten funktionieren dann in der Prosa):

```mdx
<Chart id="…" lang={lang} />
```

`PraxisFazit` wird dagegen **nicht** inline im Body verwendet, sondern automatisch vom
Artikel-Layout aus dem Frontmatter-Feld `praxisfazit` gerendert (eine Box am Artikelende, siehe
oben) — Artikel ohne sonstige Inline-Komponenten bleiben deshalb `.md`.

Kategorien (`kategorie`) orientieren sich an der Themeninventur, siehe
`/data/themeninventur.md`:

- `tracking-genauigkeit` — Validierungsstudien, Sensor vs. PSG/Referenzmethode
- `schlafphysiologie` — Grundlagenwissen Schlafstadien, zirkadiane Rhythmik
- `hrv-recovery` — HRV, Recovery-Scores, Trainingssteuerung
- `geraete-vergleich` — Produktvergleiche, Kaufberatung
- `praxis-alltag` — Anwendung im Alltag, Troubleshooting, Interpretation eigener Daten
- `methodik-limitationen` — Grenzen von Consumer-Wearables, Messfehler, Studienkritik

## Layout der Artikel-Seite

Die Artikel-Route (`src/pages/[lang]/artikel/[slug].astro`) baut sich in dieser Reihenfolge auf:

1. Link zur Pillar-Seite des Clusters ("Teil des Themenclusters: …")
2. Titel, Lesedauer (aus der Wortzahl des Bodys geschätzt) + "Zuletzt geprüft am" (aus dem
   jüngsten `historie`-Eintrag)
3. Hero-Chart (`heroChart`), falls gesetzt
4. `KeyFindingsBox` — "Das sagt die Studienlage": `kernaussagen` + Quellenanzahl
5. Inhaltsverzeichnis (`TableOfContents`, aus H2/H3 des Bodys) — Desktop: sticky Sidebar
6. Fließtext, ~70 Zeichen Spaltenbreite (`.article-body`); Charts im Body dürfen breiter
   ausbrechen (siehe MDX-Hinweis oben).
7. `PraxisFazit` — EINE Box "Was heißt das für die Praxis?" mit `praxisfazit` (2–4 Punkte,
   Alltagssprache), falls im Frontmatter gesetzt (CLAUDE.md Abschnitt 2, "Praxis-Fazit").
8. `ProductBox` je Eintrag in `produkte` (Werbekennzeichnung + regionsabhängiger Link)
9. `PersonaOpinionBlock` — zeigt `meinungen`, falls im Frontmatter gesetzt (themenspezifische
   Statements aus Pipeline-Schritt 4, siehe `/agents/pipeline/04-persona-stimmen.md); sonst
   Fallback: wählt deterministisch 3 Stimmen aus `personas` mit deren generischer
   `voices.<lang>.intro`. Immer als "KI-Perspektive: [Name]" gekennzeichnet
10. `SourcesBox` — nummeriertes Quellenverzeichnis aus `quellen`, mit DOI-/PubMed-Links
11. Dezenter KI-Kennzeichnungshinweis am Artikelende (CLAUDE.md Abschnitt 4)

Solange `entwurf: true`, existiert zusätzlich `src/pages/entwurf/[slug].astro` unter
`/entwurf/<id>/` — dasselbe Layout, `noindex`, plus mobiler `ReviewBlock` mit `quellen` als
antippbaren Links und `offenePunkte`. Siehe `/agents/README.md`, „Entwurfs-Vorschau".

`Footnotes` (`src/components/Footnotes.astro`) steht optional zur Verfügung für redaktionelle
Anmerkungen, die keine Quelle im Sinne von `SourcesBox` sind.

## Vorgehen beim Anlegen eines neuen Artikels

1. `content/articles/_template.md` kopieren, Slug + Kategorie aus der Themeninventur wählen
   (Duplikate vermeiden).
2. Frontmatter gemäß Schema oben ausfüllen, inkl. `quellen` (DOI/PubMed-ID Pflicht bei
   peer-reviewed), `historie` (mind. 1 Eintrag) und `kernaussagen` (empfohlen genau 3).
3. Passende Personas aus `/personas` in `personas` eintragen (mind. 3, damit
   `PersonaOpinionBlock` tatsächlich rotieren kann).
4. Betroffene Produkte aus `/data/products.json` in `produkte` eintragen, `affiliate: true`
   setzen, falls zutreffend.
5. Falls ein passender Chart existiert (`/data/charts/`), als `heroChart` eintragen.
6. Höchstens einen Artikel je (kategorie, sprache) als `istSaeule: true` markieren, höchstens
   einen Artikel insgesamt als `featured: true`.
7. Vor Merge: Checkliste aus `CLAUDE.md` Abschnitt 11 durchgehen, `entwurf: false` setzen.
