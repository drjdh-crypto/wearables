# Agent: Recherche

Schritt 1 der Redaktions-Pipeline (siehe `/agents/README.md`).

## Zweck

Für ein Thema 6–10 relevante, **verifizierte** und **diverse** Studien finden und strukturiert
erfassen — bevor auch nur ein Satz Artikeltext geschrieben wird.

## Eingabe

Eine Themenbeschreibung, z. B. „Schlafarchitektur, Schlafphasen-Klassifikation, was
Consumer-Tracker vs. Polysomnographie erkennen" — plus ein Slug für die Ausgabedatei
(`<slug>`, i. d. R. identisch mit dem geplanten Artikel-Slug).

## Quellen der Recherche

Kandidatensuche über mehrere offizielle, kostenlose APIs (höfliche Rate-Limits einhalten,
keine parallelen Bulk-Anfragen). API-Keys — falls ein Dienst künftig einen verlangt — werden
als Umgebungsvariable erwartet, nie hartcodiert.

| Quelle | Zweck | Zugang |
|---|---|---|
| PubMed | Biomedizinische Literatur, Standardsuche für Gesundheitsthemen | Websuche/E-Utilities, kein Key nötig |
| Semantic Scholar | Breitere Abdeckung, Zitationsgraph | Websuche/API, kein Key für moderates Volumen |
| OpenAlex | Metadaten + Zitationszahl (`cited_by_count`) je Werk | `GET https://api.openalex.org/works/https://doi.org/{doi}`, kein Key nötig |
| Europe PMC | Alternative/Ergänzung zu PubMed, oft mit Volltext-Links | `GET https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=...`, kein Key nötig |
| Unpaywall | Open-Access-Status + legale Volltext-URL | `GET https://api.unpaywall.org/v2/{doi}?email=<kontakt>`, `email`-Parameter statt Key |
| arXiv / medRxiv (optional) | Preprints, nur wenn das Thema das hergibt | Websuche/API, kein Key nötig |

## Vorgehen

1. Kandidatensuche über die Quellen oben nach 6–10 Studien, die das Thema tatsächlich
   abdecken. Reviews/Metaanalysen sind willkommen, ersetzen aber nicht komplett Primärstudien,
   wo es um konkrete Zahlen geht.
2. Für jede Kandidatenstudie erfassen: DOI, Titel, Autor:innen, Journal, Jahr, Studientyp
   (`peer-reviewed` | `preprint` | `institutional` | `manufacturer`), Studiendesign nach
   Evidenzpyramide (`studiendesign`: `meta-analyse` | `systematisches-review` | `rct` |
   `kohorte` | `querschnitt` | `review` | `fallserie` | `sonstige` — siehe
   `docs/quellenbewertung.md`), ob es sich um ein systematisches Review/eine Meta-Analyse
   handelt (`ist_uebersichtsarbeit`), Stichprobengröße `n` (falls zutreffend/berichtet),
   Kernbefund in **einem** Satz, Quell-URL.
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
6. Jede verifizierte Quelle mit Unpaywall (`open_access`, plus legale Volltext-URL falls
   vorhanden) und OpenAlex (`zitationen`) anreichern. DOI-lose Quellen: `open_access` per
   direktem Abruf einschätzen (frei lesbar ja/nein), `zitationen: null`.
7. Preprints (arXiv/medRxiv o. ä.) immer mit `"preprint": true` **und**
   `"studientyp": "preprint"` markieren — beides wird gebraucht: `studientyp` steuert das
   Label in der `SourcesBox`, `preprint` ist das schnell auswertbare Flag für die
   Diversitätsprüfung unten.
8. Bekannte Autor:innen-Überschneidungen zwischen zwei Quellen im selben Set (z. B.
   gemeinsame:r Senior-Autor:in) mit dem gleichen `forschungsgruppe`-Kurztag markieren.
9. Nur verifizierte Einträge landen in der Ausgabedatei.

## Diversitätsregeln (hart geprüft, nicht optional)

Vor der Übergabe an Schritt 2 (Draft) **muss** die Quellenliste alle fünf Regeln erfüllen —
geprüft mit `node agents/pipeline/scripts/validate-quellen.mjs data/quellen/<slug>.json`, das
Skript bricht mit Exit-Code 1 ab, wenn eine Regel verletzt ist:

1. **6–10 Quellen** insgesamt.
2. **Mindestens 2 Quellen aus den letzten 3 Jahren** (bezogen auf das aktuelle Jahr).
3. **Mindestens 1 systematisches Review oder Meta-Analyse** (`ist_uebersichtsarbeit: true`)
   **plus** Primärstudien — nicht nur Übersichtsarbeiten.
4. **Maximal 2 Quellen desselben Journals** (`journal`-Feld).
5. **Maximal 2 Quellen derselben Forschungsgruppe** (`forschungsgruppe`-Tag).

Verletzt eine Regel: weitere Kandidaten suchen oder eine bestehende Quelle durch eine
gleichwertige aus einem anderen Journal/einer anderen Gruppe ersetzen — nicht die Regel
ignorieren. Ein Beispiel für so einen Ersatz (Journal-Häufung „Sleep" 3×→2×, gelöst durch
Austausch gegen eine 2025er Meta-Analyse aus einem anderen Journal) steht in der
Commit-Historie zu `data/quellen/schlafphasen.json`.

Direkt danach, bevor an Schritt 2 übergeben wird, den Quellen-Relevanzindex berechnen:
`node agents/pipeline/scripts/score-quellen.mjs data/quellen/<slug>.json` — schreibt Score,
Teilwerte und Begründung je Quelle zurück in dieselbe Datei und prüft per Crossref, ob eine
Quelle zurückgezogen wurde (dann bricht `validate-quellen.mjs` beim nächsten Lauf hart ab,
Regel 6). Gewichtung und Grenzen: `docs/quellenbewertung.md`.

Zusätzlich (weich, als Warnung, kein harter Abbruch):

- **Open-Access bevorzugen** (`open_access: true`, geprüft über Unpaywall). Bei
  `open_access: false` gilt für Schritt 2: im Artikel nicht über das per Abstract Zugängliche
  hinaus behaupten — keine Zahlen/Tabellen zitieren, die nur im (nicht zugänglichen) Volltext
  stehen.

## Ausgabe

`/data/quellen/<slug>.json` — vollständiges Schema und Feldbeschreibung in
`/data/quellen/README.md`:

```json
[
  {
    "doi": "10.xxxx/xxxxx",
    "titel": "Titel exakt wie bei Crossref/Original",
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
    "kernbefund": "Ein Satz, der den zitierfähigen Kernbefund zusammenfasst.",
    "url": "https://doi.org/10.xxxx/xxxxx",
    "verifiziert": true,
    "verifikationsmethode": "crossref-doi",
    "geprueft_am": "2026-08-12"
  }
]
```

Diese Datei ist die einzige Quelle für Schritt 2 (Draft) — der Draft darf keine Studie
zitieren, die hier nicht mit `verifiziert: true` steht, und die Gesamtliste muss die
Diversitätsregeln oben erfüllen, bevor Schritt 2 beginnt.
