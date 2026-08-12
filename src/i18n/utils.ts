import de from './strings/de.json';
import en from './strings/en.json';
import es from './strings/es.json';
import { defaultLocale } from './config';

type Dictionary = Record<string, string>;

const dictionaries: Record<string, Dictionary> = { de, en, es };

/**
 * Returns a `t(key, vars?)` translator bound to `lang`. Falls back to the
 * default locale's string, then to the raw key, so a missing translation
 * never breaks the build — it just surfaces as an obviously-untranslated key.
 */
export function useTranslations(lang: string) {
  const dict = dictionaries[lang] ?? dictionaries[defaultLocale];

  return function t(key: string, vars?: Record<string, string | number>): string {
    let str = dict[key] ?? dictionaries[defaultLocale][key] ?? key;
    if (vars) {
      for (const [name, value] of Object.entries(vars)) {
        str = str.replaceAll(`{${name}}`, String(value));
      }
    }
    return str;
  };
}

export function getDictionary(lang: string): Dictionary {
  return dictionaries[lang] ?? dictionaries[defaultLocale];
}
