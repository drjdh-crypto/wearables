# /agents

Definitionen für unterstützende Arbeits-Agents, die bei Recherche, Faktencheck und Redaktion
helfen. Diese sind Werkzeuge für die Content-Produktion — nicht zu verwechseln mit den
[Personas](../personas/README.md), die als sichtbare Artikel-„Stimmen" auftreten (auch wenn
die Personas in Schritt 3 und 4 der Pipeline unten aktiv mitarbeiten).

## Handy-Workflow

Der gesamte Redaktionsprozess ist so gebaut, dass er ausschließlich über Nachrichten an mich
läuft — nie über die GitHub-Oberfläche, nie über Pull Requests oder Merges. Drei Befehle
reichen für den kompletten Zyklus von Idee bis Veröffentlichung:

| Befehl | Tut | Doku |
|---|---|---|
| „Führe die Redaktions-Pipeline für Thema X aus" | Recherche → Draft → Quality-Gate → Persona-Stimmen → Review-Übergabe, committet + pusht direkt auf `main`, gibt am Ende die Entwurfs-URL(s) aus | siehe unten, „Die Redaktions-Pipeline" |
| „Status" | Listet alle Artikel mit Zustand (Entwurf/veröffentlicht) und URL | [`commands/status.md`](commands/status.md) |
| „Gib [id] frei" | Prüft Quellen-Diversität, setzt `entwurf: false`, committet + pusht | [`commands/freigabe.md`](commands/freigabe.md) |

**Warum Pushen unbedenklich ist:** Entwürfe sind über `entwurf: true` unsichtbar — kein
Listing auf Startseite/Cluster-Seite, keine öffentliche Artikel-Route, kein Sitemap-/Feed-
Eintrag (Content-Collection-Filter `!data.entwurf`, siehe `CLAUDE.md`). Ein Push auf `main`
macht also nichts live sichtbar, außer der eigens dafür gebauten, unauffindbaren
Vorschau-Route `/entwurf/<id>/` (siehe unten). Direkt auf `main` zu pushen ist hier deshalb der
richtige Weg, kein Risiko — ein Pull-Request-Umweg würde nur Reibung erzeugen, ohne
zusätzliche Sicherheit zu bringen, solange die Freigabe-Regel unten (kein Schritt setzt
`entwurf: false` außer dem expliziten Befehl) eingehalten wird.

### Hosting

Live auf **Cloudflare Pages**, Git-verbunden mit `drjdh-crypto/wearables` (Branch `main` →
Production, Build-Befehl `npm run build`, Ausgabe `dist`, kein Adapter/Functions nötig — die
Seite ist komplett statisch). Jeder Push auf `main` deployed automatisch.

**Basis-URL:** `https://wearables.pages.dev` — als `DEFAULT_SITE_URL` in
`agents/pipeline/scripts/status.mjs` hinterlegt, damit „Status" und die
Pipeline-/Freigabe-Ausgabe immer vollständige, tappbare Links liefern.

**Bekannte Falle:** Die Git-Verbindung kann sich lösen (GitHub-App-Berechtigung entzogen),
ohne dass das Cloudflare-Projekt selbst „disconnected" meldet — Symptom: neue Pushes lösen
keinen Build aus, die Seite bleibt auf einem alten Stand stehen, obwohl im Cloudflare-Dashboard
unter „Git repository" weiterhin das Repo eingetragen ist. Fix (nur der Mensch kann das, da es
GitHub-Kontozugriff braucht): github.com → Settings → Applications → Installed GitHub Apps →
Cloudflare Pages → Repository-Zugriff prüfen/`wearables` freigeben → Save. Falls danach immer
noch kein neuer Build kommt: einen neuen Commit pushen (z. B. `git commit --allow-empty`), um
den Webhook erneut anzustoßen.

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
| 5. Review-Übergabe | [`pipeline/05-review-uebergabe.md`](pipeline/05-review-uebergabe.md) | Kompakte Quellen-Checkliste + `offenePunkte` im Frontmatter, Push auf `main`, Entwurfs-URL(s) ausgeben → `/agents/reviews/<slug>-checkliste.md`, `entwurf: true` bleibt |

**Aufruf:** „Führe die Redaktions-Pipeline für Thema X aus" — arbeitet die fünf Schritte in
Reihenfolge ab, mit `<slug>` aus dem Themennamen abgeleitet. Jeder Schritt baut auf der
Ausgabedatei des vorigen auf; kein Schritt überspringt die Prüfung des vorigen. Der Lauf endet
immer mit einem Push auf `main` und der Ausgabe der `/entwurf/<id>/`-URL(s) — siehe
„Handy-Workflow" oben zur Hosting-Voraussetzung dafür.

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

## Entwurfs-Vorschau (`/entwurf/<id>/`)

Jeder Artikel mit `entwurf: true` wird zusätzlich unter `/entwurf/<id>/` gebaut
(`src/pages/entwurf/[slug].astro`) — mit `noindex,nofollow`, ohne Eintrag in
Navigation/Sitemap/Feed (Letztere existieren im Projekt noch nicht; falls sie hinzukommen,
müssen sie `/entwurf/*` ausschließen) und ohne Sprachumschalter (die Seite existiert nur in der
Artikelsprache, nicht als Übersetzungs-Set). Erreichbar ausschließlich über die direkte URL.

Layout wie ein echter Artikel (gleiche Komponenten: Hero-Chart, Kernaussagen-Box,
Inhaltsverzeichnis, Persona-Block, Quellenverzeichnis), ergänzt um einen mobilen `ReviewBlock`
am Ende:

- jede Quelle als große, antippbare Karte (DOI-/PMID-/URL-Link) mit Kernbehauptung und
  Studientyp — kein Scrollen zu einer separaten Fußnotenliste nötig
- `offenePunkte` aus dem Artikel-Frontmatter (befüllt in Schritt 5) als kompakte Liste

Ziel: die komplette Quellenprüfung soll durch reines Scrollen auf dem Handy möglich sein, ohne
weitere Tabs oder den Rechner.

## Nicht verhandelbare Leitplanken

- **Quellenverifikation ist Pflicht, nicht optional.** Eine DOI, die sich nicht gegen Crossref
  auflösen lässt oder deren Titel/Jahr nicht passt, wird verworfen — nie korrigiert, nie
  geraten, nie durch eine „ähnliche" DOI ersetzt.
- **Kein Pipeline-Schritt setzt `entwurf: false`.** Das geht ausschließlich über den expliziten
  Befehl „Gib [id] frei" (`/agents/commands/freigabe.md`), der vorher zwingend
  `validate-quellen.mjs` grün sehen muss.
- **Direkt auf `main`, nie über Pull Request oder Merge.** Entspricht der Arbeitsweise „nur per
  Befehl, nie über die GitHub-Oberfläche" — siehe „Handy-Workflow" oben, warum das hier
  unbedenklich ist.
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
- `/agents/pipeline/` = die fünf sequenziellen Schritte eines Recherche-Durchlaufs;
  `/agents/commands/` = eigenständige Befehle außerhalb der Pipeline (Status, Freigabe);
  `/agents/pipeline/scripts/` = die dazugehörigen Node-Skripte (keine Abhängigkeiten nötig).
- `/agents/reviews/` sammelt die Ausgaben von Schritt 3 und 5 pro Artikel-Slug — nie
  überschreiben, sondern bei erneuter Prüfung mit Datum versehen fortschreiben.
