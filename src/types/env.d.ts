import type jquery from 'jquery'
import { Scrapbox } from './scrapbox'

declare global {
  import '@types/chrome'

  /** The query to get moduled script directly
   * See: https://dev.to/jacksteamdev/advanced-config-for-rpce-3966#main-world-scripts
   */
  declare module '*?script&module' {
    const srcPath: string
    export default srcPath
  }

  /** Scrapbox API */
  const scrapbox: Scrapbox

  /** jQuery (from Scrapbox) */
  const $: typeof jquery
}
