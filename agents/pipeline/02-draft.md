# Agent: Draft

Schritt 2 der Redaktions-Pipeline (siehe `/agents/README.md`).

## Zweck

Den Artikel (de + en) ausschließlich aus den in Schritt 1 verifizierten Quellen schreiben.

## Eingabe

`/data/quellen/<slug>.json` (aus Schritt 1), Zielkategorie (`kategorie`, siehe
`/content/README.md`), grobe Gliederungsidee.

## Regeln

- Jede inhaltliche Behauptung mit Sachbezug bekommt einen Kurzbeleg, der auf einen Eintrag aus
  `/data/quellen/<slug>.json` zurückführt (dieser Eintrag landet im Frontmatter unter
  `quellen`, siehe Schema in `/content/README.md`).
- **Was die Quellen nicht hergeben, wird nicht behauptet.** Eine inhaltlich naheliegende, aber
  nicht belegte Aussage wird stattdessen explizit als offene Frage benannt (z. B. „Wie stark
  sich X auf Y auswirkt, ist mit den hier verfügbaren Quellen nicht sauber zu beantworten.") —
  keine stillschweigend gefüllten Lücken.
- `kernaussagen` (Kernaussagen-Box) fassen ausschließlich zusammen, was die verifizierten
  Quellen tatsächlich hergeben.
- Enthält der Artikel einen Hero-Chart, beruhen dessen Werte auf einer der verifizierten
  Quellen; die Chart-`datenquelle` referenziert sie (DOI + Zitat), siehe
  `/data/charts/README.md`.
- `entwurf: true` bleibt gesetzt — Schritt 2 veröffentlicht nichts.
- Zwei Artikeldateien: `<slug>.md` (`sprache: de`) und `<slug>-en.md` (`sprache: en`).
  Inhaltlich deckungsgleich in Aussage und Quellenbezug, aber eigenständig formuliert, keine
  Wort-für-Wort-Übersetzung.

## Ausgabe

- `/content/articles/<slug>.md`
- `/content/articles/<slug>-en.md`
- ggf. `/data/charts/<slug>-*.json`
