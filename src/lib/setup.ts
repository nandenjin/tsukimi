/** Returns a Promise will be resolved when all contents are ready by Scrapbox */
export const waitOnReady = () =>
  new Promise<void>((resolve) => {
    /** Detect whether load completed */
    const isReady = () =>
      // Currently detecting by the existence of the theme attribute
      // Should be replaced with a robust way with requests
      !!document.documentElement.getAttribute('data-project-theme')

    // If already ready, resolve immediately
    if (isReady()) {
      resolve()
    }

    // Otherwise, wait for the load to complete
    const observer = new MutationObserver(() => {
      if (isReady()) {
        observer.disconnect()
        resolve()
      }
    })
    observer.observe(document.documentElement, { attributes: true })
  })
