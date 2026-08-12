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
datum: 2026-08-12
aktualisiert: 2026-08-20      # optional
kategorie: "tracking-genauigkeit"
schlagworte: ["hrv", "oura", "validierungsstudie"]
affiliate: false               # true, sobald der Artikel mind. einen Eintrag in `produkte` hat
entwurf: false                 # true = wird nicht gebaut/gelistet
produkte: ["oura-ring-4"]      # IDs aus /data/products.json — rendert je eine ProductBox
personas: ["dr-marlene", "kai", "ben"]   # Kandidat:innen für PersonaOpinionBlock (>= 3 empfohlen)
quellen:
  - aussage: "PSG-validierte Schlafstadien-Erkennung liegt bei ~79% Genauigkeit"
    studientyp: "peer-reviewed"    # peer-reviewed | preprint | manufacturer | institutional
    autoren: "Altini M. et al."
    jahr: 2023
    titel: "Sleep stage classification..."
    journal: "Sensors"
    doi: "10.3390/s23135778"       # oder pubmed_id — mindestens eins bei peer-reviewed Pflicht
    url: "https://doi.org/10.3390/s23135778"
---
```

`quellen` ist eine Liste — mehrere Behauptungen im Artikel referenzieren dieselbe oder
unterschiedliche Einträge über `aussage`. Peer-reviewte Einträge (`studientyp:
peer-reviewed`) brauchen zwingend `doi` oder `pubmed_id`, sonst schlägt der Build fehl (Zod-
Validierung in `src/content.config.ts`).

Kategorien (`kategorie`) orientieren sich an der Themeninventur, siehe
`/data/themeninventur.md`:

- `tracking-genauigkeit` — Validierungsstudien, Sensor vs. PSG/Referenzmethode
- `schlafphysiologie` — Grundlagenwissen Schlafstadien, zirkadiane Rhythmik
- `hrv-recovery` — HRV, Recovery-Scores, Trainingssteuerung
- `geraete-vergleich` — Produktvergleiche, Kaufberatung
- `praxis-alltag` — Anwendung im Alltag, Troubleshooting, Interpretation eigener Daten
- `methodik-limitationen` — Grenzen von Consumer-Wearables, Messfehler, Studienkritik

## Rendering-Komponenten

Die Artikel-Route (`src/pages/[lang]/artikel/[slug].astro`) rendert automatisch, in dieser
Reihenfolge, nach dem Markdown-Body:

1. `ProductBox` je Eintrag in `produkte` (Werbekennzeichnung + regionsabhängiger Link)
2. `PersonaOpinionBlock` — wählt deterministisch 3 Stimmen aus `personas` aus, jede als
   "KI-Perspektive: [Name]" gekennzeichnet
3. `SourcesBox` — Quellenverzeichnis aus `quellen`, mit "Studienlage: X Quellen"-Überschrift
4. Dezenter KI-Kennzeichnungshinweis am Artikelende (CLAUDE.md Abschnitt 4)

`Footnotes` (`src/components/Footnotes.astro`) steht optional zur Verfügung für redaktionelle
Anmerkungen, die keine Quelle im Sinne von `SourcesBox` sind.

## Vorgehen beim Anlegen eines neuen Artikels

1. `content/articles/_template.md` kopieren, Slug + Kategorie aus der Themeninventur wählen
   (Duplikate vermeiden).
2. Frontmatter gemäß Schema oben ausfüllen, inkl. `quellen` (DOI/PubMed-ID Pflicht bei
   peer-reviewed).
3. Passende Personas aus `/personas` in `personas` eintragen (mind. 3, damit
   `PersonaOpinionBlock` tatsächlich rotieren kann).
4. Betroffene Produkte aus `/data/products.json` in `produkte` eintragen, `affiliate: true`
   setzen, falls zutreffend.
5. Vor Merge: Checkliste aus `CLAUDE.md` Abschnitt 11 durchgehen, `entwurf: false` setzen.
