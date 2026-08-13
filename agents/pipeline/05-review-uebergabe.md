# Agent: Review-Übergabe

Schritt 5 der Redaktions-Pipeline (siehe `/agents/README.md`) — der letzte Schritt vor der
menschlichen Freigabe, und der Abschluss jedes Pipeline-Laufs.

## Zweck

Die menschliche Freigabe vorbereiten, ohne sie zu ersetzen oder vorwegzunehmen — und den
Artikel für die Prüfung unterwegs erreichbar machen (`/entwurf/<id>/`, siehe
`src/pages/entwurf/[slug].astro`).

## Regeln

- `entwurf: true` bleibt in allen Artikeldateien gesetzt. Die Pipeline setzt niemals selbst
  `entwurf: false` — das ist ausschließlich der Befehl „Gib [id] frei"
  (`/agents/commands/freigabe.md`), nie ein automatischer Schritt.
- `offenePunkte` im Artikel-Frontmatter befüllen (Übernahme aus dem Quality-Gate-Ergebnis und
  den in Schritt 2 dokumentierten Lücken) — das ist, was im mobilen Review-Block auf
  `/entwurf/<id>/` erscheint.
- Es wird eine kompakte Checkliste erstellt, die eine schnelle Gegenprüfung ermöglicht: Wer sie
  liest, muss jede im Artikel verwendete Quelle in wenigen Minuten nachvollziehen können, ohne
  den ganzen Artikel und alle Studien selbst zu lesen.
- **Abschluss jedes Laufs:** Alle Änderungen des gesamten Durchlaufs (Schritt 1–5) sind
  committet und **auf `main` gepusht** — Entwürfe sind über `entwurf: true` ohnehin unsichtbar
  (kein Listing, kein Index, siehe `CLAUDE.md`), das Pushen macht also nichts öffentlich
  Sichtbares, nur die `/entwurf/`-Vorschau erreichbar. Kein Pull Request, kein Merge — direkt
  auf `main`.
- Nach dem Push: die fertige Entwurfs-URL ausgeben (`https://<SITE_URL>/entwurf/<id>/`, oder
  den reinen Pfad `/entwurf/<id>/`, wenn `SITE_URL` nicht bekannt ist — siehe
  `/agents/README.md`, „Handy-Workflow"). Bei mehreren Sprachversionen: eine URL pro Version.

## Ausgabe

`/agents/reviews/<slug>-checkliste.md` — Struktur:

```markdown
# Review-Checkliste: <Artikeltitel>

Status: entwurf: true — wartet auf menschliches Go.

## Quellen

- [ ] Autor et al. (Jahr) — Kernbefund in einem Satz.
      DOI: https://doi.org/…
- [ ] …

## Chart-Datenquelle

- [ ] …

## Bekannte offene Fragen im Artikel
(Stellen, an denen der Draft-Agent bewusst keine Behauptung aufgestellt hat, weil die
Quellenlage das nicht hergibt — identisch mit `offenePunkte` im Artikel-Frontmatter.)

- …

## Quality-Gate-Ergebnis
Siehe /agents/reviews/<slug>.md — Kurzstatus: …
```

Plus, als letzte Aktion des Laufs: Push auf `main`, dann die Entwurfs-URL(s) an den Menschen
ausgeben. Freigabe erst nach explizitem „Gib [id] frei" (`/agents/commands/freigabe.md`); bis
dahin bleibt der Artikel unveröffentlicht.
