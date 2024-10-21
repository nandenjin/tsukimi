import { Line } from '@/types/scrapbox'

/**
 * Represents the position of the cursor in the editor.
 */
type CursorPosition = {
  /** Line ID of active cursor */
  lineId: string | null
  /** Index of character at left of the cursor  */
  char: number
}

/**
 * Get current position of the cursor
 */
export const getCursorPosition: () => CursorPosition = () => {
  // https://scrapbox.io/takker/scrapbox-cursor-position-6
  const [cursorDOM] = document.getElementsByClassName('cursor')

  if (!(cursorDOM instanceof HTMLElement) || !scrapbox.Page.lines) {
    return { lineId: null, char: -1 }
  }

  const bounding = cursorDOM.getBoundingClientRect()

  // When not in the editor
  if (bounding.left === 0 && bounding.top === 0) {
    return { lineId: null, char: -1 }
  }

  const els = document.elementsFromPoint(
    bounding.left + 1,
    bounding.top + bounding.height / 2
  )
  let lineId = '',
    char = -1

  for (const el of els) {
    if (el.classList.contains('line')) {
      lineId = el.id.replace('L', '')
    } else if (el.classList.contains('char-index')) {
      char = +(el.getAttribute('data-char-index') || char)
    }
  }

  // If the cursor is at the end of the line, char is -1
  if (lineId !== '' && char === -1) {
    for (const line of scrapbox.Page.lines) {
      if (line.id === lineId) {
        char = line.text.length
        break
      }
    }
  }

  return { lineId, char }
}

/** Get line data by lineId */
export const getLineById = (id: string): Line | null => {
  const lines = scrapbox.Page.lines
  if (!lines) return null
  for (const line of lines) {
    if (line.id === id) return line
  }
  return null
}

/** Delete chars before cursor */
export const deleteCharsFromCursor = (length: number) => {
  const textarea = document.getElementById('text-input') as HTMLTextAreaElement
  if (!textarea) return
  const s = {
    keyCode: 8,
    bubbles: true,
  }
  for (let i = 0; i < length; i++) {
    textarea.dispatchEvent(new KeyboardEvent('keydown', s))
  }
}

/** Insert chars before cursor */
export const insertCharsFromCursor = (chars: string) => {
  const textarea = document.getElementById('text-input') as HTMLTextAreaElement
  if (!textarea) return
  for (const char of chars) {
    textarea.value += char
    textarea.dispatchEvent(new KeyboardEvent('input', { bubbles: true }))
  }
}
