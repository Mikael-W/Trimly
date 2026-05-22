import { createApp } from 'vue'
import { claudeAiAdapter } from './sites/claude-ai-adapter.js'
import App from './ui/App.vue'

function mount() {
  const host = document.createElement('div')
  host.id = 'trimly-ext-root'
  document.body.appendChild(host)

  const shadow = host.attachShadow({ mode: 'open' })
  const mountEl = document.createElement('div')
  shadow.appendChild(mountEl)

  const app = createApp(App, { adapter: claudeAiAdapter })
  app.mount(mountEl)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount)
} else {
  mount()
}
