export const claudeAiAdapter = {
  inputSelector: 'div[contenteditable="true"][data-lexical-editor="true"]',
  sendButtonSelector: 'button[aria-label*="Send"], button[data-testid*="send"]',

  getInputText(el: HTMLElement): string {
    return el.innerText ?? ''
  },

  setInputText(el: HTMLElement, text: string): void {
    el.focus()
    document.execCommand('selectAll', false)
    document.execCommand('insertText', false, text)
  },

  getCurrentModel(): string {
    const btn = document.querySelector<HTMLElement>('button[data-testid="model-selector-dropdown"]')
    return btn?.textContent?.trim() ?? 'claude-sonnet-4-6'
  },

  getInputElement(): HTMLElement | null {
    return document.querySelector<HTMLElement>(this.inputSelector)
  },

  observe(callback: (text: string) => void): () => void {
    const input = this.getInputElement()
    if (!input) return () => {}
    const listener = () => callback(this.getInputText(input))
    input.addEventListener('input', listener)
    return () => input.removeEventListener('input', listener)
  },
}
