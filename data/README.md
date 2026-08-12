# /data

Strukturierte Rohdaten, die von Artikeln referenziert oder für Tabellen/Vergleiche
ausgewertet werden — kein Fließtext, keine redaktionellen Inhalte (die gehören nach
`/content`).

## Struktur

```
data/
  products.json            # Produktdatenbank (aktiv, siehe unten)
  charts/                   # Chart-Rohdaten, eine JSON-Datei pro Chart — siehe charts/README.md
  studies.yaml              # geplant: Studien-Register, DOI/PubMed-ID, Kernaussage, Studientyp
  price-history/            # geplant: Preisverlaufsdaten pro Produkt (für Kaufberatung)
  themeninventur.md         # Artikel-Themeninventur (Cluster, Arbeitstitel, Status)
```

## products.json

Als Content Collection `products` eingebunden (`src/content.config.ts`, `file()`-Loader) —
Zod-Schema erzwingt Struktur und URL-Gültigkeit beim Build. Von der `ProductBox`-Komponente
konsumiert (Werbekennzeichnung siehe [`CLAUDE.md`](../CLAUDE.md) Abschnitt 6).

| Feld | Bedeutung |
|---|---|
| `id` | Eindeutige ID, wird in Artikel-Frontmatter (`produkte`) referenziert |
| `name` | Anzeigename |
| `kategorie` | z. B. `ring`, `band`, `matte`, `app` |
| `links.{de,us,es,fallback}` | Regionsabhängiger Affiliate-/Produktlink. Region-Feld leer (`""`) = kein eigener Link für diese Region, `ProductBox` zeigt dann `fallback`. `fallback` muss immer eine echte, nicht-affiliate URL sein (z. B. Hersteller-Website) |
| `netzwerk` | Affiliate-Netzwerk/-Programm (z. B. "Amazon PartnerNet") |
| `provision` | Konditionen, Freitext (z. B. "4%", "10% erste Periode") |
| `cookie_laufzeit` | Cookie-/Attributionslaufzeit des Netzwerks, Freitext |
| `status` | `aktiv` \| `inaktiv` \| `geplant` — inaktive Einträge werden nicht in `ProductBox` gerendert |

Region ≠ Sprache: Welcher Link angezeigt wird, hängt vom `RegionSwitcher`
(`localStorage: pref:region`) ab, nicht von der UI-Sprache — siehe `CLAUDE.md` Abschnitt 7 und
`/src/i18n/README.md`.

Echte Affiliate-IDs/Tracking-Parameter werden hier nie hartcodiert commitet, solange sie nicht
tatsächlich aktiv und geprüft sind — bis dahin stehen `PLACEHOLDER`-Werte in den Links.

## Prinzipien

- `studies.yaml` (geplant) wird die zentrale Quelle für DOIs/PubMed-IDs, die in
  Artikel-Frontmatter (`quellen`) verwendet werden — Duplikate vermeiden, auf existierende
  Einträge referenzieren statt IDs mehrfach abzutippen.
- Preis-/Produktdaten regelmäßig aktualisieren; `status` konsequent pflegen, damit inaktive
  Partnerprogramme nicht versehentlich weiter beworben werden.
- Keine unbelegten Zahlen in `studies.yaml` — jeder Eintrag entspricht Abschnitt 2 aus
  [`CLAUDE.md`](../CLAUDE.md) (Quellenpflicht).
