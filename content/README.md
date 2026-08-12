# /content

Redaktionelle Inhalte der Seite: Artikel, Vergleiche, Glossareinträge, Kaufberatungen. Wird
von Astro als Content Collection eingebunden (Schema siehe `src/content.config.ts`).

Verbindliche Inhaltsregeln stehen in [`CLAUDE.md`](../CLAUDE.md) (Abschnitte 1–4):
Quellenpflicht/DOI im Frontmatter, Zitierformat, Persona-Kennzeichnung, Affiliate-Kennzeichnung.

## Struktur

```
content/
  articles/           # einzelne Artikel, ein Markdown/MDX-File pro Artikel
    <slug>.md
  comparisons/         # Produktvergleiche (Tabellen + Fließtext)
    <slug>.md
  glossary/            # Glossareinträge (Kurzdefinitionen, z. B. "HRV", "REM-Schlaf")
    <slug>.md
```

Kategorien (`category` im Frontmatter) orientieren sich an der Themeninventur, siehe
`/data/themeninventur.md` (bzw. verlinktes Dokument), grob:

- `tracking-genauigkeit` — Validierungsstudien, Sensor vs. PSG/Referenzmethode
- `schlafphysiologie` — Grundlagenwissen Schlafstadien, zirkadiane Rhythmik
- `hrv-recovery` — HRV, Recovery-Scores, Trainingssteuerung
- `geraete-vergleich` — Produktvergleiche, Kaufberatung
- `praxis-alltag` — Anwendung im Alltag, Troubleshooting, Interpretation eigener Daten
- `methodik-limitationen` — Grenzen von Consumer-Wearables, Messfehler, Studienkritik

## Vorgehen beim Anlegen eines neuen Artikels

1. Slug + Kategorie aus der Themeninventur wählen (Duplikate vermeiden).
2. Frontmatter gemäß Schema in `CLAUDE.md` Abschnitt 1 ausfüllen, inkl. `sources`.
3. Passende Persona(s) aus `/personas` als `author` bzw. in Meinungsboxen einsetzen.
4. Vor Merge: Checkliste aus `CLAUDE.md` Abschnitt 7 durchgehen.
