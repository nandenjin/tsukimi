/** @see https://github.com/scrapbox-jp/types */

/**
 * Event emitter interface. (local definition in the project)
 */
interface EventEmitter {
  on(event: string, listener: (...args: unknown[]) => void): this
  once(event: string, listener: (...args: unknown[]) => void): this
}

/**
 * A line in a page. Exposed at `scrapbox.Page.lines`.
 */
export type Line = {
  id: string
  text: string
  userId: string
  created: string
  updated: string
  section: {
    number: number
    start: boolean
    end: boolean
  }
}

/**
 * Layout ids of page.
 *
 * @see https://github.com/scrapbox-jp/types/blob/main/layout.ts
 */
export type Layout = 'page' | 'project' | 'stream'

export type Page<T extends Layout> = {
  get lines(): T extends 'page' ? Line[] : null
  get title(): T extends 'page' ? string : null
  get id(): T extends 'page' ? string : null
}

/**
 * Scrapbox project
 */
export type Project = {
  get pages(): (Page<'page'> & {
    exists: boolean
    updated: number
    image?: string
    titleLc: string
    titleLengthForSort: number
  })[]
}

/**
 * Type of `window.scrapbox`.
 */
export type Scrapbox = EventEmitter & {
  Page: Page<Layout>
  Project: Project
}

declare global {
  const scrapbox: readonly Scrapbox
}
