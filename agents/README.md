# /agents

Definitionen für unterstützende Arbeits-Agents, die bei Recherche, Faktencheck und Redaktion
helfen. Diese sind Werkzeuge für die Content-Produktion — nicht zu verwechseln mit den
[Personas](../personas/README.md), die als sichtbare Artikel-„Stimmen" auftreten (auch wenn
die Personas in Schritt 3 und 4 der Pipeline unten aktiv mitarbeiten).

## Die Redaktions-Pipeline

Ein wiederholbarer Fünf-Schritte-Workflow von der Recherche bis zur Übergabe an einen Menschen
zur Freigabe. Jeder Schritt ist als eigene Agent-Definition unter `/agents/pipeline/`
dokumentiert:

| Schritt | Datei | Tut |
|---|---|---|
| 1. Recherche | [`pipeline/01-recherche.md`](pipeline/01-recherche.md) | 6–10 Studien über PubMed/Semantic Scholar/OpenAlex/Europe PMC/Unpaywall (+ optional arXiv/medRxiv) finden, jede DOI gegen Crossref verifizieren, Diversitätsregeln hart prüfen (`scripts/validate-quellen.mjs`) → `/data/quellen/<slug>.json` |
| 2. Draft | [`pipeline/02-draft.md`](pipeline/02-draft.md) | Artikel (de + en) ausschließlich aus den verifizierten Quellen schreiben, Lücken als offene Fragen benennen |
| 3. Quality-Gate | [`pipeline/03-quality-gate.md`](pipeline/03-quality-gate.md) | Die vier Gate-Personas prüfen den Draft, Findings beheben oder begründet dokumentieren → `/agents/reviews/<slug>.md` |
| 4. Persona-Stimmen | [`pipeline/04-persona-stimmen.md`](pipeline/04-persona-stimmen.md) | Drei passende Personas schreiben themenspezifische Meinungen (de + en) → Frontmatter-Feld `meinungen` |
| 5. Review-Übergabe | [`pipeline/05-review-uebergabe.md`](pipeline/05-review-uebergabe.md) | Kompakte Quellen-Checkliste für die menschliche Freigabe → `/agents/reviews/<slug>-checkliste.md`, `entwurf: true` bleibt |

**Aufruf:** „Führe die Redaktions-Pipeline für Thema X aus" — arbeitet die fünf Schritte in
Reihenfolge ab, mit `<slug>` aus dem Themennamen abgeleitet. Jeder Schritt baut auf der
Ausgabedatei des vorigen auf; kein Schritt überspringt die Prüfung des vorigen.

**Referenzlauf:** Die Pipeline wurde einmal vollständig für den Artikel „Schlafphasen erklärt"
ausgeführt (`slug: schlafphasen`) — Ausgaben unter `/data/quellen/schlafphasen.json`,
`/content/articles/schlafphasen-erklaert.md` + `-en.md`, `/agents/reviews/schlafphasen.md` und
`/agents/reviews/schlafphasen-checkliste.md`. Guter Ausgangspunkt, um zu sehen, wie ein
vollständiger Durchlauf aussieht. Nach der Erweiterung von Schritt 1 (Diversitätsregeln, neue
APIs, neue Schema-Felder) wurde dieser Referenzlauf rückwirkend geprüft und angepasst: Eine
Journal-Häufung (3× „Sleep") wurde durch Austausch einer Quelle gegen eine 2025er Meta-Analyse
aus einem anderen Journal aufgelöst, siehe Commit-Historie zu `data/quellen/schlafphasen.json`.

## Diversität & Quellenqualität (Schritt 1)

Seit der Erweiterung des Recherche-Agenten durchsucht Schritt 1 fünf offizielle, kostenlose
APIs (PubMed, Semantic Scholar, OpenAlex, Europe PMC, Unpaywall; optional arXiv/medRxiv für
Preprints) und prüft die gefundene Quellenliste hart gegen fünf Diversitätsregeln, bevor sie an
Schritt 2 geht — Details in [`pipeline/01-recherche.md`](pipeline/01-recherche.md):

- 6–10 Quellen, davon mindestens 2 aus den letzten 3 Jahren
- mindestens 1 systematisches Review/Meta-Analyse plus Primärstudien
- maximal 2 Quellen desselben Journals bzw. derselben Forschungsgruppe
- Open-Access-Status (Unpaywall) und Zitationszahl (OpenAlex) werden je Quelle erfasst;
  Quellen ohne Open-Access-Volltext dürfen im Artikel nicht über das per Abstract Zugängliche
  hinaus zitiert werden
- Preprints tragen `"preprint": true` und erscheinen im Artikel als „Preprint, nicht
  begutachtet" (`SourcesBox`-Label, siehe `src/i18n/strings/*.json`)

Automatisiert geprüft mit `node agents/pipeline/scripts/validate-quellen.mjs
data/quellen/<slug>.json`. Die `SourcesBox`-Komponente zeigt außerdem die Jahresspanne der
zitierten Quellen an, z. B. „Studienlage: 8 Quellen, 2004–2025".

## Nicht verhandelbare Leitplanken

- **Quellenverifikation ist Pflicht, nicht optional.** Eine DOI, die sich nicht gegen Crossref
  auflösen lässt oder deren Titel/Jahr nicht passt, wird verworfen — nie korrigiert, nie
  geraten, nie durch eine „ähnliche" DOI ersetzt.
- **Kein Schritt setzt `entwurf: false`.** Das ist ausschließlich eine menschliche
  Entscheidung (Schritt 5 bereitet sie vor, trifft sie aber nicht).
- Agents dürfen nie die Evidenzpflicht oder Kennzeichnungspflichten aus `CLAUDE.md` umgehen —
  sie sind Prüfwerkzeuge dafür, kein Weg, sie zu unterlaufen.
- Persona-Meinungen (Schritt 4) ersetzen nie die Quellenpflicht: Eine Sachbehauptung in einer
  Persona-Meinung braucht dieselbe Quellenlage wie jede andere Behauptung im Artikel.

## Weitere geplante Agents

Noch nicht als eigener Pipeline-Schritt ausformuliert, aber sinnvoll für spätere Ausbaustufen:

| Agent | Aufgabe |
|-------|---------|
| `affiliate-audit-agent` | Prüft, ob alle Affiliate-Links gekennzeichnet und `affiliate: true` gesetzt ist |

## Konventionen

- Ein Agent = eine Markdown-Datei mit Zweck, Eingabe/Ausgabe-Format und Vorgehen.
- `/agents/reviews/` sammelt die Ausgaben von Schritt 3 und 5 pro Artikel-Slug — nie
  überschreiben, sondern bei erneuter Prüfung mit Datum versehen fortschreiben.
