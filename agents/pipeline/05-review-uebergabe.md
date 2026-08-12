# Agent: Review-Übergabe

Schritt 5 der Redaktions-Pipeline (siehe `/agents/README.md`) — der letzte Schritt vor der
menschlichen Freigabe.

## Zweck

Die menschliche Freigabe vorbereiten, ohne sie zu ersetzen oder vorwegzunehmen.

## Regeln

- `entwurf: true` bleibt in beiden Artikeldateien gesetzt. Die Pipeline setzt niemals selbst
  `entwurf: false` — das ist ausschließlich eine menschliche Entscheidung.
- Es wird eine kompakte Checkliste erstellt, die eine schnelle Gegenprüfung ermöglicht: Wer sie
  liest, muss jede im Artikel verwendete Quelle in wenigen Minuten nachvollziehen können, ohne
  den ganzen Artikel und alle Studien selbst zu lesen.

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
Quellenlage das nicht hergibt.)

- …

## Quality-Gate-Ergebnis
Siehe /agents/reviews/<slug>.md — Kurzstatus: …
```

Nach Prüfung durch den Menschen: `entwurf: false` manuell setzen. Bis dahin bleibt der Artikel
unveröffentlicht und wird nirgends verlinkt gelistet (Content-Collection-Filter `!data.entwurf`).
