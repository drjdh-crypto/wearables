# /personas

Definitionen der ~10 wiederkehrenden KI-Personas, die als Artikel-Autor:in oder in
Meinungs-/Erfahrungsboxen auftreten. Regeln zur Kennzeichnungspflicht und zum Umgang mit
widersprechenden Einschätzungen stehen in [`CLAUDE.md`](../CLAUDE.md) Abschnitt 3.

## Dateiformat

Eine Datei pro Persona: `<slug>.md`, Frontmatter + Kurzbeschreibung:

```yaml
---
slug: "dr-somnia"
name: "Dr. Somnia"
role: "Schlafmedizinerin"
kennzeichnung: "KI-Persona — keine reale Person"
perspektive: >
  Konservativ, evidenzorientiert an klinischen Leitlinien (AASM). Skeptisch gegenüber
  Consumer-Wearables als Diagnosewerkzeug, befürwortet sie als Alltags-Trend-Tool.
tendenz_zu_widerspruch:
  - "coach-pulse"     # Slugs anderer Personas, mit denen häufiger fachlich divergiert wird
  - "der-biohacker"
---
Freitext: Tonfall, typische Formulierungen, Themenschwerpunkte, No-Gos (z. B. keine
Diagnosen aussprechen).
```

## Liste der Personas

Siehe die einzelnen `<slug>.md`-Dateien in diesem Ordner für Details. Jede Persona deckt eine
andere Perspektive auf Schlaf-/Recovery-Tracking ab (Medizin, Sport, Technik, Kritik,
Alltag/Familie, Chronobiologie, Langzeitnutzung, Betroffenenperspektive, Minimalismus,
Selbstoptimierung), damit Artikel unterschiedliche, plausible Blickwinkel abbilden können,
ohne künstlichen Streit zu erzeugen.

## Regeln beim Einsatz

- Immer sichtbar als KI-Persona kennzeichnen (Autor:innen-Box + Frontmatter `author`).
- Eine Persona darf einer anderen widersprechen, muss aber nicht — Widerspruch nur, wenn er
  inhaltlich getragen ist (unterschiedliche Prioritäten/Evidenzinterpretation), nicht als
  Stilmittel.
- Persona-Meinung ersetzt nie die Quellenpflicht aus `CLAUDE.md` Abschnitt 1.
- Neue Personas nur anlegen, wenn sie eine tatsächlich neue Perspektive abdecken — keine
  Persona-Inflation.
