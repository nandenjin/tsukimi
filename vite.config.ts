import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { crx, defineManifest } from '@crxjs/vite-plugin'
import tsConfigPaths from 'vite-tsconfig-paths'
import consola from 'consola'

// https://vitejs.dev/config/
export default defineConfig((ctx) => {
  const browser =
    (process.env.TSUKIMI_BROWSER?.toLowerCase() as 'chrome' | 'firefox') ||
    'chrome'
  if (['chrome', 'firefox'].includes(browser)) {
    consola.info(
      `Building for ${browser}. To change, set TSUKIMI_BROWSER={chrome|firefox}`
    )
  } else {
    throw new Error(`Unsupported browser: ${browser}`)
  }

  if (browser === 'firefox' && ctx.mode === 'development') {
    consola.warn(
      "Firefox doesn't support HMR for service workers. See: https://github.com/crxjs/chrome-extension-tools/pull/644#issue-1567112605"
    )
  }

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
    background:
      browser === 'chrome'
        ? // For Chrome
          {
            service_worker: 'src/background/tsukimi-background.ts',
          }
        : // For Firefox
          {
            scripts: ['src/background/tsukimi-background.ts'],
          },
  })

  return {
    build: {
      target: ['chrome89', 'edge89', 'firefox89'],
    },
    plugins: [tsConfigPaths(), react(), crx({ manifest, browser })],
  }
})
