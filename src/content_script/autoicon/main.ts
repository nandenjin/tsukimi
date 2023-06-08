import {
  deleteCharsFromCursor,
  getCursorPosition,
  getLineById,
  insertCharsFromCursor,
} from '@/lib/editor'
import { getPageByTitle } from '@/lib/page'
import { waitOnReady } from '@/lib/setup'

await waitOnReady()

const isArrowKey = (e: KeyboardEvent) =>
  ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)

/** line ID at previous event */
let prevLineId = '',
  /** Char position at previous event */
  prevChar = -1,
  /** Text before cursor at previous event */
  prevText = '',
  /** Previous event */
  prevEvent: KeyboardEvent | null = null

window.addEventListener('keyup', (e) => {
  // Detect whether the cursor is in the editor
  if (!(e.target instanceof HTMLTextAreaElement)) {
    return
  }

  const { lineId, char } = getCursorPosition()
  if (!lineId) return

  const line = getLineById(lineId)
  if (!line) return

  /** Text before the cursor */
  const text = line.text.substring(0, char)

  // Tests for content just inputted
  const endsWithLinkRegExp = /\[(.+?)\]$/
  const textEndsWithLink = text.match(endsWithLinkRegExp)
  const prevLineTextEndsWithLink = prevText.match(endsWithLinkRegExp)

  /** Whether current event compose a new link or not */
  const isLinkJustComposed = textEndsWithLink && !prevLineTextEndsWithLink

  /** Convert link that is matching if it can be
   * @returns Whether the link is converted
   */
  const convert = () => {
    const linkId = textEndsWithLink[1]
    // If it already is icon link, abort
    if (linkId.match(/\.icon$/)) return false

    const page = getPageByTitle(linkId)

    // If the page is not found, abort
    if (!page) return false

    // If the page has no image for icon, abort
    if (!page.image) return false

    deleteCharsFromCursor(']'.length)
    insertCharsFromCursor('.icon]')

    return true
  }

  // On the same line with previous event
  if (lineId === prevLineId) {
    switch (e.key) {
      // Backspace before the icon, delete `.icon` and make it a simple link
      case 'Backspace': {
        if (!text.match(/\.icon$/)) break

        deleteCharsFromCursor('.icon'.length)
        insertCharsFromCursor(']')

        break
      }

      // If a link composed by enter (expected as it by suggestion), try to convert it
      case 'Enter': {
        if (!isLinkJustComposed) break
        convert()

        break
      }

      case 'ArrowRight': {
        if (!isLinkJustComposed) break

        // If non-continuous typing, abort
        if (Math.abs(char - prevChar) !== 1) break

        // If moving by arrow key, abort
        if (prevEvent && isArrowKey(prevEvent)) break

        convert()

        break
      }
    }
  }

  prevText = text
  prevLineId = lineId
  prevChar = char
  prevEvent = e
})
