# Trimly — Extension Navigateur (claude.ai)

## 🎯 Objectif de l'extension

Faire prendre conscience à l'utilisateur de claude.ai (et plus tard ChatGPT, Gemini) qu'il consomme des tokens, et l'aider à les réduire en temps réel.

## 🎬 User flow V1

1. User installe l'extension depuis Chrome Web Store / Firefox Add-ons
2. User ouvre claude.ai et clique dans le textarea
3. Un **TokenBadge** apparaît en bas du textarea : `0 tokens · $0.000`
4. User commence à taper : "Salut Claude, est-ce que tu pourrais s'il te plaît..."
5. Le badge se met à jour en temps réel : `47 tokens · $0.0001 · 💡 -64%`
6. User clique sur le 💡 → un overlay propose : *"Optimisé : 'Explain...' (17 tokens, -64%)"*
7. User clique **Appliquer** → le textarea est mis à jour
8. User envoie → l'extension stocke l'event dans `chrome.storage.local`
9. User clique sur l'icône Trimly dans la barre → popup avec stats globales

## 🧩 Cibles V1

- **claude.ai** uniquement en V1
- Architecture modulaire avec un adapter par site pour ouvrir V2 à ChatGPT, Gemini, Mistral chat

## 📂 Structure

```
apps/browser-extension/
├── src/
│   ├── manifest.json
│   ├── content/
│   │   ├── claude-ai.ts            ← entry point claude.ai
│   │   ├── sites/
│   │   │   └── claude-ai-adapter.ts ← sélecteurs DOM, événements
│   │   ├── ui/
│   │   │   ├── TokenBadge.vue
│   │   │   ├── OptimizeOverlay.vue
│   │   │   └── App.vue              ← root content script
│   │   └── index.ts                 ← detect site et load adapter
│   ├── popup/
│   │   ├── index.html
│   │   ├── App.vue
│   │   └── main.ts
│   ├── background/
│   │   └── service-worker.ts
│   ├── storage/
│   │   ├── index.ts
│   │   └── schema.ts
│   ├── lib/
│   │   ├── tokenizer-browser.ts     ← bundle browser de @trimly/core
│   │   ├── cleanFiller-browser.ts
│   │   └── pricing-browser.ts
│   └── icons/
│       ├── 16.png
│       ├── 48.png
│       └── 128.png
├── vite.config.ts
└── package.json
```

## 📄 `manifest.json`

```json
{
  "manifest_version": 3,
  "name": "Trimly",
  "version": "0.1.0",
  "description": "See and trim your AI token spend on claude.ai",
  "icons": {
    "16": "icons/16.png",
    "48": "icons/48.png",
    "128": "icons/128.png"
  },
  "action": {
    "default_popup": "popup/index.html"
  },
  "background": {
    "service_worker": "background/service-worker.js",
    "type": "module"
  },
  "content_scripts": [
    {
      "matches": ["https://claude.ai/*"],
      "js": ["content/index.js"],
      "css": ["content/styles.css"],
      "run_at": "document_idle"
    }
  ],
  "permissions": [
    "storage"
  ],
  "host_permissions": [
    "https://claude.ai/*"
  ],
  "browser_specific_settings": {
    "gecko": {
      "id": "trimly@trimly.dev",
      "strict_min_version": "109.0"
    }
  }
}
```

## 🎨 UI Components (Vue 3)

### TokenBadge.vue

Petit overlay fixé en bas-droite du textarea claude.ai.

**Props** :
- `tokens: number`
- `costUSD: number`
- `currency: 'USD' | 'EUR'`
- `savingsPct?: number`

**Render** :
```html
<div class="trimly-badge">
  <span class="tokens">{{ tokens }} tokens</span>
  <span class="cost">· {{ formattedCost }}</span>
  <button v-if="savingsPct" class="optimize" @click="$emit('optimize')">
    💡 -{{ savingsPct }}%
  </button>
</div>
```

**Style** : transparent, peu intrusif, sombre quand background sombre, position absolute par rapport au textarea claude.ai.

### OptimizeOverlay.vue

S'affiche quand l'user clique sur le bouton 💡.

```html
<div class="trimly-overlay">
  <h3>Version optimisée</h3>
  <p class="original">{{ original }}</p>
  <p class="optimized">{{ optimized }}</p>
  <div class="stats">
    <span>{{ tokensOriginal }} → {{ tokensOptimized }} tokens</span>
    <span class="savings">-{{ savingsPct }}%</span>
  </div>
  <div class="actions">
    <button @click="apply">Appliquer</button>
    <button @click="dismiss">Annuler</button>
  </div>
</div>
```

### Popup App.vue

Stats globales accessibles depuis l'icône Trimly de la barre Chrome :

```html
<div class="popup">
  <h1>Trimly</h1>
  
  <section class="today">
    <h2>Aujourd'hui</h2>
    <BigNumber :value="todayCost" label="Coût estimé" currency="EUR" />
    <BigNumber :value="todayTokens" label="Tokens consommés" />
  </section>
  
  <section class="month">
    <h2>Ce mois</h2>
    <BigNumber :value="monthCost" label="Total" />
    <BigNumber :value="monthSavings" label="Économisé" trend="up" />
  </section>
  
  <section class="comparison">
    <h2>Votre abo vs API équivalente</h2>
    <p>Vous payez 20€/mois</p>
    <p>Équivalent API : ~{{ apiEquivalent }}€/mois</p>
    <p>Différence : <strong>{{ diff }}</strong></p>
  </section>
  
  <footer>
    <button @click="exportData">Exporter pour dashboard</button>
    <button @click="openSettings">Réglages</button>
  </footer>
</div>
```

## 🔌 Adapter claude.ai

`content/sites/claude-ai-adapter.ts` :

```typescript
export const claudeAiAdapter = {
  // Sélecteur du textarea principal (à vérifier sur claude.ai actuel)
  inputSelector: 'div[contenteditable="true"][role="textbox"]',
  
  // Bouton "Send"
  sendButtonSelector: 'button[aria-label*="Send"]',
  
  // Sélecteur du modèle actuel (pour pricing)
  modelSelector: 'button[data-testid="model-selector"]',
  
  /** Extrait le texte du textarea */
  getInputText(el: HTMLElement): string {
    return el.innerText || ''
  },
  
  /** Remplace le contenu du textarea */
  setInputText(el: HTMLElement, text: string): void {
    // claude.ai utilise contenteditable, donc on simule via clipboard ou execCommand
    // Approche fiable : clear + insertText via execCommand
    el.focus()
    document.execCommand('selectAll', false)
    document.execCommand('insertText', false, text)
  },
  
  /** Détecte le modèle actuel */
  getCurrentModel(): string {
    const button = document.querySelector(this.modelSelector)
    return button?.textContent?.trim() ?? 'claude-sonnet-4-5'
  },
  
  /** Hooks d'événements pour observer changements DOM */
  observe(callback: (text: string) => void): () => void {
    const input = document.querySelector(this.inputSelector) as HTMLElement
    if (!input) return () => {}
    
    const listener = () => callback(this.getInputText(input))
    input.addEventListener('input', listener)
    
    return () => input.removeEventListener('input', listener)
  }
}
```

⚠️ **Maintenance** : les sélecteurs DOM de claude.ai peuvent changer. Prévoir :
- Tests visuels automatisés (V2)
- Mécanisme de fallback (essayer plusieurs sélecteurs)
- Logs en debug si extension n'arrive pas à se brancher

## 🗄️ Storage extension

Utilise `chrome.storage.local` (≤ 5MB par origine en MV3) + IndexedDB si besoin de plus.

### Schema events

```typescript
interface BrowserEvent {
  id: string
  timestamp: number
  site: 'claude.ai'
  model: string
  tokens_input: number          // tokens du prompt envoyé
  cost_input_usd: number
  optimization_applied: boolean
  tokens_saved?: number
  cost_saved_usd?: number
}
```

Stockage :
```typescript
const events = await chrome.storage.local.get('events') as Record<string, BrowserEvent>
```

### Limites

- 5 MB de quota = ~50k events max → suffisant pour 1-2 ans d'usage intensif
- Au-delà : auto-rotation (suppression des plus anciens)
- Export possible vers fichier JSON via popup → import dans dashboard via `trimly import-browser`

## 🌍 i18n extension

Détection auto via `chrome.i18n.getUILanguage()`.

Fichiers `_locales/fr/messages.json` et `_locales/en/messages.json` avec format Chrome Extension i18n standard :

```json
{
  "extName": { "message": "Trimly" },
  "extDescription": { "message": "Voyez et allégez vos coûts IA sur claude.ai" },
  "badgeTokens": { "message": "$tokens$ tokens", "placeholders": { "tokens": {"content": "$1"} } },
  "optimizeButton": { "message": "Optimiser" }
}
```

## 🔐 Privacy & Permissions

**Permissions minimales** : `storage` + `host_permissions` claude.ai. **Rien d'autre.**

- Aucun appel réseau externe
- Aucune transmission de données
- Le contenu des prompts **n'est jamais stocké** par défaut (uniquement métadonnées : tokens, coût, timestamp)
- Option `storeContent` opt-in dans settings

Manifest justifie chaque permission dans la description du Chrome Web Store.

## 📦 Build et distribution

### Build avec Vite + plugin Web Extension

`vite.config.ts` :

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import webExtension from 'vite-plugin-web-extension'

export default defineConfig({
  plugins: [
    vue(),
    webExtension({
      manifest: () => import('./src/manifest.json'),
      browser: process.env.BROWSER || 'chrome',
    }),
  ],
})
```

### Commandes

```bash
# Dev avec hot reload
pnpm --filter @trimly/browser-extension dev

# Build production Chrome
pnpm --filter @trimly/browser-extension build

# Build Firefox
BROWSER=firefox pnpm --filter @trimly/browser-extension build

# Package pour upload store
pnpm --filter @trimly/browser-extension package
```

### Publication

- **Chrome Web Store** : compte Developer Dashboard (5$ inscription), zip + screenshots
- **Firefox Add-ons** : compte AMO, soumission via API ou web
- **Edge** : compatible automatiquement avec build Chrome (à soumettre séparément)

## 🧪 Tests extension

### Tests unitaires

- Tokenizer browser bundle
- Détection filler words
- Logique de storage

### Tests E2E (V1.5)

Playwright avec extension chargée :
1. Ouvrir claude.ai (mock ou réel)
2. Vérifier que le badge apparaît
3. Taper un prompt verbeux
4. Vérifier compteur tokens
5. Cliquer optimize
6. Vérifier remplacement texte

```typescript
// extension/__tests__/e2e/claude-ai.test.ts
import { test, expect, chromium } from '@playwright/test'

test('Trimly badge appears on claude.ai', async () => {
  const pathToExtension = require('path').join(__dirname, '../../dist')
  const context = await chromium.launchPersistentContext('', {
    headless: false,
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
    ],
  })
  
  const page = await context.newPage()
  await page.goto('https://claude.ai')
  
  await expect(page.locator('.trimly-badge')).toBeVisible()
})
```

## ⚠️ Risques et mitigations

### Risque 1 — claude.ai change le DOM

**Mitigation** :
- Sélecteurs multiples avec fallback dans l'adapter
- CI check hebdo qui ouvre claude.ai et vérifie que les sélecteurs matchent
- Versioning rapide : si claude.ai change, sortir un patch dans la journée

### Risque 2 — Anthropic interdit les extensions tierces

**Réalité** : claude.ai n'a pas de ToS qui interdit les content scripts non-intrusifs. Mais à surveiller.

**Mitigation** : extension ne modifie pas le comportement de claude.ai, juste l'observe. Si jamais interdit, on pivote vers extension VS Code pour l'écosystème dev.

### Risque 3 — Tokenizer JavaScript lourd

**Mitigation** : bundle browser-only de `@trimly/core/tokenizer/anthropic` avec WASM optimisé. Lazy-load après mount.

### Risque 4 — Performance sur gros prompts

**Mitigation** : debounce des updates compteur (200ms après dernier keystroke), pas tokenizer à chaque caractère.

## 📈 Métriques de succès extension

- Install 1 click depuis store
- Badge apparaît < 1s après ouverture claude.ai
- Compteur mis à jour < 200ms après frappe
- Aucun ralentissement perceptible sur claude.ai
- Stats popup chargent < 500ms
- Toi (Mika) l'utilises tous les jours sur claude.ai

## 🔁 Évolutions V2+

- Adapter ChatGPT (chat.openai.com)
- Adapter Gemini (gemini.google.com)
- Adapter Mistral Chat (chat.mistral.ai)
- Adapter le.chat (Mistral FR)
- Sync auto avec `~/.trimly/events.db` via Native Messaging Host
- Mode "coach" : leaderboard personnel d'amélioration prompts
- Mode équipe : opt-in pour partage anonymisé
