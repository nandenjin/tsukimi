/** Get page by title from current project */
export const getPageByTitle = (title: string) => {
  const titleLc = title.toLowerCase()
  const titleLcWithUnderscores = titleLc.replace(/ /g, '_')
  for (const page of scrapbox.Project.pages) {
    if (!page.exists) continue
    if (page.titleLc === titleLc) return page
    if (page.titleLc === titleLcWithUnderscores) return page
  }
  return null
}
