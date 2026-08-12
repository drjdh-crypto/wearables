---
titel: "Template — nicht veröffentlichen"
beschreibung: "Vorlage für neue Artikel. entwurf:true verhindert Veröffentlichung."
sprache: "de"
datum: 2026-08-12
kategorie: "tracking-genauigkeit"
schlagworte: ["template"]
affiliate: false
entwurf: true
produkte: []
personas: ["dr-marlene", "kai", "ben"]
quellen:
  - aussage: "Beispielbehauptung, die eine Quelle braucht"
    studientyp: "peer-reviewed"
    autoren: "Nachname, V. et al."
    jahr: 2024
    titel: "Titel der Studie"
    journal: "Journal-Name"
    doi: "10.xxxx/xxxxx"
    url: "https://doi.org/10.xxxx/xxxxx"
---

Kopiere diese Datei als Ausgangspunkt für einen neuen Artikel (siehe `/content/README.md` und
`CLAUDE.md` Abschnitt 2–6 für die verbindlichen Regeln zu Quellen, Zitierformat,
Persona-Kennzeichnung und Affiliate-Kennzeichnung).

## Struktur-Vorschlag

1. Kurze Einordnung / Antwort auf die Kernfrage
2. Was sagt die Evidenz? (mit Kurzbelegen im Text, z. B. (Nachname et al., 2024))
3. Praktische Einordnung
4. Grenzen/Limitationen
5. Quellenverzeichnis (wird aus `quellen` generiert von `SourcesBox`, nicht manuell pflegen)

`personas` listet die Personas, aus denen `PersonaOpinionBlock` auswählt (mindestens 3
empfohlen, damit tatsächlich rotiert werden kann). `produkte` referenziert IDs aus
`/data/products.json`, für die am Artikelende automatisch eine `ProductBox` gerendert wird —
bei mindestens einem Eintrag muss `affiliate: true` gesetzt sein.
