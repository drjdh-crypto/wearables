# /src/i18n

Single source of truth für Sprachen, Übersetzungsschlüssel und Locale-Utilities. Siehe
[`CLAUDE.md`](../../CLAUDE.md) Abschnitt 7.

- `config.ts` — Liste aller Sprachen inkl. `enabled`-Flag. `astro.config.mjs`, das
  Language-Switcher-Widget und alle `[lang]`-Routen (`getStaticPaths`) lesen `enabledLocales`
  von hier. **Eine Sprache aktivieren = hier `enabled: true` setzen**, sofern die
  Übersetzungen in `strings/<code>.json` und die Persona-Stimmfassungen (`/personas`) bereits
  vollständig sind.
- `strings/<code>.json` — flache Key-Value-Übersetzungstabellen. Keine hartkodierten UI-Strings
  in Komponenten/Seiten — immer über `useTranslations(lang)` aus `utils.ts` gehen.
- `utils.ts` — `useTranslations(lang)` liefert eine `t(key, vars?)`-Funktion mit Fallback auf
  `defaultLocale` und dann auf den rohen Key (bricht den Build nie, macht fehlende
  Übersetzungen aber sichtbar).

## Zwei getrennte Einstellungen

- **Sprache** (`pref:lang` in `localStorage`, gesetzt von `LanguageSwitcher.astro`): steuert,
  welche Sprachversion der Seite angezeigt wird. Vorbelegung beim ersten Besuch über
  `navigator.language` (Root-Redirect in `src/pages/index.astro`) — keine IP-Geolokalisierung.
- **Region** (`pref:region` in `localStorage`, gesetzt von `RegionSwitcher.astro`): steuert
  ausschließlich, welcher Affiliate-Link aus `/data/products.json` angezeigt wird (siehe
  `ProductBox`-Komponente). Unabhängig von der UI-Sprache — ein:e Nutzer:in kann Deutsch lesen
  und trotzdem US-Links sehen wollen.

## Spanisch (`es`)

Übersetzungen liegen vollständig unter `strings/es.json` und die Personas haben `voices.es`
befüllt (siehe `/personas/README.md`), aber `es` ist in `config.ts` auf `enabled: false`
gesetzt — es wird aktuell nicht geroutet/gebaut. Aktivierung: Flag umstellen, Build laufen
lassen, stichprobenartig prüfen statt blind zu vertrauen, dass alte Platzhaltertexte längst
ersetzt wurden.
