# /data

Strukturierte Rohdaten, die von Artikeln referenziert oder für Tabellen/Vergleiche
ausgewertet werden — kein Fließtext, keine redaktionellen Inhalte (die gehören nach
`/content`).

## Struktur

```
data/
  products.json            # Produktdatenbank (aktiv, siehe unten)
  charts/                   # Chart-Rohdaten, eine JSON-Datei pro Chart — siehe charts/README.md
  quellen/                  # Crossref-verifizierte Studien pro Artikel-Slug — siehe quellen/README.md
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

- `quellen/<slug>.json` ist die Recherche-Grundlage für Artikel-Frontmatter (`quellen`) —
  produziert von Schritt 1 der Redaktions-Pipeline (`/agents/pipeline/01-recherche.md`), jede
  DOI dort ist Crossref-verifiziert. Details siehe `quellen/README.md`.
- Preis-/Produktdaten regelmäßig aktualisieren; `status` konsequent pflegen, damit inaktive
  Partnerprogramme nicht versehentlich weiter beworben werden.
- Keine unbelegten Zahlen in `quellen/*.json` — jeder Eintrag entspricht Abschnitt 2 aus
  [`CLAUDE.md`](../CLAUDE.md) (Quellenpflicht) und ist Crossref-geprüft.
