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
affiliate: false               # true, sobald der Artikel mind. einen Eintrag in `produkte` hat
entwurf: false                 # true = wird nicht gebaut/gelistet
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
---
```

`quellen` ist eine Liste — mehrere Behauptungen im Artikel referenzieren dieselbe oder
unterschiedliche Einträge über `aussage`. Peer-reviewte Einträge (`studientyp:
peer-reviewed`) brauchen zwingend `doi` oder `pubmed_id`, sonst schlägt der Build fehl (Zod-
Validierung in `src/content.config.ts`).

Artikel sind normalerweise `.md`. Wird ein Chart *mitten im Fließtext* gebraucht (nicht nur als
Hero-Chart), die Datei stattdessen als `.mdx` anlegen und `<Chart id="…" lang={lang} />` direkt
im Body verwenden (MDX-Integration ist installiert, Astro-Komponenten funktionieren dann in der
Prosa).

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
   ausbrechen (siehe MDX-Hinweis oben)
7. `ProductBox` je Eintrag in `produkte` (Werbekennzeichnung + regionsabhängiger Link)
8. `PersonaOpinionBlock` — zeigt `meinungen`, falls im Frontmatter gesetzt (themenspezifische
   Statements aus Pipeline-Schritt 4, siehe `/agents/pipeline/04-persona-stimmen.md); sonst
   Fallback: wählt deterministisch 3 Stimmen aus `personas` mit deren generischer
   `voices.<lang>.intro`. Immer als "KI-Perspektive: [Name]" gekennzeichnet
9. `SourcesBox` — nummeriertes Quellenverzeichnis aus `quellen`, mit DOI-/PubMed-Links
10. Dezenter KI-Kennzeichnungshinweis am Artikelende (CLAUDE.md Abschnitt 4)

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
