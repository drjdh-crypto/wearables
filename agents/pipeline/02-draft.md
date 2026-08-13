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
  nicht belegte Aussage wird stattdessen explizit als offene Frage benannt — **inhaltlich, nicht
  prozessual formuliert**: „Wie stark sich X auf Y auswirkt, ist nicht abschließend geklärt."
  statt „Das konnten wir mit den verfügbaren Quellen nicht klären." Keine stillschweigend
  gefüllten Lücken.
- **Keine Rechercheprozess-Sprache im Fließtext.** Formulierungen, die beschreiben, *wie* wir
  recherchiert haben, statt *was* die Wissenschaft zeigt — „hinter einer Bezahlschranke",
  „nicht extrahierbar", „diese Recherche stützt sich auf …", „konnten wir nicht einsehen" —
  gehören nicht in den Artikeltext. Wenn ein wissenschaftlicher Sachverhalt ungeklärt ist, wird
  das inhaltlich benannt (siehe Punkt oben). Prozessdetails (warum eine bestimmte Quelle
  gewählt wurde, Zugriffsprobleme, Verifikationsschritte) gehören ins Review-Protokoll
  (`offenePunkte` im Frontmatter), nicht in den Fließtext — dort liest sie ohnehin nur das
  menschliche Review, nicht die Leserschaft. Siehe CLAUDE.md, Abschnitt 2 „Sprache: Inhalt
  statt Prozess".
- `kernaussagen` (Kernaussagen-Box) fassen ausschließlich zusammen, was die verifizierten
  Quellen tatsächlich hergeben.
- Enthält der Artikel einen Hero-Chart oder Inline-Diagramme, beruhen deren Werte auf einer der
  verifizierten Quellen; die Chart-`datenquelle` referenziert sie (DOI + Zitat), siehe
  `/data/charts/README.md`. Diagrammtyp und Mobile-First-Regeln: CLAUDE.md Abschnitt 2
  „Diagramme" — **kein Diagramm für Einzelwerte ohne Streuung**, nur bei mehreren Datenpunkten,
  einer Verteilung oder einem Vergleich. Berichtet eine Quelle eine Spannweite/ein
  Konfidenzintervall über mehrere Geräte oder Studien, als `bereich`-Chart darstellen
  (Median/Mittelwert als `mitte` nur, wenn die Quelle diesen Wert selbst berichtet).
- `praxisfazit` (Artikel-Frontmatter, 2–4 Punkte): EINE Liste am Artikelende, die die
  wichtigsten Konsequenzen aus dem **gesamten** Draft zusammenfasst — nicht pro Quelle, nicht
  im Fließtext verteilt. Alltagssprache, kein Fachjargon (siehe CLAUDE.md Abschnitt 2,
  „Praxis-Fazit"). Wird vom Artikel-Layout automatisch gerendert, nicht im Body verwenden.
- `entwurf: true` bleibt gesetzt — Schritt 2 veröffentlicht nichts.
- Zwei Artikeldateien: `<slug>.md` (`sprache: de`) und `<slug>-en.md` (`sprache: en`) — `.mdx`
  statt `.md`, sobald der Artikel `<Chart>` oder andere inline eingebettete Komponenten mitten
  im Fließtext verwendet (Content-Collection akzeptiert beide, siehe `src/content.config.ts`).
  Inhaltlich deckungsgleich in Aussage und Quellenbezug, aber eigenständig formuliert, keine
  Wort-für-Wort-Übersetzung.

## Ausgabe

- `/content/articles/<slug>.md` bzw. `.mdx`
- `/content/articles/<slug>-en.md` bzw. `.mdx`
- ggf. `/data/charts/<slug>-*.json`
