# /data

Strukturierte Rohdaten, die von Artikeln referenziert oder für Tabellen/Vergleiche
ausgewertet werden — kein Fließtext, keine redaktionellen Inhalte (die gehören nach
`/content`).

## Geplante Struktur

```
data/
  products.yaml           # Geräte-Stammdaten: Hersteller, Modell, Sensorik, Preis, Release
  studies.yaml            # Studien-Register: DOI, Kernaussage, Gerät/Methode, Studientyp
  price-history/          # optional: Preisverlaufsdaten pro Produkt (für Kaufberatung)
  themeninventur.md        # Artikel-Themeninventur (Cluster, Arbeitstitel, Status)
```

## Prinzipien

- `studies.yaml` ist die zentrale Quelle für DOIs, die in Artikel-Frontmatter (`sources`)
  verwendet werden — Duplikate vermeiden, auf existierende Einträge referenzieren statt
  DOIs mehrfach abzutippen.
- Preis-/Produktdaten regelmäßig aktualisieren; Stand mit Datum versehen, damit Artikel
  erkennbar bleiben, wenn Daten veraltet sind.
- Keine unbelegten Zahlen in `studies.yaml` — jeder Eintrag entspricht Abschnitt 1 aus
  [`CLAUDE.md`](../CLAUDE.md) (Quellenpflicht).
