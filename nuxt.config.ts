// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    // Chave secreta PayEvo — nunca exposta ao cliente
    payevoSecretKey: process.env.PAYEVO_SECRET_KEY || '',
    payevoApiUrl: process.env.PAYEVO_API_URL || 'https://apiv2.payevo.com.br'
  },

  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxt/image'],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
