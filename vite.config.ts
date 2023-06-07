import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { crx, defineManifest } from '@crxjs/vite-plugin'

const manifest = defineManifest({
  manifest_version: 3,
  name: 'Tsukimi',
  version: '0.0.1',
  icons: {
    128: 'src/assets/icons/icon_128.png',
  },
  content_scripts: [
    {
      matches: ['https://scrapbox.io/*'],
      js: ['src/content_script/main.ts'],
    },
  ],
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })],
})
