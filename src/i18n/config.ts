// Single source of truth for locales. Flip `enabled` here to activate a language —
// astro.config.mjs, the layout (hreflang), the language switcher and the [lang]
// route generators (getStaticPaths) all read from this file, so activating a locale
// is a one-line change plus supplying real (non-placeholder) translations/voices.
export interface LocaleDef {
  code: string;
  /** Label shown in the language switcher, in the language's own name. */
  label: string;
  enabled: boolean;
}

export const locales: LocaleDef[] = [
  { code: 'de', label: 'Deutsch', enabled: true },
  { code: 'en', label: 'English', enabled: true },
  { code: 'es', label: 'Español', enabled: false },
];

export const defaultLocale = 'de';

/** Locales that are actually routed/built. */
export const enabledLocales = locales.filter((l) => l.enabled).map((l) => l.code);

/** All locales we have (or are preparing) translations for, active or not. */
export const allLocales = locales.map((l) => l.code);

export type LocaleCode = (typeof allLocales)[number];
