# Trimly — Architecture

## 🏗️ Vue d'ensemble du monorepo

```
trimly/
├── packages/
│   ├── core/                     ← @trimly/core - logique partagée
│   ├── dashboard/                ← @trimly/dashboard - Nuxt 3 local
│   └── cli/                      ← @trimly/cli - binary `trimly`
├── apps/
│   ├── claude-code-plugin/       ← plugin Claude Code (.claude-plugin/)
│   └── browser-extension/        ← extension Chrome/Firefox
├── examples/
│   └── dogfooding-screenshots/   ← captures de TON usage pour LinkedIn
├── docs/                         ← les .md de spec (PROJECT, ARCHITECTURE, etc.)
├── .github/
│   └── workflows/
│       └── ci.yml                ← matrix multi-OS + multi-Node
├── .gitattributes                ← force LF line endings
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
├── biome.json
└── LICENSE                       ← Apache 2.0
```

## 🛠️ Stack technique

### Outillage commun
- **Package manager** : pnpm 9+ (workspaces)
- **Monorepo** : Turborepo
- **Bundler** : tsup (ESM + CJS + .d.ts) pour packages, Vite pour extension
- **Runtime cible** : Node.js 20+ (LTS), Bun, Deno (pour le core)
- **TypeScript** : 5.6+, `strict: true`, pas de `any`
- **Linter/Formatter** : Biome
- **Tests** : Vitest + `vi.mock` strictement typé
- **Git hooks** : simple-git-hooks + lint-staged

### Runtime — Storage portable

Stratégie multi-runtime pour Mac/Linux/Windows sans compilation native :

```typescript
// packages/core/src/storage/factory.ts
export async function createStorage(path: string): Promise<TrimlyStorage> {
  // 1. node:sqlite si Node 22.5+ (préféré, natif, zéro install)
  if (await hasNodeSqlite()) {
    const { NodeSqliteStorage } = await import('./adapters/node-sqlite.js')
    return new NodeSqliteStorage(path)
  }
  // 2. @libsql/client fallback (pur JS, universel)
  const { LibsqlStorage } = await import('./adapters/libsql.js')
  return new LibsqlStorage(path)
}
```

**Aucune dépendance native interdite** : pas de `better-sqlite3`, pas de `node-gyp`.

### Spécifique au plugin Claude Code

- **Runtime hooks** : Node.js, exécuté par Claude Code via `command` type
- **Bun supporté** : si l'utilisateur a Bun, on peut exposer les hooks en `bun run`
- **Plugin format** : conforme à la doc officielle Anthropic `.claude-plugin/`
- **Distribution** : marketplace officielle Anthropic + repo GitHub public

### Spécifique à l'extension navigateur

- **Manifest V3** (Chrome) compatible Firefox via `browser_specific_settings`
- **Build** : Vite + plugin `vite-plugin-web-extension`
- **UI** : Vue 3 (ton terrain) + UnoCSS
- **Storage** : `chrome.storage.local` + IndexedDB pour historique
- **Cibles V1** : claude.ai uniquement (V2 : ChatGPT, Gemini, Mistral)

### Spécifique au dashboard

- **Nuxt 3** + UnoCSS + TypeScript strict
- **Charts** : `unovis-vue` ou wrapper Recharts via vue-chartjs
- **i18n** : `@nuxtjs/i18n` avec FR + EN, clés plates
- **Lecture storage** : via `@trimly/core` storage adapter
- **Lancement** : `npx trimly dashboard` ou `/trimly:dashboard` (depuis Claude Code)

### Conventions de code (rappel hard rules)

- **Imports** : `toRef` (pas `ref` réactif sur prop) côté Nuxt
- **Types** : pas de `any`, `DeepPartial<T>` via `typedMock` pour mocks
- **Tests** : `shallowMount`, pas de mock manuel des child components
- **Mocks** : `vi.mock` strictement typé
- **i18n keys** : plates style `dashboard.title`, `events.empty`
- **Composants Vue** : pas de `UButton`, composants natifs uniquement
- **Dossiers Nuxt** : `base`, `layout`, `component`, `common` uniquement

## 🪟 Portabilité cross-platform (RÈGLES STRICTES)

### Règle 1 — Chemins de fichiers

```typescript
// ❌ INTERDIT
const path = '.trimly/events.db'

// ✅ OBLIGATOIRE
import { join } from 'node:path'
const path = join(homedir(), '.trimly', 'events.db')
```

### Règle 2 — Variables d'environnement

```typescript
import { homedir } from 'node:os'
const home = homedir()
```

### Règle 3 — Spawn de process

```typescript
import spawn from 'cross-spawn'
spawn('npm', ['install'])
```

### Règle 4 — Line endings

`.gitattributes` :
```
* text=auto eol=lf
*.bat text eol=crlf
*.cmd text eol=crlf
```

### Règle 5 — CI multi-OS

`.github/workflows/ci.yml` :
```yaml
strategy:
  matrix:
    os: [ubuntu-latest, macos-latest, windows-latest]
    node: [20, 22, 24]
```

### Règle 6 — Storage globalisé

Le storage du plugin Claude Code et de l'extension doivent partager le **même fichier SQLite** pour vue unifiée dans le dashboard.

**Emplacement standard** : `~/.trimly/events.db`

Plugin Claude Code → écrit directement dans `~/.trimly/events.db`  
Extension navigateur → utilise `chrome.storage.local` + export vers `~/.trimly/events.db` via Native Messaging Host (V1.5) ou fichier téléchargé manuel (V1).

**V1 simplifié** : extension a son propre storage IndexedDB. Le dashboard liera les deux via une commande `trimly import-browser` qui fusionne. Les sync auto = V2.

## 📦 Détail des packages

### `@trimly/core` (cœur partagé)

```
core/
├── src/
│   ├── index.ts                    ← export public
│   ├── strategies/
│   │   ├── index.ts
│   │   ├── cleanFiller/
│   │   │   ├── index.ts
│   │   │   └── patterns/
│   │   │       ├── fr.ts
│   │   │       ├── en.ts
│   │   │       ├── es.ts
│   │   │       ├── de.ts
│   │   │       ├── it.ts
│   │   │       └── pt.ts
│   │   ├── compactWhitespace.ts
│   │   ├── deduplicate.ts
│   │   └── compactHistory.ts
│   ├── tokenizer/
│   │   ├── index.ts
│   │   └── adapters/               ← anthropic, openai, mistral
│   ├── pricing/
│   │   ├── index.ts
│   │   └── models.json
│   ├── storage/
│   │   ├── index.ts
│   │   ├── factory.ts
│   │   ├── schema.ts
│   │   └── adapters/
│   │       ├── node-sqlite.ts
│   │       └── libsql.ts
│   ├── tracking/
│   │   ├── index.ts
│   │   └── events.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── config.ts
│   │   ├── events.ts
│   │   └── providers.ts
│   └── utils/
│       ├── typedMock.ts
│       └── paths.ts
├── package.json
├── tsup.config.ts
├── vitest.config.ts
└── tsconfig.json
```

**Pas exposé en lib npm publique en V1.** Utilisé en interne par le plugin et le dashboard. Si V2 traction, on publie pour ouvrir aux devs API.

### `@trimly/cli` 

Binary `trimly` cross-platform pour utilisation hors Claude Code.

```
cli/
├── src/
│   ├── index.ts                    ← shebang + dispatcher
│   ├── commands/
│   │   ├── init.ts
│   │   ├── dashboard.ts
│   │   ├── stats.ts
│   │   ├── clear.ts
│   │   ├── export.ts
│   │   └── import-browser.ts       ← V1 : import events extension
│   └── utils/
│       ├── findStorage.ts
│       └── spawn.ts
└── bin/
    └── trimly                      ← entry point avec shebang
```

**Dépendances** : `@trimly/core`, `commander`, `kleur`, `cross-spawn`, `prompts`.

### `apps/claude-code-plugin/` — Le plugin Claude Code

Structure conforme à la doc officielle Anthropic :

```
claude-code-plugin/
├── .claude-plugin/
│   └── plugin.json                 ← manifest officiel
├── hooks/
│   ├── hooks.json                  ← déclaration des hooks
│   ├── user-prompt-submit.ts       ← tracke prompt input + détecte filler
│   ├── stop.ts                     ← finalise event avec output tokens
│   ├── pre-compact.ts              ← logge avant compaction historique
│   ├── session-start.ts            ← initialise session ID
│   └── session-end.ts              ← finalise session stats
├── commands/
│   ├── stats.md                    ← /trimly:stats
│   ├── dashboard.md                ← /trimly:dashboard
│   ├── config.md                   ← /trimly:config
│   └── clear.md                    ← /trimly:clear
├── skills/
│   └── prompt-optimization/
│       └── SKILL.md                ← skill optionnelle de coaching
├── scripts/
│   └── install.ts                  ← post-install : init ~/.trimly/
├── package.json                    ← dépendance @trimly/core
└── README.md
```

**Dépendances** : `@trimly/core`, `@anthropic-ai/claude-code` (peer pour les types des hooks).

### `apps/browser-extension/` — L'extension navigateur

```
browser-extension/
├── src/
│   ├── manifest.json               ← V3, Chrome + Firefox
│   ├── content/
│   │   ├── claude-ai.ts            ← injection dans claude.ai
│   │   └── ui/
│   │       ├── TokenBadge.vue      ← compteur tokens overlay
│   │       └── OptimizeButton.vue  ← bouton d'optimisation
│   ├── popup/
│   │   ├── index.html
│   │   ├── App.vue                 ← stats globales + settings
│   │   └── main.ts
│   ├── background/
│   │   └── service-worker.ts       ← gère storage cross-tabs
│   ├── storage/
│   │   ├── index.ts                ← wrapper chrome.storage
│   │   └── schema.ts
│   ├── lib/
│   │   └── trimly-core-browser.ts  ← bundle browser-friendly de @trimly/core
│   └── icons/
│       ├── 16.png
│       ├── 48.png
│       └── 128.png
├── vite.config.ts
└── package.json
```

**Important** : `@trimly/core` doit avoir un build "browser" sans dépendances Node (`node:sqlite`, `node:path`, etc.). Achievement : exporter les modules "pure" (tokenizer, strategies, pricing) séparément des modules "node" (storage).

### `packages/dashboard/` — Le dashboard Nuxt 3

```
dashboard/
├── pages/
│   ├── index.vue                   ← overview
│   ├── events.vue                  ← liste paginée
│   ├── savings.vue                 ← économies + simulations
│   └── settings.vue                ← config + langue + devise
├── components/
│   ├── base/
│   │   ├── BigNumber.vue
│   │   ├── Chart.vue
│   │   └── LangSwitcher.vue
│   ├── layout/
│   │   └── Sidebar.vue
│   ├── component/
│   │   ├── EventsTable.vue
│   │   ├── StrategyBadge.vue
│   │   └── ProviderPie.vue
│   └── common/
│       └── CostFormat.vue
├── server/
│   └── api/
│       ├── events.get.ts
│       ├── stats.get.ts
│       └── timeline.get.ts
├── composables/
│   ├── useEvents.ts
│   ├── useStats.ts
│   └── useLocale.ts
├── i18n/
│   ├── fr.json
│   └── en.json
└── nuxt.config.ts
```

## 🔄 Flux d'exécution

### Flux Plugin Claude Code

```
1. Dev tape un prompt dans Claude Code
2. Claude Code déclenche `UserPromptSubmit` hook
3. Hook reçoit JSON sur stdin avec :
   { session_id, transcript_path, cwd, prompt }
4. Hook trimly-user-prompt-submit.ts :
   a. Compte tokens du prompt (tokenizer Anthropic)
   b. Applique cleanFiller en mode "detection" (compte gains potentiels)
   c. Calcule coût estimé selon modèle (lu depuis env Claude Code)
   d. Insère event "pending" dans SQLite (id, session_id, timestamp, tokens_input, cost_estimated)
   e. Si filler détecté ET dépasse seuil : affiche suggestion en stderr
   f. Retourne sur stdout (no-op ou message info)
5. Claude Code traite le prompt et génère la réponse
6. Claude Code déclenche `Stop` hook avec usage réel
7. Hook trimly-stop.ts :
   a. Récupère tokens output réels depuis transcript
   b. Update event "pending" → "completed"
   c. Calcule coût réel
8. Le dev peut faire `/trimly:stats` ou `/trimly:dashboard` à tout moment
```

### Flux Extension navigateur

```
1. Dev ouvre claude.ai dans son navigateur
2. Content script s'injecte au load
3. Détecte le textarea de saisie (sélecteur DOM stable)
4. Sur chaque `input` event :
   a. Lit le texte courant
   b. Compte tokens (bundle browser de tokenizer)
   c. Update overlay TokenBadge : "247 tokens · ~$0.003"
   d. Si filler détecté : active bouton OptimizeButton
5. Sur click OptimizeButton :
   a. Applique cleanFiller
   b. Remplace contenu textarea via dispatch d'événements DOM
6. Sur Enter / Send :
   a. Stocke event dans chrome.storage.local
   b. Reset compteur session
7. Popup accessible pour stats globales
```

### Flux Dashboard

```
1. Lancé via `/trimly:dashboard` (depuis Claude Code) ou `npx trimly dashboard`
2. Démarre Nuxt sur localhost:3737
3. server/api/* lit ~/.trimly/events.db via @trimly/core storage
4. Pages affichent les données
5. Settings permet : switcher langue, switcher devise, import depuis extension
```

## 🗂️ Storage SQLite (schéma global)

**Emplacement** : `~/.trimly/events.db` par défaut.

**Schema** (cf. FEATURES.md pour détail) :
- `events` : une ligne par appel LLM (depuis plugin OU extension importée)
- `sessions` : session_id, début, fin, totals
- `optimizations` : détail des stratégies appliquées par event
- `meta` : version schema, dates

**Source** : champ `source` dans `events` avec valeurs `'claude-code' | 'browser-extension'`.

**Mode** : WAL activé.

## 🔐 Privacy

- **Aucun appel réseau externe** depuis Trimly (plugin, extension, dashboard)
- **Aucune télémétrie** envoyée à un serveur tiers
- Le contenu des prompts **n'est pas stocké** par défaut (uniquement métadonnées)
- Option `storeContent: true` opt-in pour debug local
- Extension navigateur : storage 100% local, aucune transmission

## 📐 Versioning et publication

- **Semver strict** sur tous les packages
- Tous les packages versionnent ensemble (fixed mode Turborepo) en V1
- Releases via `changesets`
- **Plugin Claude Code** : publication via marketplace officielle + repo GitHub
- **Extension** : Chrome Web Store + Firefox Add-ons
- **CLI/Core/Dashboard** : npm

## 🚀 Distribution

- **Marketplace Claude Code** : `/plugin marketplace add trimlydev/plugins` puis `/plugin install trimly@trimlydev`
- **Chrome Web Store** : trimly.dev/chrome → submit officiel
- **Firefox Add-ons** : addons.mozilla.org
- **npm** : `@trimly/core`, `@trimly/cli`, `@trimly/dashboard` publics
- **Site** : trimly.dev (Nuxt Content) avec docs unifiées
