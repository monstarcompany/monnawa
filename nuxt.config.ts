// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
  },
   modules: ['@nuxtjs/google-fonts'],
  css: [
    '@/assets/css/global.css',
    'swiper/swiper-bundle.css'
  ],
  build: {
    transpile: ['swiper']
  }

})
