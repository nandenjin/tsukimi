/**
 * @file Provide context menu item to copy URL and Title of the page
 */

/** Registration id for context menu item */
const CONTEXT_MENU_ITEM_ID = 'copy-url-and-title'

// Create context menu item
chrome.contextMenus.create({
  id: CONTEXT_MENU_ITEM_ID,
  title: 'Copy URL and Title',
  contexts: ['page'],
})

// Add event handler
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  // Check the clicked item
  if (info.menuItemId !== CONTEXT_MENU_ITEM_ID) return

  /** Id of current tab */
  const tabId = tab?.id
  if (!tabId) {
    console.error('Failed to get tabId')
    return
  }

  // Exec script via chrome.scripting
  chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      /** Get URL of the page. Use canonical URL if exists
       *
       * **ℹ️ Must be called in page context**
       */
      const getPageURL = () => {
        const canonical = document.querySelector('link[rel="canonical"]')

        // Use canonical URL if exists
        if (canonical) {
          return canonical.getAttribute('href')
        }
        // Otherwise, use location.href
        else {
          return location.href
        }
      }

      /** Get title of the page. Use OGP title and site name if exists
       *
       * **ℹ️ Must be called in page context**
       */
      const getPageTitle = () => {
        const ogTitle = document
          .querySelector('meta[property="og:title"]')
          ?.getAttribute('content')
        const ogSiteName = document
          .querySelector('meta[property="og:site_name"]')
          ?.getAttribute('content')

        // Use OGP title and site name if exists
        if (ogTitle && ogSiteName) {
          // If the title already contains the site name, use the title only
          if (ogTitle.includes(ogSiteName)) {
            return ogTitle
          }
          // Otherwise, use both title and site name
          else {
            return `${ogTitle} - ${ogSiteName}`
          }
        }
        // Otherwise, use document.title
        else {
          return document.title
        }
      }

      const url = getPageURL()
      const title = getPageTitle()

      // Copy URL and Title
      navigator.clipboard.writeText(`[${title} ${url}]`)
      console.log('Copied URL and Title')
    },
  })
})
