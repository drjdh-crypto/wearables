// @ts-check
import { defineConfig } from 'astro/config';
import { enabledLocales, defaultLocale } from './src/i18n/config.ts';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  i18n: {
    locales: enabledLocales,
    defaultLocale,
    routing: {
      prefixDefaultLocale: true,
    },
  },

  integrations: [mdx()],
});