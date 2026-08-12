// Single source of truth for locales. Flip `enabled` here to activate a language —
// astro.config.mjs, the layout (hreflang), the language switcher and the [lang]
// route generators (getStaticPaths) all read from this file, so activating a locale
// is a one-line change plus supplying real (non-placeholder) translations/voices.

/** All locale codes we have (or are preparing) translations for, active or not. */
export const LOCALE_CODES = ['de', 'en', 'es'] as const;
export type LocaleCode = (typeof LOCALE_CODES)[number];

export interface LocaleDef {
  code: LocaleCode;
  /** Label shown in the language switcher, in the language's own name. */
  label: string;
  enabled: boolean;
}

export const locales: LocaleDef[] = [
  { code: 'de', label: 'Deutsch', enabled: true },
  { code: 'en', label: 'English', enabled: true },
  { code: 'es', label: 'Español', enabled: false },
];

export const defaultLocale: LocaleCode = 'de';

/** Locales that are actually routed/built. */
export const enabledLocales = locales.filter((l) => l.enabled).map((l) => l.code);

/** Tuple form of all locale codes — usable directly in z.enum(). */
export const allLocales = LOCALE_CODES;
