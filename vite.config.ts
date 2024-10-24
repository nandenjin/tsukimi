import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { crx, defineManifest } from '@crxjs/vite-plugin'
import tsConfigPaths from 'vite-tsconfig-paths'

const manifest = defineManifest({
  manifest_version: 3,
  name: 'Tsukimi',
  version: process.env.npm_package_version,
  description: 'Useful toolkit for scrapbox.io as browser extension',
  homepage_url: 'https://github.com/nandenjin/tsukimi',
  minimum_chrome_version: '89',
  permissions: ['contextMenus', 'activeTab', 'scripting'],
  icons: {
    '16': 'src/assets/icons/icon_16.png',
    '128': 'src/assets/icons/icon_128.png',
  },
  content_scripts: [
    {
      matches: ['https://scrapbox.io/*'],
      js: ['src/content_script/main.ts'],
    },
  ],
  background: {
    service_worker: 'src/background/tsukimi-background.ts',
  },
})

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: ['chrome89', 'edge89', 'firefox89'],
  },
  plugins: [tsConfigPaths(), react(), crx({ manifest })],
})
