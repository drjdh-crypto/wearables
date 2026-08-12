# Projektregeln — Schlaf- & Recovery-Tracking (Nischenseite)

Evidenzbasierte Nischenseite rund um Schlaf- und Recovery-Tracking (Wearables, Schlaf-Apps,
Trainingssteuerung über HRV/Recovery-Scores). Tech-Stack: Astro (Content Collections),
Deployment später via Cloudflare Pages. Diese Datei ist verbindlich für jede inhaltliche
Arbeit an diesem Repo — bei Widerspruch zwischen "schnell fertig" und diesen Regeln gelten
die Regeln.

## 1. Grundprinzip: Evidenzpflicht

Jede inhaltliche Behauptung mit Sachbezug (physiologische Wirkung, Studienergebnis,
Genauigkeitsangabe eines Sensors, Gesundheitsaussage, Vergleichsaussage "X ist genauer als Y")
**muss** eine Quelle im Frontmatter des jeweiligen Artikels haben. Keine unbelegten
Gesundheits- oder Wirksamkeitsaussagen im Fließtext — auch nicht als "Expertenmeinung", außer
sie ist explizit als Meinung einer [Persona](#3-ki-personas) gekennzeichnet und macht keine
überprüfbare Faktenbehauptung.

- Bevorzugt: Peer-reviewte Studien mit DOI.
- Zulässig ohne DOI: Herstellerdokumentation/Whitepaper (klar als solche kennzeichnen),
  offizielle Gesundheitsinstitutionen (z. B. AASM, WHO, RKI), Preprints (als Preprint
  kennzeichnen, nicht als peer-reviewed ausgeben).
- Nicht zulässig als alleinige Quelle: andere Blogartikel, Marketingseiten, Foren, "Studien
  zeigen…" ohne konkrete Angabe.
- Ein Artikel ohne mindestens einen Eintrag in `sources` im Frontmatter gilt als **nicht
  publikationsreif**, sobald er eine Sachbehauptung enthält.

### Frontmatter-Schema (Content Collection `articles`)

```yaml
---
title: "…"
description: "…"
pubDate: 2026-08-12
updatedDate: 2026-08-12
author: "dr-somnia"        # Persona-Slug, siehe /personas
category: "tracking-genauigkeit"
tags: ["hrv", "oura", "validierungsstudie"]
affiliate: true             # true, sobald der Artikel auch nur einen Affiliate-Link enthält
sources:
  - claim: "PSG-validierte Schlafstadien-Erkennung bei Oura Ring Gen3 liegt bei ~79% Genauigkeit"
    type: "peer-reviewed"    # peer-reviewed | preprint | manufacturer | institutional
    authors: "Altini M. et al."
    year: 2023
    title: "Sleep stage classification..."
    journal: "Sensors"
    doi: "10.3390/s23135778"
    url: "https://doi.org/10.3390/s23135778"
---
```

`sources` ist eine Liste — mehrere Behauptungen im Artikel referenzieren dieselbe oder
unterschiedliche Einträge über `claim`. Jeder Eintrag braucht mindestens `type`, `title`,
`year`, `url`; `doi` ist Pflicht bei `type: peer-reviewed`.

## 2. Zitierformat

**Im Fließtext:** Kurzbeleg nach APA-Stil, verlinkt auf den Quellenverzeichnis-Eintrag:
`(Altini et al., 2023)`. Bei direkter Zahlen-/Ergebnisangabe die Zahl selbst verlinken, nicht
nur den Satz.

**Im Quellenverzeichnis am Artikelende** (automatisch aus `sources` im Frontmatter gerendert,
nicht manuell im Body pflegen), Format:

```
Altini, M. et al. (2023). Sleep stage classification via accelerometer and photoplethysmography
sensors. Sensors, 23(13), 5778. https://doi.org/10.3390/s23135778
```

Herstellerquellen und institutionelle Quellen werden im selben Verzeichnis geführt, aber mit
Zusatzlabel `[Herstellerangabe]` bzw. `[Institutionell]` statt Journal/Band/Heft.

## 3. KI-Personas

Es gibt ca. 10 wiederkehrende Personas (definiert in `/personas`), die als Artikel-„Autor:in"
oder in Meinungs-/Erfahrungsboxen auftreten. Regeln:

1. **Kennzeichnungspflicht:** Jede Persona ist im Frontmatter (`author:`) UND sichtbar im
   Artikel (Autor:innen-Box) als KI-generierte Persona ausgewiesen — kein Vortäuschen einer
   realen Person. Pflichttext in jeder Autor:innen-Box: „KI-Persona — keine reale Person,
   erzeugt zur Einordnung unterschiedlicher Perspektiven."
2. **Dürfen, müssen aber nicht widersprechen:** Zwei Personas können zum selben Thema
   unterschiedliche Einschätzungen abgeben (z. B. Skepsis vs. Praxisnutzen), das ist erwünscht,
   wenn es der Evidenzlage bzw. unterschiedlichen Prioritäten entspricht. Widerspruch darf
   nicht künstlich erzwungen werden, wenn die Evidenz eindeutig ist — kein "Both-Sideism" bei
   klar belegten Fakten. Persona-Meinungen dürfen nie Absatz 1 (Evidenzpflicht) unterlaufen:
   Meinung ≠ Freibrief für unbelegte Faktenbehauptungen.
3. Persona-Definitionen leben in `/personas/<slug>.md`, siehe README dort.

## 4. Affiliate-Links & Werbekennzeichnung

- Jeder Affiliate-/Partnerlink wird unmittelbar am Link oder im ihn umgebenden Absatz als
  Werbung gekennzeichnet, z. B. `[Oura Ring 4 bei Amazon ansehen*](...)` mit Fußnote „*Affiliate-
  Link — wir erhalten ggf. eine Provision, ohne Mehrkosten für dich" oder ein sichtbares
  „Werbung"/„Anzeige"-Label direkt am Link. Kein Verstecken in Buttons ohne Label, kein
  generisches „Disclosure" nur am Artikelanfang, wenn der Link erst weit unten folgt.
- Enthält ein Artikel mindestens einen Affiliate-Link, MUSS `affiliate: true` im Frontmatter
  gesetzt sein — das steuert den globalen Hinweisbanner der Seite.
- Produktempfehlungen/Vergleiche mit Affiliate-Bezug müssen weiterhin Absatz 1 erfüllen:
  Genauigkeits-/Wirksamkeitsaussagen brauchen Quellen, unabhängig von der Kommerzialisierung.
- Keine Sponsored-Artikel ohne redaktionelle Kennzeichnung; Trennung von Redaktion und Werbung
  bleibt jederzeit erkennbar (Trennungsgebot, § 5a UWG / § 22 MStV als Richtschnur).

## 5. Tech-Stack & Deployment

- **Framework:** Astro, Content Collections für Artikel (`src/content/`), Zod-Schema erzwingt
  das Frontmatter aus Abschnitt 1 (inkl. `sources`, `affiliate`).
- **Deployment:** später Cloudflare Pages (statischer Build via `astro build` → `dist/`).
  Bis dahin nur lokale Entwicklung; keine Deployment-spezifischen Annahmen (z. B. Cloudflare
  Functions/KV) fest einbauen, ohne das explizit zu besprechen.
- **Dev-Server im Hintergrund starten:**
  ```
  astro dev --background
  ```
  Verwaltung über `astro dev stop`, `astro dev status`, `astro dev logs`.
- Weiterführende Doku vor verwandten Aufgaben konsultieren:
  - [Routing](https://docs.astro.build/en/guides/routing/)
  - [Astro-Komponenten](https://docs.astro.build/en/basics/astro-components/)
  - [Content Collections](https://docs.astro.build/en/guides/content-collections/)
  - [Styling](https://docs.astro.build/en/guides/styling/)

## 6. Ordnerstruktur

| Ordner       | Zweck |
|--------------|-------|
| `/content`   | Redaktionelle Inhalte (Artikel, Vergleiche, Glossar) — siehe README dort |
| `/personas`  | Definitionen der ~10 KI-Personas — siehe README dort |
| `/data`      | Strukturierte Rohdaten (Produkte, Studien-Register, Preise) — siehe README dort |
| `/agents`    | Definitionen/Prompts für unterstützende Arbeits-Agents (Recherche, Faktencheck, Redaktion) — siehe README dort |
| `/src`       | Astro-Applikation (Layouts, Komponenten, Content-Collection-Schema, Seiten) |

## 7. Qualitätssicherung

- Vor Veröffentlichung: Prüfen, ob jede Sachbehauptung eine `sources`-Referenz hat, ob DOI/Link
  funktioniert, ob Affiliate-Links gekennzeichnet sind und ob Persona-Kennzeichnung vorhanden
  ist.
- Widersprüche zwischen Personas sind kein Fehler, aber ein Artikel, der eine falsche
  Tatsachenbehauptung als "nur Meinung" tarnt, ist ein Fehler.
