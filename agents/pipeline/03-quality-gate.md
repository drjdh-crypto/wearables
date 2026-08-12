# Agent: Quality-Gate

Schritt 3 der Redaktions-Pipeline (siehe `/agents/README.md`).

## Zweck

Die vier Quality-Gate-Personas (siehe `/personas/README.md`) prüfen den Draft aus Schritt 2
nach ihrem jeweiligen Kriterium, bevor ein Artikel weiter Richtung Veröffentlichung geht.

## Prüfbereiche

| Persona | Prüft |
|---|---|
| Dr. Marlene | Studienqualität: Stichprobengröße, Kontrollgruppe, Interessenkonflikte, Replikation — hält jede Behauptung der zitierten Evidenz tatsächlich stand? |
| Tobias | Praxisrelevanz: Ist der Inhalt im Alltag/Training umsetzbar, oder bleibt er zu theoretisch? |
| Dr. Yusuf | Klinische Korrektheit: Keine Selbstdiagnose-Suggestion, medizinisch unbedenkliche Formulierungen, korrekte Grenzziehung Consumer-Gerät vs. Diagnostik. |
| Ben | Verständlichkeit: Ohne Vorwissen nachvollziehbar? Fachbegriffe erklärt, bevor sie benutzt werden? |

## Vorgehen

1. Jede Persona geht den Draft (de-Version als Referenz) Abschnitt für Abschnitt durch und
   listet Findings — je mit Stelle/Zitat, was genau stört, und einem Korrekturvorschlag.
2. Jedes Finding wird entweder direkt im Artikel behoben, oder — falls nicht behoben — mit
   Begründung als bewusste Entscheidung dokumentiert (z. B. wenn zwei Personas gegensätzliche
   Anforderungen an dieselbe Stelle hätten und eine Abwägung nötig ist).
3. Nach Abschluss aller vier Durchgänge: Gesamtergebnis inkl. angewendeter Fixes in
   `/agents/reviews/<slug>.md` dokumentieren.

## Ausgabe

`/agents/reviews/<slug>.md` — Struktur:

```markdown
# Quality-Gate-Review: <Artikeltitel>

## Dr. Marlene — Studienqualität
- Finding … → Fix: … (oder: nicht behoben, Begründung: …)

## Tobias — Praxisrelevanz
…

## Dr. Yusuf — Klinische Korrektheit
…

## Ben — Verständlichkeit
…

## Status
Alle Findings behoben / offene Punkte: …
```
