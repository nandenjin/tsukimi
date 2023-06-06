export class MermaidCodeStateStore {
  visibility = new Map<string, boolean>()
  defaultValue = true

  switchVisibility(id: string) {
    const old = this.visibility.has(id)
      ? this.visibility.get(id)
      : this.defaultValue
    this.setVisibility(id, !old)
  }

  getVisibility(id: string) {
    return this.visibility.has(id) ? this.visibility.get(id) : this.defaultValue
  }

  setVisibility(id: string, value: boolean) {
    this.visibility.set(id, value)
  }
}
