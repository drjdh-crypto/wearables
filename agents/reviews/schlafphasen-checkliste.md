# Review-Checkliste: „Schlafphasen erklärt"

**Status:** `entwurf: true` in beiden Sprachversionen — wartet auf menschliches Go. Die
Pipeline setzt `entwurf: false` nie selbst (siehe `/agents/README.md`).

Betroffene Dateien: `content/articles/schlafphasen-erklaert.md` (de),
`content/articles/schlafphasen-erklaert-en.md` (en), `data/charts/schlafphasen-anteile.json`,
`data/quellen/schlafphasen.json`.

Diese Liste soll reichen, um jede Behauptung im Artikel in wenigen Minuten gegenzuprüfen, ohne
selbst alle acht Studien lesen zu müssen.

## Quellen

- [ ] **Ohayon et al. (2004)** — Meta-Analyse, 65 Studien, 3.577 gesunde Personen (5–102
      Jahre): REM-Anteil nimmt mit dem Alter ab, Stadium-1/2-Anteile nehmen zu.
      DOI: https://doi.org/10.1093/sleep/27.7.1255
- [ ] **Boulos et al. (2019)** — Meta-Analyse, 169 Studien, 5.273 gesunde Erwachsene: N2-,
      N3- und REM-Anteile bleiben über Erwachsenen-Dekaden weitgehend stabil, N1 steigt leicht.
      DOI: https://doi.org/10.1016/S2213-2600(19)30057-8
- [ ] **de Zambotti et al. (2019)** — Übersichtsarbeit: Consumer-Wearables messen über
      Herzfrequenz(-variabilität)/Hauttemperatur/Bewegung statt EEG, Validierungsstandards
      fehlen weitgehend.
      DOI: https://doi.org/10.1249/MSS.0000000000001947
- [ ] **Lee et al. (2023)** — 11 Tracker vs. PSG, n=75, 349.114 Epochen: Macro-F1 für
      Schlafphasen-Klassifikation zwischen 0,26 und 0,69, je nach Gerät.
      DOI: https://doi.org/10.2196/50983
- [ ] **Menghini et al. (2021)** — Methodenarbeit: kein einheitlicher Validierungsstandard für
      Consumer-Schlaftracker, erschwert Studienvergleiche.
      DOI: https://doi.org/10.1093/sleep/zsaa170
- [ ] **Cajochen et al. (2024)** — n=369, 6.064 PSG-Zyklen: mediane Zyklusdauer 96 Minuten,
      meist 3–4 Zyklen/Nacht, große individuelle Schwankung.
      DOI: https://doi.org/10.1016/j.sleh.2023.09.002
- [ ] **Chinoy et al. (2021)** — 7 Tracker vs. PSG, n=34 (klein): Schlaf/Wach-Sensitivität
      ≥0,93, Phasen-Sensitivität nur 0,49–0,76, Tendenz zu "Leichtschlaf"-Fehlklassifikation.
      DOI: https://doi.org/10.1093/sleep/zsaa291
- [ ] **Patel, Reddy, Shumway, Araujo (2024)** — StatPearls/NCBI Bookshelf (institutionell,
      keine DOI): liefert die im Artikel genutzte Prozentverteilung 5/45/25/25% (N1/N2/N3/REM)
      und die 90–110-Minuten-Zyklusdauer.
      Link: https://www.ncbi.nlm.nih.gov/books/NBK526132/

Vollständige Einträge inkl. Verifikationsmethode: `/data/quellen/schlafphasen.json`.

## Chart-Datenquelle

- [ ] `data/charts/schlafphasen-anteile.json` — Balkenchart 5/45/25/25% (N1/N2/N3/REM), Quelle:
      Patel et al. (2024), s. o. Kein Rasterbild, eigene Darstellung.

## Bekannte offene Fragen im Artikel

Stellen, an denen der Draft bewusst keine Behauptung aufstellt, weil die Quellenlage das nicht
hergibt (siehe Artikelabschnitt „Was die Studienlage (noch) nicht beantwortet"):

- Die exakten Original-Prozentwerte aus Ohayon (2004) und Boulos (2019) selbst waren hinter
  einer Bezahlschranke nicht einsehbar — der Artikel nutzt deshalb bewusst die frei
  zugängliche Sekundärquelle (StatPearls) für die konkrete Prozentzahl, nicht die
  Primärstudien.
- Keine der acht Quellen liefert eine einzelne, geräteübergreifende Genauigkeitszahl für
  „Tiefschlaf-Erkennung" — nur Sensitivitäts-/F1-Bereiche. Eine Aussage wie „Wearables liegen
  bei Tiefschlaf zu X% richtig" wird deshalb bewusst nicht getroffen.
- de Zambotti et al. (2019) und Menghini et al. (2021) teilen sich einen Senior-Autor — der
  Befund „kein Validierungsstandard" ist nicht durch zwei vollständig unabhängige
  Forschungsgruppen bestätigt (siehe Quality-Gate-Review, unten).

## Quality-Gate-Ergebnis

Siehe `/agents/reviews/schlafphasen.md` für den vollständigen Durchgang. Kurzstatus: Vier
Findings direkt im Artikel behoben (kleine Stichprobe bei Chinoy benannt, Sekundärquellen-Hinweis
nach vorne geholt, Fachbegriffe erklärt, klare Diagnostik-Abgrenzung ergänzt, Praxis-Abschnitt
ergänzt); ein Finding (Autor:innen-Überschneidung) bewusst nicht behoben, mit Begründung
dokumentiert.

## Nach der Prüfung

`entwurf: false` manuell in beiden Artikeldateien setzen, sobald die Quellen oben stichprobenartig
bestätigt sind. Bis dahin bleibt der Artikel unveröffentlicht (kein Listing auf Startseite,
Cluster-Seite oder eigener Route).
