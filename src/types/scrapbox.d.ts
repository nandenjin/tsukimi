// ref: https://github.com/scrapbox-jp/types

interface EventEmitter {
  on(event: string, listener: (...args: unknown[]) => void): this
  once(event: string, listener: (...args: unknown[]) => void): this
}

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

export type Page<T extends Layout> = {
  get lines(): T extends 'page' ? Line[] : null
  get title(): T extends 'page' ? string : null
  get id(): T extends 'page' ? string : null
}

export type Project = {
  get pages(): (Page<'page'> & {
    exists: boolean
    updated: number
    image?: string
    titleLc: string
    titleLengthForSort: number
  })[]
}

export type Scrapbox = EventEmitter & {
  Page: Page
  Project: Project
}
