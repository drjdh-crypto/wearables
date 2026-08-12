# Quality-Gate-Review: „Schlafphasen erklärt"

Geprüfte Fassung: `content/articles/schlafphasen-erklaert.md` (de, Referenz) nach Schritt 2
der Redaktions-Pipeline. Datum: 2026-08-12.

## Dr. Marlene — Studienqualität

- **Finding:** Chinoy et al. (2021) hat mit n=34 eine kleine Stichprobe; die Zahl stand im
  Draft nur beiläufig in Klammern, ohne dass die Größenordnung eingeordnet wurde.
  → **Fix:** Text ergänzt um „(eine für Laborstudien übliche, aber kleine Stichprobe)" direkt
  bei der ersten Nennung.
- **Finding:** Die im Artikelkopf genannte Prozentverteilung (5/45/25/25%) stammt aus einer
  institutionellen Sekundärquelle (StatPearls), nicht aus den beiden zitierten Meta-Analysen
  selbst — das stand im Draft nur im letzten Abschnitt, an prominenter erster Stelle im Text
  aber nicht erkennbar.
  → **Fix:** Hinweis mit Vorwärtsverweis direkt an der ersten Nennung der Prozentzahlen
  ergänzt, nicht erst am Artikelende.
- **Finding:** Zwei der acht Quellen (de Zambotti et al., 2019; Menghini et al., 2021) teilen
  sich einen Senior-Autor (de Zambotti). Die Aussage „es fehlt ein Validierungsstandard" ist
  damit nicht durch zwei vollständig unabhängige Forschungsgruppen bestätigt.
  → **Nicht behoben, Begründung:** Für ein noch junges Forschungsfeld mit wenigen aktiven
  Arbeitsgruppen ist das eine realistische Einschränkung, kein Zeichen mangelnder Sorgfalt bei
  der Quellenauswahl. Der Artikel behauptet an dieser Stelle auch nichts über den Konsens der
  gesamten Forschungscommunity, sondern referiert eine konkrete Methodenarbeit. Für eine
  spätere Überarbeitung wäre eine dritte, unabhängige Quelle zum selben Punkt trotzdem
  wünschenswert.

## Tobias — Praxisrelevanz

- **Finding:** Der Draft blieb rein beschreibend (Physiologie + Genauigkeits-Landschaft) ohne
  jede Brücke zur Frage „was mache ich mit dieser Information". Für einen
  Grundlagen-/Säulen-Artikel ist das noch akzeptabel, aber eine kurze praktische Einordnung
  wäre trotzdem hilfreich und ist durch die zitierte Evidenz bereits gedeckt (Schlaf/Wach
  zuverlässiger als Phasen-Unterscheidung).
  → **Fix:** Neuer Abschnitt „Was heißt das für die Praxis?" ergänzt — Faustregel: Trend über
  mehrere Nächte und Gesamtschlafzeit wichtiger nehmen als der exakte Tiefschlafwert einer
  einzelnen Nacht. Keine neue Behauptung, nur eine Zusammenfassung der bereits belegten Punkte.

## Dr. Yusuf — Klinische Korrektheit

- **Finding:** Der Artikel unterscheidet zwar durchgehend sauber zwischen Consumer-Wearables
  und Polysomnographie, sagt aber nirgends explizit, dass Consumer-Geräte keine
  Schlafstörungs-Diagnostik ersetzen — ein Leser könnte das aus dem Kontext erschließen, muss
  es aber nicht.
  → **Fix:** Satz ergänzt: „Für eine medizinische Einschätzung — etwa bei Verdacht auf eine
  Schlafstörung — ersetzt keines dieser Consumer-Geräte eine Untersuchung im Schlaflabor;
  Polysomnographie bleibt der diagnostische Goldstandard […]." Keine neue Quelle nötig, da es
  sich um eine Grenzziehung handelt, die aus den bereits zitierten Quellen (PSG als
  Referenzmethode) folgt, keine neue Sachbehauptung ist.
- Keine weiteren Findings — keine Selbstdiagnose-Suggestion, keine überzogenen
  Wirksamkeitsaussagen zu einzelnen Produkten.

## Ben — Verständlichkeit

- **Finding:** „Sensitivität" wird verwendet, ohne dass klar wird, was der Wert bedeutet
  (Anteil richtig erkannter Ereignisse).
  → **Fix:** Kurzerklärung direkt bei erster Verwendung ergänzt.
- **Finding:** „Macro-F1" ist Fachjargon aus dem maschinellen Lernen, für den Kontext nicht
  selbsterklärend.
  → **Fix:** Kurzerklärung ergänzt („zusammenfassendes Genauigkeitsmaß zwischen 0 und 1").
- Restlicher Text (PSG, NREM/REM, Zyklus) wurde bereits im Draft beim ersten Auftreten erklärt
  — keine weiteren Findings.

## Status

Alle vier Findings-Kategorien mit konkreten Textänderungen behoben (Dr. Marlene: 1 von 2
Findings behoben, 1 begründet nicht behoben; Tobias, Dr. Yusuf, Ben: jeweils vollständig
behoben). Die englische Fassung (`schlafphasen-erklaert-en.md`) wurde mit denselben
inhaltlichen Fixes nachgezogen, nicht wortwörtlich übersetzt.

Offener Punkt für eine spätere Runde: dritte unabhängige Quelle zum
„fehlender Validierungsstandard"-Befund, um die Autor:innen-Überschneidung zwischen
de Zambotti et al. (2019) und Menghini et al. (2021) auszugleichen.

## Nachtrag: Retroaktive Diversitätsprüfung (2026-08-12)

Nach Erweiterung von Schritt 1 um harte Diversitätsregeln (siehe
`/agents/pipeline/01-recherche.md`) wurde diese Quellenliste erneut geprüft:
`node agents/pipeline/scripts/validate-quellen.mjs data/quellen/schlafphasen.json` schlug zunächst
fehl — Journal „Sleep" kam 3× vor (Ohayon 2004, Menghini 2021, Chinoy 2021), erlaubt sind
maximal 2.

**Auflösung:** Menghini et al. (2021) entfernt, ersetzt durch Lee YJ et al. (2025, Journal of
Clinical Sleep Medicine), eine aktuellere Meta-Analyse (24 Studien, 798 Teilnehmende) zu
systematischen Verzerrungen bei Gesamtschlafzeit/Schlafeffizienz/Latenz/WASO. Das löst dabei
gleich zwei offene Punkte auf einmal: Journal-Häufung behoben (Sleep jetzt 2×) und die oben
dokumentierte Autor:innen-Überschneidung zwischen de Zambotti und Menghini entfällt, weil
Menghini nicht mehr Teil des Sets ist. Validierung läuft danach fehlerfrei durch (siehe
`/agents/reviews/schlafphasen-checkliste.md` für den aktuellen Quellenstand).

Artikeltext (de + en) entsprechend angepasst: Menghini-Zitat ersetzt durch den neuen Befund,
zusätzlich als eigener Absatz in „Was Consumer-Wearables davon wirklich messen können"
eingebaut (Zahlen zu TST-/Effizienz-Unterschätzung ergänzen die bestehenden
Phasen-Klassifikations-Zahlen, statt sie zu duplizieren).
