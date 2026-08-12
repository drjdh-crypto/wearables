// @ts-check
import { defineConfig } from 'astro/config';
import { enabledLocales, defaultLocale } from './src/i18n/config.ts';

// https://astro.build/config
export default defineConfig({
  i18n: {
    locales: enabledLocales,
    defaultLocale,
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
