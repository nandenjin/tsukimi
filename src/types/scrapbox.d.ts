// ref: https://github.com/scrapbox-jp/types

interface EventEmitter {
  on(event: string, listener: (...args: unknown[]) => void): this
  once(event: string, listener: (...args: unknown[]) => void): this
}

export interface Line {
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

export interface Page<T extends Layout> {
  get lines(): T extends 'page' ? Line[] : null
  get title(): T extends 'page' ? string : null
  get id(): T extends 'page' ? string : null
}

export type Scrapbox = EventEmitter & {
  Page: Page
}
