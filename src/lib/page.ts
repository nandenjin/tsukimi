/** Get page by title from current project */
export const getPageByTitle = (title: string) => {
  for (const page of scrapbox.Project.pages) {
    if (page.title === title) return page
  }
  return null
}
