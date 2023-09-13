import autoIconSrc from './autoicon/main.ts?script&module'

const funcs = {
  autoIcon: autoIconSrc,
}

for (const [name, src] of Object.entries(funcs)) {
  const script = document.createElement('script')
  script.setAttribute('type', 'module')
  script.setAttribute('data-name', name)
  script.setAttribute('src', chrome.runtime.getURL(src))
  document.body.appendChild(script)
}
