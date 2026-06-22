export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxtjs/i18n'],
  devServer: {
    port: 3101,
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBase: process.env.COMMERCE_CORE_API_BASE || 'http://localhost:3100',
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'bg', name: 'Български', file: 'bg.json' }
    ],
    langDir: 'locales',
    strategy: 'prefix_except_default'
  }
})
