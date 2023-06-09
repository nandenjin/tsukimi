/** Get page by title from current project */
export const getPageByTitle = (title: string) => {
  const titleLc = title.toLowerCase()
  for (const page of scrapbox.Project.pages) {
    if (!page.exists) continue
    if (page.titleLc === titleLc) return page
  }
  return null
}
