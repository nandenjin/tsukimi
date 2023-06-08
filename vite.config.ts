import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { crx, defineManifest } from '@crxjs/vite-plugin'
import tsConfigPaths from 'vite-tsconfig-paths'

const manifest = defineManifest({
  manifest_version: 3,
  name: 'Tsukimi',
  version: process.env.npm_package_version,
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
  build: {
    target: ['chrome89', 'edge89', 'firefox89'],
  },
  plugins: [tsConfigPaths(), react(), crx({ manifest })],
})
