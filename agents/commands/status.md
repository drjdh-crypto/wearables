# Befehl: „Status"

Teil des Handy-Workflows (siehe `/agents/README.md`).

## Zweck

Schneller Überblick über alle Artikel und ihren Zustand, ohne den Rechner aufzuklappen —
tippbare Liste für unterwegs.

## Auslöser

Die Nachricht „Status" (oder sinngemäß „Status?", „Wie ist der Stand?").

## Vorgehen

1. `node agents/pipeline/scripts/status.mjs` ausführen.
2. Ergebnis 1:1 als Liste wiedergeben: pro Artikel Titel, Sprache, Zustand
   (Entwurf/veröffentlicht), URL.
3. Ist `SITE_URL` nicht gesetzt (siehe Skript-Hinweis), das explizit sagen — nicht so tun, als
   wäre die ausgegebene URL live erreichbar, wenn kein Hosting verbunden ist.

## Beispielausgabe

```
Status (3 Artikel):

- [Entwurf] Schlafphasen erklärt (de)
  https://wearables.example/entwurf/schlafphasen-erklaert/
- [Entwurf] Sleep Stages Explained (en)
  https://wearables.example/entwurf/schlafphasen-erklaert-en/
- [veröffentlicht] Grundlagen der Schlafarchitektur (de)
  https://wearables.example/de/artikel/schlafarchitektur/
```

Kein Build, kein Commit, keine Nebenwirkung — reine Auskunft.
