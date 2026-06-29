import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  output: 'static',
  site: 'https://walisson-andrade.github.io/recanto-sonho-meu.github.io',
  integrations: [sitemap()],
  server: {
    host: '0.0.0.0',
    port: 4322
  },
  vite: {
    plugins: [tailwindcss()]
  }
})
