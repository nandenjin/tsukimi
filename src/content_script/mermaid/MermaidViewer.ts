import { Mermaid } from 'mermaid'
import { MermaidCode } from './MermaidCode'
import { MermaidCodeStateStore } from './MermaidCodeStateStore'

/** Whether show code blocks in default or not */
const DEFAULT_SHOW_CODE = false

type MermaidCodeMap = Map<string, MermaidCode>

/** Root class of system,  */
export class MermaidViewer {
  private recentMermaidCodes: MermaidCodeMap = new Map()
  private store = new MermaidCodeStateStore()
  mermaid: Mermaid

  constructor(mermaid: Mermaid) {
    this.mermaid = mermaid
  }

  onScrapboxPageChanged() {
    if (scrapbox.Page.lines) {
      // Update diagrams view
      this.updateDiagrams()

      // Reset code visibility
      this.setVisibilityAll(DEFAULT_SHOW_CODE)
    }
  }

  onScrapboxLinesChanged() {
    if (scrapbox.Page.lines) {
      // Update diagrams view
      this.updateDiagrams()
    }
  }

  // Find mermaid codeblocks from lines and render diagrams
  updateDiagrams() {
    /** Code blocks currently existing */
    const newCodes = this.findMermaidCodes()

    /** Diffs between current and previous code blocks */
    const diff = diffMermaidCodes(this.recentMermaidCodes, newCodes)

    for (const item of diff) {
      // If deleted, remove diagram
      if (item.op === 'delete') {
        item.code?.removeDiagram()
      }
      // If new or changed, update diagram
      else {
        item.code?.updateDiagram()
      }
    }
    this.recentMermaidCodes = newCodes
  }

  /** Find mermaid codeblocks from lines */
  findMermaidCodes(): MermaidCodeMap {
    const result: MermaidCodeMap = new Map()
    let text = '',
      id = ''
    const lineIds = new Set<string>()

    for (const line of scrapbox.Page.lines) {
      // Detect by `line.codeblock.lang`
      if (line.codeBlock && line.codeBlock.lang === 'mermaid') {
        // When at start of codeblock
        if (line.codeBlock.start) {
          text = ''
          id = line.id
          lineIds.clear()
        } else {
          text += '\n' + line.text
        }

        // Add line id to set
        lineIds?.add(line.id)

        // When at end of codeblock
        if (line.codeBlock.end) {
          text = text?.trim()
          result.set(
            id,
            new MermaidCode(id, text, lineIds, this.store, this.mermaid)
          )
        }
      }
    }
    return result
  }

  /** Set visibility of all codeblocks at once */
  setVisibilityAll(showCode: boolean) {
    for (const [id, code] of this.recentMermaidCodes) {
      this.store.setVisibility(id, showCode)
      code.applyCodeView()
    }
  }
}

/** Util func to compute diffs between two `MermaidCodeMap`s */
const diffMermaidCodes = function (
  oldMap: MermaidCodeMap,
  newMap: MermaidCodeMap
) {
  const result = []
  const intersection = new Set<string>()
  for (const [key] of newMap) {
    if (!oldMap.has(key)) {
      result.push({ op: 'new', key: key, code: newMap.get(key) })
    } else {
      intersection.add(key)
    }
  }
  for (const [key] of oldMap) {
    if (!newMap.has(key)) {
      result.push({ op: 'delete', key: key, code: oldMap.get(key) })
      intersection.delete(key)
    }
  }
  for (const key of intersection) {
    const oldVal = oldMap.get(key)
    const newVal = newMap.get(key)
    if (oldVal?.text !== newVal?.text) {
      result.push({ op: 'changed', key: key, code: newMap.get(key) })
    }
  }
  return result
}
