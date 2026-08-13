# /data/charts

Eine JSON-Datei pro Chart, als Content Collection `charts` eingebunden
(`src/content.config.ts`, `glob()`-Loader — Dateiname ohne `.json` wird zur `id`, die
Artikel über `<Chart id="…" lang={lang} />` referenzieren, siehe
`src/components/Chart.astro`).

Gerendert wird ausschließlich als SVG (Balken/Linie/Scatter, `src/components/charts/`), Farben
kommen aus den Theme-Tokens (`var(--color-signal)` etc.) — nie hartkodiert, nie ein Rasterbild
aus einer Studie eingebettet (CLAUDE.md Abschnitt 2, "Grafiken aus Studien").

## Pflichtfelder

```json
{
  "typ": "balken",
  "titel": "…",
  "einheit": "%",
  "daten": [{ "label": "…", "wert": 42 }],
  "datenquelle": {
    "zitat": "Nachname, V. et al. (Jahr). Titel. Journal, Band(Heft), Seiten.",
    "doi": "10.xxxx/xxxxx",
    "url": "https://doi.org/10.xxxx/xxxxx"
  },
  "hinweis": "Eigene Darstellung."
}
```

- `typ`: `balken` | `linie` | `scatter` | `anteile` | `bereich` — bestimmt Schema von `daten`
  und welche Chart-Komponente `Chart.astro` rendert. Auswahlkriterien: CLAUDE.md Abschnitt 2,
  "Diagramme" — Diagrammtyp muss zur Aussage passen, nicht umgekehrt.
  - `balken`: `daten: { label: string, wert: number }[]` (min. 1) — Vergleich weniger Kategorien.
  - `linie`: `daten: { x: string | number, y: number }[]` (min. 2, x-Achse ordinal) — echte
    Entwicklung über eine geordnete/kontinuierliche Achse, nur mit tatsächlich aus der Quelle
    rekonstruierbaren durchgehenden Werten, nicht für zwei-drei Stützpunkte.
  - `scatter`: `daten: { x: number, y: number, label?: string }[]` (min. 2, beide Achsen numerisch)
  - `anteile`: `daten: { label: string, wert: number }[]` (min. 2) — Anteile einer Gesamtheit
    (Werte sollten sich zu ~100 aufsummieren); rendert einen gestapelten Balken statt separater
    Einzelbalken, mit Beschriftung direkt am Segment statt Legende.
  - `bereich`: `daten: { label: string, von: number, bis: number, mitte?: number }[]` (min. 1),
    optional `domain: [number, number]` für einen inhaltlich sinnvollen Achsenbereich statt des
    automatisch aus den Werten berechneten (z. B. `[0, 1]` für eine Sensitivitäts-/F1-Kennzahl)
    — boxplot-artige Darstellung für Spannweiten/Streuungen über mehrere Geräte oder Studien
    ("0,26 bis 0,69 je nach Gerät") oder Abweichungen von einer Referenz mit
    Konfidenzintervall, mit sichtbarer Referenzlinie bei 0, sofern die Achse die 0 einschließt.
    `mitte` (Median/Mittelwert, als Raute markiert) **nur setzen, wenn die Quelle selbst einen
    solchen Wert berichtet** (z. B. eine Meta-Analyse mit gepooltem Effekt) — nicht den
    Mittelpunkt von `von`/`bis` erfinden, wenn nur eine Spannweite ohne zentrale Kennzahl
    vorliegt.

**Kein Chart für Einzelwerte:** Ein `bereich`-Chart (wie jeder andere Diagrammtyp) wird nur
gebaut, wenn er mehrere Datenpunkte, eine echte Streuung (`von` ≠ `bis`, idealerweise aus einem
Konfidenzintervall oder einer Spannweite über mehrere Geräte/Studien) oder einen Vergleich
zeigt. Eine einzelne Zahl ohne Streuung (z. B. "die Gesamtschlafzeit war im Mittel 17 Minuten
kürzer") bleibt im Fließtext — kein Balken für einen Punktwert (CLAUDE.md Abschnitt 2,
"Diagramme").
- `datenquelle.zitat` + (`doi` oder `url`) sind Pflicht — wird von `ChartSource.astro` immer
  unter dem Chart gerendert, Format: „Datenquelle: Zitat, DOI/Link — Hinweis".
- `hinweis` ist Pflicht (Default „Eigene Darstellung.", falls im JSON weggelassen) — macht
  sichtbar, dass der Chart aus den Werten neu gezeichnet wurde, keine Reproduktion einer
  Studienabbildung ist.

## Verwendung im Artikel

```astro
<Chart id="schlafphasen-anteile" lang={lang} />
```

`id` entspricht dem Dateinamen ohne Endung. Ein Artikel kann zusätzlich einen Chart als
Hero-Chart referenzieren (`heroChart` im Frontmatter, siehe `/content/README.md`).
