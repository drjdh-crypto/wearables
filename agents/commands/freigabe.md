# Befehl: „Gib [id] frei"

Teil des Handy-Workflows (siehe `/agents/README.md`). **Der einzige Weg, wie ein Artikel
`entwurf: false` bekommt** — kein Pipeline-Schritt tut das von sich aus (siehe „Nicht
verhandelbare Leitplanken" in `/agents/README.md`).

## Auslöser

„Gib `<id>` frei" — `<id>` ist die Content-Collection-ID (Dateiname ohne Endung) des
Artikels, z. B. `schlafphasen-erklaert`. Für mehrere Sprachversionen gleichzeitig: „Gib
`schlafphasen-erklaert` und `schlafphasen-erklaert-en` frei". Ohne exakte ID nachfragen, welche
Datei gemeint ist — nie raten, welche von mehreren Sprachversionen freigegeben werden soll.

## Vorgehen

Für jede genannte `<id>`:

1. `content/articles/<id>.md` (oder `.mdx`) finden. Steht dort bereits `entwurf: false` →
   melden „schon veröffentlicht", nichts weiter tun.
2. Zugehörige `/data/quellen/<slug>.json` ermitteln (Recherche-Slug, meist aus der
   `historie`-Notiz oder dem Artikelkontext ersichtlich) und
   `node agents/pipeline/scripts/validate-quellen.mjs data/quellen/<slug>.json` ausführen.
3. **Bricht die Validierung ab (Exit-Code ≠ 0): Freigabe wird verweigert.** Fehler
   zurückmelden, `entwurf` bleibt `true`, keine weiteren Schritte.
4. Nur bei Erfolg: `entwurf: false` in der Artikeldatei setzen.
5. `npm run build` lokal laufen lassen — muss fehlerfrei durchlaufen (Artikel erscheint jetzt
   unter `/<sprache>/artikel/<id>/`, verschwindet von `/entwurf/<id>/`).
6. Committen (`Freigabe: <id> veröffentlicht`) und auf `main` pushen.
7. Die neue öffentliche URL ausgeben (`https://<SITE_URL>/<sprache>/artikel/<id>/`, oder den
   reinen Pfad, wenn `SITE_URL` nicht bekannt ist — siehe `/agents/README.md`).

## Beispiel

> „Gib schlafphasen-erklaert frei"

→ Validierung läuft, `entwurf: false` gesetzt, Build geprüft, committet, gepusht, Antwort:
„Freigegeben: https://wearables.example/de/artikel/schlafphasen-erklaert/"

## Explizit nicht Teil dieses Befehls

- Keine inhaltlichen Änderungen am Artikel — nur `entwurf` umschalten. Inhaltliche Korrekturen
  laufen über einen neuen Pipeline-Durchlauf oder eine gezielte Bearbeitung davor.
- Kein automatisches Freigeben „verwandter" Sprachversionen, die nicht explizit genannt wurden.
