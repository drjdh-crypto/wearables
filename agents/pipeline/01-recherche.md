# Agent: Recherche

Schritt 1 der Redaktions-Pipeline (siehe `/agents/README.md`).

## Zweck

Für ein Thema 6–10 relevante, **verifizierte** Studien finden und strukturiert erfassen —
bevor auch nur ein Satz Artikeltext geschrieben wird.

## Eingabe

Eine Themenbeschreibung, z. B. „Schlafarchitektur, Schlafphasen-Klassifikation, was
Consumer-Tracker vs. Polysomnographie erkennen" — plus ein Slug für die Ausgabedatei
(`<slug>`, i. d. R. identisch mit dem geplanten Artikel-Slug).

## Vorgehen

1. Kandidatensuche über PubMed und Semantic Scholar (Websuche, wo möglich mit
   `allowed_domains: ["pubmed.ncbi.nlm.nih.gov", "semanticscholar.org"]` bzw. gezielten
   Suchbegriffen) nach 6–10 Studien, die das Thema tatsächlich abdecken. Reviews/Metaanalysen
   sind willkommen, ersetzen aber nicht komplett Primärstudien, wo es um konkrete Zahlen geht.
2. Für jede Kandidatenstudie erfassen: DOI, Titel, Jahr, Studientyp
   (`peer-reviewed` | `preprint` | `institutional` | `manufacturer`), Stichprobengröße `n`
   (falls zutreffend/berichtet), Kernbefund in **einem** Satz, Quell-URL.
3. **Pflicht:** Jede DOI einzeln gegen die Crossref-API auflösen —
   `GET https://api.crossref.org/works/{doi}` — und `title`/`published`-Jahr aus der
   Crossref-Antwort gegen die Kandidatenangabe abgleichen (Titel muss inhaltlich
   übereinstimmen, nicht nur Wortsuppe).
4. Nicht auflösbare DOIs (Crossref-Fehler, kein Treffer) oder DOIs, deren Crossref-Titel/-Jahr
   nicht zur Kandidatenangabe passen, werden **verworfen** — niemals korrigiert, niemals
   geraten, keine Ersatz-DOI eingesetzt. Lieber 6 verifizierte Quellen als 10 mit
   Unsicherheiten.
5. Ausnahme DOI-lose institutionelle Quellen (z. B. NCBI-Bookshelf-Kapitel): statt Crossref
   zählt der direkte Abruf der Original-URL und ein Abgleich des Inhalts mit der
   Kandidatenangabe (`verifikationsmethode: "direkter-abruf"`). Auch hier gilt: nicht
   erreichbar oder inhaltlich abweichend → verwerfen.
6. Nur verifizierte Einträge landen in der Ausgabedatei.

## Ausgabe

`/data/quellen/<slug>.json`:

```json
[
  {
    "doi": "10.xxxx/xxxxx",
    "titel": "Titel exakt wie bei Crossref/Original",
    "jahr": 2023,
    "studientyp": "peer-reviewed",
    "n": 120,
    "kernbefund": "Ein Satz, der den zitierfähigen Kernbefund zusammenfasst.",
    "url": "https://doi.org/10.xxxx/xxxxx",
    "verifiziert": true,
    "verifikationsmethode": "crossref-doi",
    "geprueft_am": "2026-08-12"
  }
]
```

`n` ist `null`, wenn die Studie keine klassische Stichprobe hat (z. B. reine Übersichtsarbeit
oder Methodenarbeit ohne eigene Kohorte). `doi` ist `null` bei institutionellen Quellen ohne
DOI (`verifikationsmethode: "direkter-abruf"`, siehe Punkt 5 oben). Diese Datei ist die
einzige Quelle für Schritt 2 (Draft) — der Draft darf keine Studie zitieren, die hier nicht mit
`verifiziert: true` steht.
