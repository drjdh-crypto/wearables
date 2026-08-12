# /personas

Definitionen der 10 festen KI-Personas, die als Meinungs-/Erfahrungsstimmen in Artikeln
auftreten (`PersonaOpinionBlock`-Komponente) und auf der Vorstellungsseite `/[lang]/personas/`
gelistet werden. Regeln zur Kennzeichnungspflicht stehen in [`CLAUDE.md`](../CLAUDE.md)
Abschnitt 5.

## Dateiformat

Eine Datei pro Persona: `<slug>.md`, geladen als Content Collection `personas`
(`src/content.config.ts`):

```yaml
---
slug: "dr-marlene"
name: "Dr. Marlene"
role: "Schlafforscherin"
quality_gate: true          # true = Persona fungiert als fachliche Prüfinstanz, siehe unten
grundhaltung: >
  Freitext, deutsch, editorial: worauf die Persona bei jedem Thema besteht.
konfliktlinien:
  - "kai"                    # Slugs anderer Personas, mit denen häufiger fachlich divergiert wird
  - "milan"
voices:
  de:
    tonfall: "Kurzbeschreibung des Sprachstils."
    intro: "Ein typischer, zitierfähiger Satz dieser Persona."
  en:
    tonfall: "..."
    intro: "..."
  es:
    tonfall: "(Platzhalter — Übersetzung ausstehend, Locale deaktiviert)"
    intro: "(Platzhalter — Übersetzung ausstehend, Locale deaktiviert)"
---
Charakterbeschreibung als Freitext (deutsch, editorisches Hintergrundmaterial — wird nicht
1:1 auf der mehrsprachigen Übersichtsseite ausgegeben, die nutzt `voices.<lang>`).
```

`voices.es` muss befüllt sein, auch wenn die Sprache aktuell deaktiviert ist (siehe
`/src/i18n/config.ts`) — entweder mit echter Übersetzung oder, solange keine vorliegt, mit dem
Platzhaltertext oben. Ein leeres `es`-Objekt bricht die Zod-Validierung.

## quality_gate: Was das bedeutet

Personas mit `quality_gate: true` sind keine Zensurinstanz, sondern ein Prüf-Framing: Ein
Artikel, der ihren fachlichen Bereich berührt, sollte ihrem Einwand *inhaltlich* standhalten,
bevor er veröffentlicht wird — ohne dass ihr möglicher Widerspruch erzwungen oder unterdrückt
wird (CLAUDE.md Abschnitt 5.3).

| Persona | Gate-Bereich |
|---|---|
| Dr. Marlene | Studienqualität / Evidenzstärke |
| Tobias | Praktische Umsetzbarkeit (HRV/Recovery-Empfehlungen) |
| Dr. Yusuf | Medizinische Unbedenklichkeit / keine Selbstdiagnose-Suggestion |
| Ben | Verständlichkeit ohne Vorwissen |

## Das Ensemble

| Slug | Name | Rolle | quality_gate |
|---|---|---|---|
| `dr-marlene` | Dr. Marlene | Schlafforscherin | ✅ |
| `tobias` | Tobias | Sportwissenschaftler (HRV/Recovery) | ✅ |
| `dr-yusuf` | Dr. Yusuf | Somnologe | ✅ |
| `kai` | Kai | Biohacker | – |
| `ingrid` | Ingrid | Sensorik-Ingenieurin | – |
| `sandra` | Sandra | Pragmatikerin (Vollzeitjob, Kinder) | – |
| `ben` | Ben | Einsteiger | ✅ |
| `franka` | Franka | Datenschützerin | – |
| `milan` | Milan | Triathlon-Coach | – |
| `elif` | Elif | Betroffene (Tracking-Stress/Orthosomnie) | – |

Die Slugs sind in `src/content.config.ts` als Enum hinterlegt (`PERSONA_SLUGS`) — ein Artikel
kann in seinem Frontmatter (`personas`) nur auf existierende Personas verweisen, das erzwingt
die Zod-Validierung beim Build.

## Regeln beim Einsatz

- Immer sichtbar als KI-Perspektive kennzeichnen: „KI-Perspektive: [Name]" (siehe
  `PersonaOpinionBlock`-Komponente und `CLAUDE.md` Abschnitt 5).
- Eine Persona darf einer anderen widersprechen, muss aber nicht — Widerspruch nur, wenn er
  inhaltlich getragen ist (`konfliktlinien` beschreibt typische, nicht zwingende Spannungen).
- Persona-Meinung ersetzt nie die Quellenpflicht aus `CLAUDE.md` Abschnitt 2.
- Neue Personas nur anlegen, wenn sie eine tatsächlich neue Perspektive abdecken — keine
  Persona-Inflation.
