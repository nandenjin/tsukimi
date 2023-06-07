// Render mermaid diagrams
// Thanks: https://scrapbox.io/customize/Mermaid記法可視化UserScript

import mermaid from 'mermaid'
import { MermaidViewer } from './MermaidViewer'
import './style.css'

// Initialize mermaid
mermaid.mermaidAPI.initialize({
  startOnLoad: false,
})

const mermaidViewer = new MermaidViewer(mermaid)
scrapbox.on('page:changed', () => mermaidViewer.onScrapboxPageChanged())
scrapbox.on('lines:changed', () => mermaidViewer.onScrapboxLinesChanged())

// Initial render
mermaidViewer.onScrapboxPageChanged()
