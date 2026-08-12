# Review-Checkliste: „Schlafphasen erklärt"

**Status:** `entwurf: true` in beiden Sprachversionen — wartet auf menschliches Go. Die
Pipeline setzt `entwurf: false` nie selbst (siehe `/agents/README.md`).

Betroffene Dateien: `content/articles/schlafphasen-erklaert.md` (de),
`content/articles/schlafphasen-erklaert-en.md` (en), `data/charts/schlafphasen-anteile.json`,
`data/quellen/schlafphasen.json`.

Diese Liste soll reichen, um jede Behauptung im Artikel in wenigen Minuten gegenzuprüfen, ohne
selbst alle acht Studien lesen zu müssen. Stand: nach retroaktiver Diversitätsprüfung
(2026-08-12, siehe Nachtrag in `/agents/reviews/schlafphasen.md`) — Menghini et al. (2021)
wurde durch Lee YJ et al. (2025) ersetzt, um die „max. 2 Quellen pro Journal"-Regel zu
erfüllen.

## Diversitätsprüfung

`node agents/pipeline/scripts/validate-quellen.mjs data/quellen/schlafphasen.json` → **alle
fünf Regeln erfüllt** (8 Quellen; 4 davon 2023–2025; 3 Meta-Analysen + 5 Primär-/
Übersichtsquellen; kein Journal >2×; keine Forschungsgruppe >2×). Eine Warnung bleibt bestehen:
Boulos et al. (2019) ist nicht Open Access — im Artikel entsprechend nur über das per Abstract
Zugängliche hinaus zitiert, nicht darüber hinaus.

## Quellen

- [ ] **Ohayon et al. (2004)** — Meta-Analyse, 65 Studien, 3.577 gesunde Personen (5–102
      Jahre): REM-Anteil nimmt mit dem Alter ab, Stadium-1/2-Anteile nehmen zu.
      Open Access: ja · Zitationen (OpenAlex): 3.356
      DOI: https://doi.org/10.1093/sleep/27.7.1255
- [ ] **Boulos et al. (2019)** — Meta-Analyse, 169 Studien, 5.273 gesunde Erwachsene: N2-,
      N3- und REM-Anteile bleiben über Erwachsenen-Dekaden weitgehend stabil, N1 steigt leicht.
      Open Access: **nein** (nur Abstract zitiert) · Zitationen: 308
      DOI: https://doi.org/10.1016/S2213-2600(19)30057-8
- [ ] **de Zambotti et al. (2019)** — Übersichtsarbeit: Consumer-Wearables messen über
      Herzfrequenz(-variabilität)/Hauttemperatur/Bewegung statt EEG, Validierungsstandards
      fehlen weitgehend.
      Open Access: ja · Zitationen: 544
      DOI: https://doi.org/10.1249/MSS.0000000000001947
- [ ] **Lee T et al. (2023)** — 11 Tracker vs. PSG, n=75, 349.114 Epochen: Macro-F1 für
      Schlafphasen-Klassifikation zwischen 0,26 und 0,69, je nach Gerät.
      Open Access: ja · Zitationen: 101
      DOI: https://doi.org/10.2196/50983
- [ ] **Cajochen et al. (2024)** — n=369, 6.064 PSG-Zyklen: mediane Zyklusdauer 96 Minuten,
      meist 3–4 Zyklen/Nacht, große individuelle Schwankung.
      Open Access: ja · Zitationen: 23
      DOI: https://doi.org/10.1016/j.sleh.2023.09.002
- [ ] **Chinoy et al. (2021)** — 7 Tracker vs. PSG, n=34 (klein): Schlaf/Wach-Sensitivität
      ≥0,93, Phasen-Sensitivität nur 0,49–0,76, Tendenz zu "Leichtschlaf"-Fehlklassifikation.
      Open Access: ja · Zitationen: 429
      DOI: https://doi.org/10.1093/sleep/zsaa291
- [ ] **Lee YJ et al. (2025)** — Meta-Analyse, 24 Studien, 798 Teilnehmende: Consumer-Wearables
      unterschätzen Gesamtschlafzeit (~17 Min.) und Schlafeffizienz (~4,7 Pp.), überschätzen
      Einschlaflatenz und WASO gegenüber PSG. *(neu seit retroaktiver Diversitätsprüfung)*
      Open Access: ja · Zitationen: 26
      DOI: https://doi.org/10.5664/jcsm.11460
- [ ] **Patel, Reddy, Shumway, Araujo (2024)** — StatPearls/NCBI Bookshelf (institutionell,
      keine DOI): liefert die im Artikel genutzte Prozentverteilung 5/45/25/25% (N1/N2/N3/REM)
      und die 90–110-Minuten-Zyklusdauer.
      Open Access: ja (frei lesbar) · Zitationen: n/a (kein OpenAlex-Eintrag)
      Link: https://www.ncbi.nlm.nih.gov/books/NBK526132/

Vollständige Einträge inkl. Verifikationsmethode: `/data/quellen/schlafphasen.json`.

## Chart-Datenquelle

- [ ] `data/charts/schlafphasen-anteile.json` — Balkenchart 5/45/25/25% (N1/N2/N3/REM), Quelle:
      Patel et al. (2024), s. o. Kein Rasterbild, eigene Darstellung.

## Bekannte offene Fragen im Artikel

Stellen, an denen der Draft bewusst keine Behauptung aufstellt, weil die Quellenlage das nicht
hergibt (siehe Artikelabschnitt „Was die Studienlage (noch) nicht beantwortet"):

- Die exakten Original-Prozentwerte aus Ohayon (2004) und Boulos (2019) selbst konnten wir
  nicht direkt einsehen — bei Boulos wegen Bezahlschranke, bei Ohayon war der Volltext zwar
  frei zugänglich (Open Access, siehe oben), die Tabelle ließ sich daraus aber nicht
  zuverlässig extrahieren. Der Artikel nutzt deshalb bewusst die frei zugängliche
  Sekundärquelle (StatPearls) für die konkrete Prozentzahl, nicht die Primärstudien.
- Keine der acht Quellen liefert eine einzelne, geräteübergreifende Genauigkeitszahl für
  „Tiefschlaf-Erkennung" — nur Sensitivitäts-/F1-Bereiche. Eine Aussage wie „Wearables liegen
  bei Tiefschlaf zu X% richtig" wird deshalb bewusst nicht getroffen.

## Quality-Gate-Ergebnis

Siehe `/agents/reviews/schlafphasen.md` für den vollständigen Durchgang inkl. Nachtrag zur
retroaktiven Diversitätsprüfung. Kurzstatus: Vier Findings direkt im Artikel behoben (kleine
Stichprobe bei Chinoy benannt, Sekundärquellen-Hinweis nach vorne geholt, Fachbegriffe erklärt,
klare Diagnostik-Abgrenzung ergänzt, Praxis-Abschnitt ergänzt); die zuvor dokumentierte
Autor:innen-Überschneidung (de Zambotti/Menghini) hat sich durch den Quellenaustausch von
selbst erledigt.

## Nach der Prüfung

`entwurf: false` manuell in beiden Artikeldateien setzen, sobald die Quellen oben stichprobenartig
bestätigt sind. Bis dahin bleibt der Artikel unveröffentlicht (kein Listing auf Startseite,
Cluster-Seite oder eigener Route).
