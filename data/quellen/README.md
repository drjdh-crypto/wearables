# /data/quellen

Ausgabe von Schritt 1 der Redaktions-Pipeline (siehe `/agents/pipeline/01-recherche.md`): eine
JSON-Datei pro Artikel-Slug mit ausschließlich verifizierten Quellen, die zusätzlich die
Diversitätsregeln aus `01-recherche.md` erfüllen (geprüft mit
`agents/pipeline/scripts/validate-quellen.mjs`).

Diese Dateien sind ein **Recherche-Zwischenstand**, kein Ersatz für das `quellen`-Feld im
Artikel-Frontmatter (siehe `/content/README.md`) — Schritt 2 (Draft) übernimmt daraus die
tatsächlich im Artikel zitierten Einträge ins Frontmatter. Nicht jede hier gelistete Quelle
muss zwingend im fertigen Artikel landen, aber jede im Artikel zitierte Quelle muss hier mit
`verifiziert: true` stehen.

## Quellen der Recherche

Schritt 1 durchsucht: **PubMed**, **Semantic Scholar**, **OpenAlex**, **Europe PMC** und
**Unpaywall** (alle offiziell, kostenlos, mit höflichen Rate-Limits genutzt — Unpaywall
verlangt einen Kontakt-`email`-Parameter, kein Key nötig; falls ein Dienst künftig einen API-Key
verlangt, wird der als Umgebungsvariable erwartet, nie hartcodiert). Optional zusätzlich
**arXiv**/**medRxiv** für Preprints — Preprints werden immer mit `"preprint": true` und
`"studientyp": "preprint"` markiert und im Artikel als „Preprint, nicht begutachtet"
gekennzeichnet (automatisch über `SourcesBox`, siehe `src/i18n/strings/*.json`).

## Schema

```json
[
  {
    "doi": "10.xxxx/xxxxx",
    "titel": "…",
    "autoren": "Nachname V, Nachname W",
    "journal": "Journal-Name",
    "jahr": 2023,
    "studientyp": "peer-reviewed",
    "ist_uebersichtsarbeit": false,
    "forschungsgruppe": null,
    "n": 120,
    "open_access": true,
    "preprint": false,
    "zitationen": 42,
    "kernbefund": "Ein Satz.",
    "url": "https://doi.org/10.xxxx/xxxxx",
    "verifiziert": true,
    "verifikationsmethode": "crossref-doi",
    "geprueft_am": "2026-08-12"
  }
]
```

| Feld | Bedeutung |
|---|---|
| `n` | Stichprobengröße, `null` bei Übersichts-/Methodenarbeiten ohne eigene Kohorte |
| `doi` | `null` bei institutionellen Quellen ohne DOI — dann `verifikationsmethode: "direkter-abruf"` |
| `ist_uebersichtsarbeit` | `true` nur bei echten systematischen Reviews/Meta-Analysen, nicht bei narrativen Übersichtsarbeiten oder Methodenpapieren |
| `forschungsgruppe` | Kurztag, wenn eine bekannte Autor:innen-Überschneidung mit einer anderen Quelle im selben Set besteht (z. B. gemeinsame:r Senior-Autor:in), sonst `null` |
| `open_access` | Über Unpaywall geprüft — bei `false` gilt: im Artikel nicht über das per Abstract Zugängliche hinaus behaupten |
| `preprint` | `true` → Artikel kennzeichnet als „Preprint, nicht begutachtet" |
| `zitationen` | Zitationszahl aus OpenAlex (`cited_by_count`), Momentaufnahme zum `geprueft_am`-Datum |

## Diversitätsregeln (hart geprüft)

Vor der Übergabe an Schritt 2 (Draft) muss `node agents/pipeline/scripts/validate-quellen.mjs
data/quellen/<slug>.json` fehlerfrei durchlaufen:

- 6–10 Quellen
- mindestens 2 aus den letzten 3 Jahren
- mindestens 1 Quelle mit `ist_uebersichtsarbeit: true`
- maximal 2 Quellen mit demselben `journal`
- maximal 2 Quellen mit demselben `forschungsgruppe`-Tag

Details und Begründung in `/agents/pipeline/01-recherche.md`.

Referenzbeispiel: `schlafphasen.json` (8 Quellen, Recherche-Output für den Artikel
„Schlafphasen erklärt", Diversitätsregeln geprüft und erfüllt).
