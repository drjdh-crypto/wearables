---
titel: "Template — nicht veröffentlichen"
beschreibung: "Vorlage für neue Artikel. entwurf:true verhindert Veröffentlichung."
sprache: "de"
datum: 2026-08-12
historie:
  - datum: 2026-08-12
    notiz: "Erstveröffentlichung"
kategorie: "tracking-genauigkeit"
schlagworte: ["template"]
kernaussagen:
  - "Erster Kernsatz: die wichtigste Antwort auf die Kernfrage des Artikels."
  - "Zweiter Kernsatz: die zentrale Einschränkung oder Nuance."
  - "Dritter Kernsatz: was in der Praxis daraus folgt."
affiliate: false
entwurf: true
featured: false
istSaeule: false
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

Überschriften ab dieser Ebene (`##`, `###`) landen automatisch im Inhaltsverzeichnis
(`TableOfContents`, sticky Sidebar auf Desktop).

1. Kurze Einordnung / Antwort auf die Kernfrage
2. Was sagt die Evidenz? (mit Kurzbelegen im Text, z. B. (Nachname et al., 2024))
3. Praktische Einordnung
4. Grenzen/Limitationen
5. Quellenverzeichnis (wird aus `quellen` generiert von `SourcesBox`, nicht manuell pflegen)

## Hinweise zu den neuen Feldern

- `historie`: mindestens ein Eintrag; der jüngste liefert automatisch das „Zuletzt geprüft
  am"-Datum im Artikelkopf. Bei inhaltlicher Überarbeitung neuen Eintrag ergänzen, nicht den
  alten überschreiben.
- `kernaussagen`: 1–5 Sätze (empfohlen genau 3) für die Kernaussagen-Box direkt unter dem
  Hero-Chart — die kürzeste, ehrliche Zusammenfassung der Studienlage.
- `heroChart`: optionale Chart-ID aus `/data/charts/` (leerlassen, wenn kein Hero-Chart
  passt). Weitere Charts lassen sich mit `<Chart id="…" lang={lang} />` auch mitten im
  Fließtext einbinden — dafür die Datei als `.mdx` statt `.md` anlegen.
- `personas` listet die Personas, aus denen `PersonaOpinionBlock` auswählt (mindestens 3
  empfohlen, damit tatsächlich rotiert werden kann).
- `produkte` referenziert IDs aus `/data/products.json`, für die am Artikelende automatisch
  eine `ProductBox` gerendert wird — bei mindestens einem Eintrag muss `affiliate: true`
  gesetzt sein.
