// Thanks: https://scrapbox.io/customize/Mermaid記法可視化UserScript

import { Mermaid } from 'mermaid'
import { MermaidCodeStateStore } from './MermaidCodeStateStore'

/** Prefix for mermaid SVG */
const MERMAID_SVG_ID_PREFIX = 'mermaid-'

/** Code block of mermaid */
export class MermaidCode {
  id: string

  /** Source code of mermaid */
  text: string

  /**  Set of lineIds of code blocks */
  lineIds: Set<string>

  /** State store that has visibility values */
  store: MermaidCodeStateStore

  /** DOM id of rendered SVG */
  svgId: string

  /** Mermaid API */
  mermaid: Mermaid

  constructor(
    id: string,
    text: string,
    lineIds: Set<string>,
    store: MermaidCodeStateStore,
    mermaid: Mermaid
  ) {
    this.id = id
    this.text = text
    this.lineIds = lineIds
    this.store = store
    this.svgId = MERMAID_SVG_ID_PREFIX + id
    this.mermaid = mermaid
  }

  get lastLineId() {
    return Array.from(this.lineIds).pop()
  }

  /** Update rendered diagram */
  async updateDiagram() {
    // Remove previous error message
    $('#' + this.svgId + '_Error').remove()

    try {
      const rendered = await this.mermaid.mermaidAPI.render(
        this.svgId,
        this.text
      )

      // Remove previous render result
      $('#' + this.svgId).remove()

      // Insert new render result
      $('#L' + this.lastLineId).after(rendered.svg)
    } catch (e) {
      // Handle render error
      console.error(e)
      if (e instanceof Error) {
        $('#L' + this.lastLineId)
          .after($('#' + this.svgId))

          // Add error message
          .after(
            $('<output>')
              .addClass('tsukimi-mermaid-error')
              .attr('id', `${this.svgId}_Error`)
              .text(e.message)
          )

        // Show code block automatically
        this.store.setVisibility(this.id, true)
        this.applyCodeView()
      }
    }
    $('#' + this.svgId)
      .on('click', () => this.onSvgClicked())
      .css('cursor', 'pointer')
  }

  /** Remove diagram from DOM */
  removeDiagram() {
    $('#' + this.svgId).remove()
  }

  /** Handle clicks on rendered diagram */
  onSvgClicked() {
    this.store.switchVisibility(this.id)
    this.applyCodeView()
  }

  /** Get visibility state and apply to DOM */
  applyCodeView() {
    const visibility = this.store.getVisibility(this.id)
    for (const lineId of this.lineIds) {
      if (visibility) {
        $('#L' + lineId).show(100)
      } else {
        $('#L' + lineId).hide(100)
      }
    }
  }
}
