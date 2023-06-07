import mermaidSrc from './mermaid/main.ts?script&module'

const mermaid = document.createElement('script')
mermaid.setAttribute('type', 'module')
mermaid.setAttribute('src', chrome.runtime.getURL(mermaidSrc))
document.body.appendChild(mermaid)
