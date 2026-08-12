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

- `typ`: `balken` | `linie` | `scatter` — bestimmt Schema von `daten` und welche
  Chart-Komponente `Chart.astro` rendert.
  - `balken`: `daten: { label: string, wert: number }[]` (min. 1)
  - `linie`: `daten: { x: string | number, y: number }[]` (min. 2, x-Achse ordinal)
  - `scatter`: `daten: { x: number, y: number, label?: string }[]` (min. 2, beide Achsen numerisch)
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
