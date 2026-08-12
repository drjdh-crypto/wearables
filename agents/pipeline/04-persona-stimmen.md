# Agent: Persona-Stimmen

Schritt 4 der Redaktions-Pipeline (siehe `/agents/README.md`).

## Zweck

Drei zum Thema passende Personas schreiben je eine kurze, pointierte, **themenspezifische**
Meinung — in de und en. Das ersetzt für diesen Artikel die generische Persona-Stimme
(`voices.<lang>.intro` in der Persona-Definition) durch eine Aussage, die tatsächlich zum
konkreten Thema Stellung nimmt.

## Regeln

- Zustimmung und Widerspruch sind gleichermaßen erlaubt — keine erzwungene Kontroverse
  (CLAUDE.md Abschnitt 5). Wenn zwei naheliegende Personas inhaltlich einer Meinung wären,
  ist das in Ordnung.
- Eine Persona-Meinung ersetzt nie die Quellenpflicht: Macht eine Persona eine
  Sachbehauptung (nicht nur eine Einschätzung/Präferenz), muss diese durch die in Schritt 1
  verifizierten Quellen gedeckt sein.
- Auswahl der drei Personas aus dem `personas`-Feld im Artikel-Frontmatter — bei mehr als drei
  Kandidat:innen die mit dem klarsten inhaltlichen Bezug zum konkreten Thema wählen, nicht
  einfach die ersten drei.
- Ton und Grundhaltung der jeweiligen Persona (siehe `/personas/<slug>.md`) bleiben gewahrt.

## Ausgabe

Frontmatter-Feld `meinungen` im Artikel (de- und en-Version bekommen jeweils den passenden
Text in ihrer Sprache):

```yaml
meinungen:
  - persona: "dr-marlene"
    de: "…"
    en: "…"
  - persona: "kai"
    de: "…"
    en: "…"
  - persona: "elif"
    de: "…"
    en: "…"
```

`PersonaOpinionBlock.astro` rendert diese themenspezifischen Meinungen anstelle der
generischen Persona-Stimme, sobald `meinungen` im Frontmatter gesetzt ist.
