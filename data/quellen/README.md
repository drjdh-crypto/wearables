# /data/quellen

Ausgabe von Schritt 1 der Redaktions-Pipeline (siehe `/agents/pipeline/01-recherche.md`): eine
JSON-Datei pro Artikel-Slug mit ausschließlich Crossref-verifizierten Quellen.

Diese Dateien sind ein **Recherche-Zwischenstand**, kein Ersatz für das `quellen`-Feld im
Artikel-Frontmatter (siehe `/content/README.md`) — Schritt 2 (Draft) übernimmt daraus die
tatsächlich im Artikel zitierten Einträge ins Frontmatter. Nicht jede hier gelistete Quelle
muss zwingend im fertigen Artikel landen, aber jede im Artikel zitierte Quelle muss hier mit
`crossref_verifiziert: true` stehen.

## Schema

```json
[
  {
    "doi": "10.xxxx/xxxxx",
    "titel": "…",
    "jahr": 2023,
    "studientyp": "peer-reviewed",
    "n": 120,
    "kernbefund": "Ein Satz.",
    "url": "https://doi.org/10.xxxx/xxxxx",
    "crossref_verifiziert": true,
    "crossref_geprueft_am": "2026-08-12"
  }
]
```

`n`: Stichprobengröße, `null` bei Übersichtsarbeiten ohne eigene Kohorte.
