# /agents

Definitionen/Prompts für unterstützende Arbeits-Agents, die bei Recherche, Faktencheck und
Redaktion helfen. Diese sind Werkzeuge für die Content-Produktion — nicht zu verwechseln mit
den [Personas](../personas/README.md), die als sichtbare Artikel-„Stimmen" auftreten.

## Geplante Agents

| Agent | Aufgabe |
|-------|---------|
| `research-agent` | Sucht Studien/DOIs zu einem Thema, prüft peer-reviewed vs. Preprint |
| `fact-check-agent` | Gleicht Behauptungen im Artikel-Body gegen `sources` im Frontmatter ab |
| `citation-agent` | Formatiert Quellenangaben gemäß Zitierformat aus [`CLAUDE.md`](../CLAUDE.md) Abschnitt 2 |
| `affiliate-audit-agent` | Prüft, ob alle Affiliate-Links gekennzeichnet und `affiliate: true` gesetzt ist |
| `persona-consistency-agent` | Prüft, ob Persona-Ton/Perspektive zur Definition in `/personas` passt |

## Konventionen

- Ein Agent = eine Markdown-Datei mit Zweck, Eingabe/Ausgabe-Format und Prompt-Gerüst.
- Agents dürfen nie die Evidenzpflicht oder Kennzeichnungspflichten aus `CLAUDE.md` umgehen —
  sie sind Prüfwerkzeuge dafür, kein Weg, sie zu unterlaufen.
- Noch keine Agent-Definitionen angelegt; dieser Ordner ist vorbereitet für die
  Automatisierung des Redaktionsworkflows.
