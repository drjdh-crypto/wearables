# Quellenbewertung — der Quellen-Relevanzindex

Jede Quelle in `data/quellen/<slug>.json` (und darüber im Artikel-Frontmatter) bekommt einen
berechneten Score von 0–100 plus Teilwerte und eine Begründung. Zweck: eine schnelle,
konsistente Einschätzung der Belastbarkeit einer Quelle, zusätzlich zur (weiterhin
verpflichtenden) manuellen Prüfung in Schritt 1 der Redaktions-Pipeline
(`agents/pipeline/01-recherche.md`). Der Score ersetzt keine der bestehenden Diversitäts- und
Verifikationsregeln — er ergänzt sie.

Skript: `agents/pipeline/scripts/score-quellen.mjs` · Aufruf:
`node agents/pipeline/scripts/score-quellen.mjs data/quellen/<slug>.json` (ohne Argument: alle
Dateien unter `data/quellen/*.json`).

## Wo der Score sichtbar ist

- **`SourcesBox`** (öffentliche Artikelseite): zeigt Studientyp und Stichprobengröße `n`,
  **nicht** die Rohpunktzahl — der Score ist ein internes Priorisierungs-/Prüfwerkzeug, keine
  Aussage, die Lesenden ohne Kontext zur Gewichtung präsentiert werden sollte.
- **`ReviewBlock`** (mobile Entwurfs-Vorschau, `/entwurf/<slug>/`, nie öffentlich): zeigt Score
  und vollständige Begründung je Quelle, für das menschliche Gegenprüfen vor „Gib frei".

## Gewichtung (Summe = 100 Punkte)

| Achse | Max. Punkte | Warum diese Reihenfolge |
|---|---|---|
| Studientyp (Evidenzpyramide) | 35 | Größter Einfluss auf Belastbarkeit einer Aussage — eine Meta-Analyse widerlegt eine Einzelstudie methodisch, nicht umgekehrt. |
| Zitationsrate (altersnormalisiert) | 25 | Zweitstärkstes Signal: wie stark hat sich eine Arbeit in der Fachwelt durchgesetzt, unabhängig davon, wie alt sie ist. |
| Stichprobengröße `n` | 15 | Größere Stichproben senken das Risiko von Zufallsbefunden — aber weniger entscheidend als Studiendesign/Rezeption. |
| Aktualität (Publikationsjahr) | 15 | Gleich gewichtet wie `n`: Wearable-Technik entwickelt sich schnell, aber ein 2004er-Befund zur Schlafarchitektur ist nicht automatisch überholt. |
| Journal-/Venue-Qualität | 10 | Niedrigstes Gewicht — bewusst, siehe Begründung unten. |

### Studientyp (0–35 Punkte)

Nach Evidenzpyramide: Meta-Analyse/systematisches Review > RCT > Kohorte/Querschnitt >
narrative Übersichtsarbeit > Fallserie/Einzelfall > sonstige (institutionell/Herstellerangabe).

| Studiendesign | Punkte |
|---|---|
| Meta-Analyse / systematisches Review | 35 |
| RCT (randomisiert-kontrollierte Studie) | 27 |
| Kohortenstudie | 18 |
| Querschnitts-/Vergleichsstudie | 16 |
| Narrative Übersichtsarbeit (nicht-systematisch) | 12 |
| Fallserie/Einzelfall | 6 |
| Sonstige (institutionell, Herstellerangabe, Methodenpapier ohne eigenes Design) | 8 |

**Warum eine narrative Übersichtsarbeit unter Kohorte/Querschnitt steht, nicht darüber:** Das
widerspricht der Alltagsintuition („ein Review fasst doch mehr zusammen, muss also mehr wert
sein"). Der Auftrag verlangt aber explizit „Meta-Analyse/**systematisches** Review" an der
Spitze — eine narrative Übersichtsarbeit hat kein reproduzierbares Suchprotokoll, ist anfällig
für Selektionsbias durch die Autor:innen und zählt in gängigen Evidenzhierarchien (z. B. Oxford
CEBM) deshalb nicht zu den obersten Stufen. Sie bleibt trotzdem wertvoll — deshalb 12 von 35
Punkten, nicht 0 —, aber methodisch unter einer sauber durchgeführten Primärstudie.

**Herleitung, wenn `studiendesign` fehlt:** Ältere Einträge oder Dateien, die vor Einführung
dieses Felds recherchiert wurden, haben `studiendesign` noch nicht gesetzt. `score-quellen.mjs`
schätzt dann konservativ (siehe `inferStudiendesign()` im Skript: `ist_uebersichtsarbeit: true`
→ Meta-Analyse, `institutional`/`manufacturer` → sonstige, kein `n` → narrative
Übersichtsarbeit, sonst Kohorte) und markiert das explizit in der Begründung als geschätzt.
Ab sofort sollte Schritt 1 (Recherche) `studiendesign` direkt mitliefern, damit diese Schätzung
nicht mehr nötig ist.

### Zitationsrate (0–25 Punkte)

`zitationen ÷ max(1, aktuelles_jahr − jahr)` — Zitate aus OpenAlex (`cited_by_count`), bereits
Teil des bestehenden Recherche-Schemas. Altersnormalisiert, damit eine gute, aber neue Arbeit
nicht strukturell gegen eine alte, oft zitierte Arbeit verliert.

| Rate (Zitate/Jahr) | Punkte |
|---|---|
| ≥ 100 | 25 |
| ≥ 50 | 20 |
| ≥ 20 | 15 |
| ≥ 5 | 10 |
| ≥ 1 | 5 |
| < 1 | 2 |
| Keine Zitationsdaten | 0 (mit Hinweis, kein Qualitätsmangel — üblich bei nicht in OpenAlex indizierten Referenzwerken wie StatPearls) |

### Stichprobengröße `n` (0–15 Punkte)

| n | Punkte |
|---|---|
| ≥ 1000 | 15 |
| ≥ 300 | 12 |
| ≥ 100 | 9 |
| ≥ 30 | 6 |
| < 30 | 3 |
| `null` (keine eigene Kohorte) | 0 |

### Aktualität (0–15 Punkte)

| Alter (Jahre) | Punkte |
|---|---|
| 0–2 | 15 |
| 3–5 | 12 |
| 6–10 | 8 |
| 11–15 | 4 |
| > 15 | 1 |

### Journal-/Venue-Qualität (0–10 Punkte)

Über OpenAlex-Journalmetriken (`summary_stats.2yr_mean_citedness`, ein offenes, nicht-
proprietäres Zwei-Jahres-Zitationsmittel je Venue). **Explizit kein Clarivate Journal Impact
Factor** — der ist proprietär und nicht frei abrufbar, wie im Auftrag gefordert.

| 2yr_mean_citedness | Punkte |
|---|---|
| ≥ 6 | 10 |
| ≥ 3 | 7 |
| ≥ 1,5 | 5 |
| ≥ 0,5 | 3 |
| < 0,5 | 1 |
| Kein Journal (Referenzwerk) | 0 |
| Metrik nicht abrufbar (Fehler) | 0, mit Hinweis „kein echtes 'niedrige Qualität'" |

**Scimago SJR wurde geprüft und nicht eingebaut:** Scimago veröffentlicht seine SJR-Werte nur
als jährlichen CSV-Download, kein frei nutzbares Live-API ohne Konto/Lizenz. Deshalb bleibt
diese Achse vorerst auf OpenAlex beschränkt — das ist auch der Grund für das niedrigste
Gewicht dieser Achse: die verfügbare freie Kennzahl ist eine brauchbare, aber schwächere
Näherung an „Journal-Qualität" als ein etablierter, aber proprietärer Impact Factor wäre.

### Preprint-Malus

`-10 Punkte`, wenn `preprint: true`. Kein harter Ausschluss (Preprints können relevant und
vorläufig-verwendbar sein, solange sie im Artikel als „Preprint, nicht begutachtet"
gekennzeichnet werden), aber ein spürbarer Abzug, weil das Fehlen von Peer-Review ein reales
Qualitätsrisiko ist.

### Retraction-Check (harter Ausschluss, keine Abwertung)

Über Crossref (`GET https://api.crossref.org/works/{doi}`, Feld `update-to` mit
`type: "retraction"` — Crossref bindet seit 2023 Retraction-Watch-Daten ein). Ist eine Quelle
zurückgezogen: **Score wird auf 0 gezwungen**, `zurueckgezogen: true` gesetzt, und
`validate-quellen.mjs` (Regel 6) bricht beim nächsten Lauf hart ab, bis die Quelle aus der
Liste entfernt wurde. Das ist bewusst kein bloßer Punktabzug — eine zurückgezogene Arbeit ist
keine „schwache", sondern eine ungültige Quelle.

## Grenzen dieser Bewertung

- **Journal-Qualität ist heute oft 0, nicht weil das Journal schwach ist, sondern weil
  OpenAlex nicht erreichbar war.** Am 12./13.08.2026 hat OpenAlex sein API-Modell auf ein
  Tagesbudget umgestellt; während der Entwicklung dieses Skripts war das Budget mehrfach
  erschöpft (`429 Insufficient budget`). Alle 8 Quellen in `data/quellen/schlafphasen.json`
  zeigen deshalb aktuell `journal: 0` mit dem Hinweis „nicht verfügbar" statt eines echten
  Werts — ein Nachlauf (`node agents/pipeline/scripts/score-quellen.mjs`) ist nötig, sobald
  OpenAlex wieder antwortet, um die tatsächlichen Journal-Scores zu erhalten. Bis dahin sind
  alle acht Gesamt-Scores potenziell bis zu 10 Punkte zu niedrig.
- **`studiendesign` ist für ältere Einträge geschätzt, nicht redaktionell gesetzt** (siehe
  oben) — Schätzung ist konservativ, aber eine echte Fehlklassifikation (z. B. eine RCT, die
  als „Kohorte" geschätzt wird, weil sie nur `n` aber kein Design-Feld hat) ist möglich. Bei
  Zweifel: `studiendesign` manuell in der Quellen-JSON prüfen/korrigieren.
- **Zitationszahlen sind eine Momentaufnahme** (Feld `geprueft_am`), keine Live-Kennzahl — der
  Score veraltet mit der Zeit und sollte bei jedem Artikel-Review neu berechnet werden, nicht
  nur einmalig bei der Recherche.
- **Der Score ist kein Ersatz für inhaltliches Lesen.** Ein hoher Score (großes n, aktuell,
  gut zitiert, Meta-Analyse) sagt nichts darüber, ob die Studie tatsächlich das behauptet, was
  im Artikel zitiert wird — das bleibt die Aufgabe von Schritt 1 (Recherche) und dem
  menschlichen Review im `ReviewBlock`.
- **Die Gewichtung selbst ist eine editorische Entscheidung, kein Naturgesetz.** Insbesondere
  die Einordnung „narrative Übersichtsarbeit unter Kohorte/Querschnitt" (siehe oben) ist
  diskutabel und bewusst offen dokumentiert, statt sie stillschweigend im Code zu verstecken.

## Beispiel: `data/quellen/schlafphasen.json`

Nach dem Lauf vom 13.08.2026 (Journal-Achse wegen OpenAlex-Ausfall bei allen auf 0):

| Quelle | Studiendesign | Score |
|---|---|---|
| Lee YJ et al. 2025 (JCSM, Meta-Analyse) | meta-analyse | 77 |
| Ohayon et al. 2004 (Meta-Analyse) | meta-analyse | 76 |
| Boulos et al. 2019 (Meta-Analyse) | meta-analyse | 73 |
| Chinoy et al. 2021 (Laborvergleich) | querschnitt | 54 |
| Cajochen et al. 2024 (Kohorte) | kohorte | 55 |
| Lee T et al. 2023 (Validierungsstudie) | querschnitt | 49 |
| de Zambotti et al. 2019 (narrative Übersicht) | review | 40 |
| StatPearls (Patel et al. 2024) | sonstige | 23 |

Keine der acht Quellen ist zurückgezogen (Crossref-Check bestanden).
