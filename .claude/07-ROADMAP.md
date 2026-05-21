# Trimly — Roadmap 4 jours (pour Claude Code)

## 📋 Mode d'emploi pour Claude Code

Ce fichier décrit **l'ordre exact** de construction. Lire les docs dans l'ordre numérique avant de commencer :

1. `01-PROJECT.md` — vision, scope, non-goals
2. `02-ARCHITECTURE.md` — stack, packages, conventions
3. `03-PLUGIN_CLAUDE_CODE.md` — spec plugin officiel
4. `04-BROWSER_EXTENSION.md` — spec extension
5. `05-FEATURES.md` — détail granulaire par feature
6. `06-TESTING.md` — stratégie tests
7. `07-ROADMAP.md` — ce fichier

À chaque étape, atteindre le **Gate** avant de continuer. Si gate raté, rester sur l'étape.

## 🚀 Pré-requis (avant Jour 1)

- [ ] Vérifier dispo `@trimly/*` sur npm. Si pris, fallback `@trimlydev/*` ou `@gettrimly/*`
- [ ] Vérifier dispo `trimly` sur Chrome Web Store et marketplace Claude Code
- [ ] Vérifier pricing actuel des modèles Anthropic/OpenAI/Mistral sur leurs sites officiels (le pricing dans `05-FEATURES.md` est indicatif)
- [ ] Créer repo GitHub `trimly` (public, Apache 2.0)
- [ ] Confirmer compréhension scope : V1 = plugin + extension + dashboard, scénario A (carte de visite), dogfooding-first

## 📅 Jour 1 — Core + Plugin Claude Code (base)

**Objectif fin de jour 1** : tu peux installer le plugin localement, faire un prompt dans Claude Code, et un event est tracké en SQLite.

### Étape 1.1 — Setup monorepo (1h)

- [ ] `pnpm init` racine
- [ ] `pnpm-workspace.yaml` avec `packages/*` et `apps/*`
- [ ] `turbo.json` : pipelines `build`, `test`, `lint`, `typecheck`
- [ ] `tsconfig.base.json` strict, target ES2022, NodeNext
- [ ] `biome.json` config
- [ ] `.gitattributes` avec `* text=auto eol=lf`
- [ ] `LICENSE` Apache 2.0
- [ ] `.gitignore` (node_modules, dist, .trimly, *.db)
- [ ] `README.md` placeholder
- [ ] **Gate** : `pnpm install` réussit

### Étape 1.2 — `@trimly/core` skeleton + types (1h)

- [ ] `packages/core/package.json` (name `@trimly/core`, license Apache-2.0, exports ESM)
- [ ] `tsup.config.ts` build dual (node + browser)
- [ ] `vitest.config.ts`
- [ ] `tsconfig.json` extends base
- [ ] `src/index.ts` avec exports
- [ ] `src/types/` complet : config, events, providers
- [ ] `src/utils/typedMock.ts`
- [ ] `src/utils/paths.ts` (cross-platform helpers)
- [ ] Premier test trivial
- [ ] **Gate** : `pnpm -F @trimly/core build` réussit, `pnpm -F @trimly/core test` passe

### Étape 1.3 — F1 Tokenization (2h)

- [ ] `src/tokenizer/index.ts` exporte `countTokens`
- [ ] `src/tokenizer/adapters/anthropic.ts`
- [ ] `src/tokenizer/adapters/openai.ts`
- [ ] `src/tokenizer/adapters/mistral.ts` (heuristique acceptable)
- [ ] Cache tokenizer instancié
- [ ] Build dual (node + browser)
- [ ] Tests F1 multilingues
- [ ] **Gate** : tests F1 verts, countTokens cohérent pour 3 providers

### Étape 1.4 — F2 Pricing + coûts (1h)

- [ ] `src/pricing/models.json` à jour mai 2026
- [ ] `src/pricing/index.ts` avec `computeCost`, `formatCost`
- [ ] Tests F2
- [ ] **Gate** : tests F2 verts

### Étape 1.5 — F3 Storage portable (2h)

- [ ] `src/storage/schema.ts` avec migrations SQL
- [ ] `src/storage/adapters/node-sqlite.ts`
- [ ] `src/storage/adapters/libsql.ts`
- [ ] `src/storage/factory.ts` avec auto-détection
- [ ] Mode WAL activé
- [ ] Tests F3 sur les deux adapters (mêmes tests)
- [ ] **Gate** : les deux adapters passent les mêmes tests

### Étape 1.6 — F8 Plugin structure (1h)

- [ ] `apps/claude-code-plugin/` créé
- [ ] `.claude-plugin/plugin.json` conforme
- [ ] `hooks/hooks.json` avec 5 hooks déclarés
- [ ] Dossiers `commands/`, `skills/`, `scripts/`
- [ ] Symlink local `~/.claude/plugins/trimly` → `apps/claude-code-plugin`
- [ ] **Gate** : Claude Code charge le plugin (vérification via `/plugin list`)

### Étape 1.7 — F9 + F10 Hooks UserPromptSubmit + Stop (3h)

- [ ] `hooks/user-prompt-submit.mjs` :
  - Parse stdin
  - countTokens du prompt
  - cleanFiller en mode detection
  - computeCost input estimé
  - Insert event "pending" en SQLite
  - Stdout silencieux par défaut
- [ ] `hooks/stop.mjs` :
  - Parse stdin
  - Lit transcript JSONL
  - Extrait usage du dernier message assistant
  - Update event pending → completed
- [ ] Tests F9 + F10
- [ ] **Gate** : test manuel concluant
  ```
  $ claude
  > Hello world
  $ # Dans une autre fenêtre :
  $ sqlite3 ~/.trimly/events.db "SELECT * FROM events"
  # → un event "completed" avec tokens et cost
  ```

### 🚧 Fin de Jour 1 — Gate global

```bash
pnpm install
pnpm turbo build typecheck lint test

# Et le scénario manuel :
# 1. Plugin installé localement
# 2. Lance claude, fais un prompt
# 3. Vérifie SQLite → event tracké
```

## 📅 Jour 2 — Plugin complet + CLI

**Objectif fin de jour 2** : `/trimly:stats` fonctionne, plugin complet, CLI publiable.

### Étape 2.1 — F11 Hooks restants (1h)

- [ ] `hooks/pre-compact.mjs` : log compaction
- [ ] `hooks/session-start.mjs` : insert row sessions
- [ ] `hooks/session-end.mjs` : update sessions + optional summary stdout
- [ ] Tests
- [ ] **Gate** : sessions trackées dans table `sessions`

### Étape 2.2 — F4 cleanFiller 6 langues (3h)

- [ ] `src/strategies/cleanFiller/index.ts`
- [ ] `patterns/fr.ts` (20+ patterns)
- [ ] `patterns/en.ts` (20+ patterns)
- [ ] `patterns/es.ts` (15+ patterns)
- [ ] `patterns/de.ts` (15+ patterns)
- [ ] `patterns/it.ts` (15+ patterns)
- [ ] `patterns/pt.ts` (15+ patterns)
- [ ] Détection auto langue (heuristique mots-clés)
- [ ] Modes "detect" et "apply"
- [ ] Tests par langue
- [ ] `CONTRIBUTING_LANGUAGES.md`
- [ ] **Gate** : tests F4 verts pour 6 langues

### Étape 2.3 — F5 + F6 + F7 Stratégies restantes (1h)

- [ ] `compactWhitespace.ts` + tests
- [ ] `deduplicate.ts` + tests
- [ ] `compactHistory.ts` mode shadow + tests
- [ ] Pipeline orchestration `pipeline.ts`
- [ ] **Gate** : 4 stratégies fonctionnelles

### Étape 2.4 — F12 + F13 + F14 Commandes slash (2h)

- [ ] `commands/stats.md` + `commands/stats.mjs`
- [ ] `commands/dashboard.md` + `commands/dashboard.mjs`
- [ ] `commands/config.md` + `commands/config.mjs`
- [ ] `commands/clear.md` + `commands/clear.mjs`
- [ ] Tests via `execa`
- [ ] **Gate** : `/trimly:stats` affiche stats ASCII dans Claude Code

### Étape 2.5 — F30 CLI `trimly` (1h)

- [ ] `packages/cli/` setup
- [ ] `bin/trimly` avec shebang
- [ ] Commandes : `init`, `dashboard`, `stats`, `clear`, `export`
- [ ] Tests cross-platform via `execa`
- [ ] **Gate** : `npx trimly init` fonctionne sur Mac (test manuel)

### Étape 2.6 — F15 Skill prompt-optimization (30min, P2)

- [ ] `skills/prompt-optimization/SKILL.md`
- [ ] **Gate** : Claude reconnaît la skill quand user demande conseil

### 🚧 Fin de Jour 2 — Gate global

```bash
# Plugin pleinement fonctionnel
claude
> S'il te plaît, est-ce que tu pourrais m'expliquer Redis ?
# → 💡 Trimly: suggestion affichée

> /trimly:stats
# → tableau ASCII

> /trimly:dashboard
# → ouvre navigateur sur localhost:3737 (même si dashboard vide pour l'instant)
```

## 📅 Jour 3 — Dashboard + Extension navigateur

**Objectif fin de jour 3** : dashboard Nuxt fonctionnel, extension chargeable en local.

### Étape 3.1 — F23 Setup Nuxt + i18n (1h)

- [ ] `packages/dashboard/` créé
- [ ] Nuxt 3 + UnoCSS + `@nuxtjs/i18n`
- [ ] `nuxt.config.ts` minimal
- [ ] Locales `fr.json` et `en.json` (clés plates)
- [ ] Layout par défaut + Sidebar
- [ ] **Gate** : `pnpm --filter @trimly/dashboard dev` lance Nuxt sur 3737

### Étape 3.2 — F24 API routes SQLite (1h)

- [ ] `server/api/events.get.ts` avec pagination cursor
- [ ] `server/api/stats.get.ts` agrégations
- [ ] `server/api/timeline.get.ts`
- [ ] Lecture via `@trimly/core` storage factory
- [ ] **Gate** : API retourne du JSON avec données réelles

### Étape 3.3 — F25 Page Overview (2h)

- [ ] `pages/index.vue`
- [ ] Composant `base/BigNumber.vue`
- [ ] Toggle période (aujourd'hui, 7j, 30j, all)
- [ ] Comparateur abo vs API
- [ ] Premier chart timeline
- [ ] **Gate** : page affiche données réelles

### Étape 3.4 — F26 + F28 Events + Settings (2h)

- [ ] `pages/events.vue` + `EventsTable.vue` + filtres
- [ ] `pages/settings.vue` (langue, devise, read-only config)
- [ ] **Gate** : navigation OK, données cohérentes

### Étape 3.5 — F16 + F17 Extension setup + adapter (2h)

- [ ] `apps/browser-extension/` setup avec Vite + plugin web-extension
- [ ] `src/manifest.json` MV3
- [ ] `src/content/sites/claude-ai-adapter.ts`
- [ ] Content script qui détecte textarea claude.ai
- [ ] Build Chrome OK
- [ ] **Gate** : extension chargée en mode dev dans Chrome via "Load unpacked"

### 🚧 Fin de Jour 3 — Gate global

```bash
# Dashboard
pnpm --filter @trimly/dashboard dev
# → http://localhost:3737 fonctionne, affiche données réelles

# Extension
# Chrome → chrome://extensions → Load unpacked → apps/browser-extension/dist
# → ouvre claude.ai → vérifie console pas d'erreur
```

## 📅 Jour 4 — UI extension + polish + publication

**Objectif fin de jour 4** : tout est en place, premières captures pour LinkedIn.

### Étape 4.1 — F18 TokenBadge temps réel (2h)

- [ ] `src/content/ui/TokenBadge.vue`
- [ ] Composable `useTokenCounter(text, model)`
- [ ] Mount en shadow DOM
- [ ] Debounce 200ms
- [ ] Tests
- [ ] **Gate** : badge apparaît sur claude.ai et compteur fonctionne

### Étape 4.2 — F19 OptimizeOverlay (2h)

- [ ] `src/content/ui/OptimizeOverlay.vue`
- [ ] Click sur 💡 ouvre l'overlay
- [ ] Bouton Appliquer → remplace contenu textarea via adapter
- [ ] Tests
- [ ] **Gate** : remplacement texte fonctionnel sur claude.ai

### Étape 4.3 — F20 + F21 Popup + i18n (1h)

- [ ] `src/popup/App.vue` avec stats Aujourd'hui/Mois
- [ ] `_locales/fr/` et `_locales/en/`
- [ ] Bouton export JSON
- [ ] **Gate** : popup accessible et stats correctes

### Étape 4.4 — F27 Page Savings + F29 Charts (1h)

- [ ] `pages/savings.vue` avec décomposition
- [ ] Wrapper `base/Chart.vue` (unovis-vue)
- [ ] Charts timeline + pie modèles + bar savings
- [ ] **Gate** : charts s'affichent avec données réelles

### Étape 4.5 — F31 `trimly import-browser` (30min, P2)

- [ ] Commande CLI
- [ ] Validation schema
- [ ] Insert avec dedup
- [ ] **Gate** : import depuis JSON exporté fonctionne

### Étape 4.6 — F32 CI multi-OS (1h)

- [ ] `.github/workflows/ci.yml` avec matrix
- [ ] Push sur GitHub → workflow vert sur 9 combinaisons
- [ ] **Gate** : CI verte sur Ubuntu+macOS+Windows × Node 20+22+24

### Étape 4.7 — Publication & polish (2h)

- [ ] `README.md` racine qui claque (gif démo, install, exemples)
- [ ] `apps/claude-code-plugin/README.md` détaillé
- [ ] `apps/browser-extension/README.md` détaillé
- [ ] Documentation `docs/` site Nuxt Content (placeholder accepté)
- [ ] Tags v0.1.0 sur tous les packages via changesets
- [ ] Publication npm : `@trimly/core`, `@trimly/cli`, `@trimly/dashboard`
- [ ] Build extension : `pnpm package` → zip Chrome + Firefox
- [ ] Soumission marketplace Claude Code (lien repo GitHub)
- [ ] Soumission Chrome Web Store (zip + screenshots + descriptions FR + EN)
- [ ] Soumission Firefox Add-ons
- [ ] **Gate final** : tout est publié, accessible

### 🚧 Fin de Jour 4 — Gate global

```bash
# Plugin Claude Code installable via marketplace
/plugin install trimly@trimlydev

# Extension installable via store (en review au début, dispo dans 24-72h)
# Dashboard fonctionnel
# CLI publié npm
# Repo GitHub public avec stars qui commencent
```

## 📸 Action LinkedIn immédiate

Dans la foulée du Jour 4 :

- [ ] Capture d'écran de TON dashboard avec TES vraies données
- [ ] Capture du badge Trimly sur claude.ai
- [ ] Premier post LinkedIn : "J'ai mesuré ma consommation Claude Code pendant X jours, voici ce que ça donne"
- [ ] Repo GitHub public mis en avant sur profil

## 🚨 Garde-fous à respecter en continu

1. **Pas d'`any`** dans le code. Type tout.
2. **Pas de dépendance native** : interdit `better-sqlite3`, `node-gyp`, etc.
3. **Tests écrits AVANT** la feature, ou en même temps.
4. **JSDoc sur les exports publics**.
5. **Pas de feature hors scope** (cf. PROJECT.md non-goals).
6. **Cross-platform à chaque commit** : `path.join`, `homedir()`, `cross-spawn`.
7. **Privacy strict** : zéro appel réseau externe.

Si la complexité dépasse la planification :
- ❌ Ne PAS ajouter de scope
- ✅ Documenter en TODO
- ✅ Passer à l'étape suivante
- ✅ Revenir si temps reste

## 📝 Convention de commit

```
feat(core): add tokenizer adapter for Mistral
fix(plugin): handle empty prompt in user-prompt-submit hook
test(core): add fixtures for verbose DE prompts
docs(readme): add quickstart for plugin install
chore(ci): add Windows to matrix
```

## ✅ Checklist finale V1

- [ ] Tous les tests passent localement et en CI
- [ ] `pnpm turbo build typecheck lint test` vert
- [ ] Plugin Claude Code chargeable et fonctionnel
- [ ] Extension Chrome installable
- [ ] Extension Firefox installable
- [ ] Dashboard accessible via `/trimly:dashboard` ou `npx trimly dashboard`
- [ ] CLI publiée npm (`@trimly/cli`)
- [ ] Core publiée npm (`@trimly/core`)
- [ ] Dashboard publié npm (`@trimly/dashboard`)
- [ ] README racine complet avec démo
- [ ] CONTRIBUTING_LANGUAGES.md prêt
- [ ] Tag v0.1.0 + release notes
- [ ] Plugin soumis à la marketplace Claude Code
- [ ] Extension soumise à Chrome Web Store
- [ ] Extension soumise à Firefox Add-ons
- [ ] **TU utilises Trimly toi-même tous les jours**
- [ ] Premier post LinkedIn rédigé (draft)
- [ ] Topics GitHub : `llm`, `ai`, `cost-optimization`, `claude-code`, `anthropic`, `openai`, `typescript`, `nuxt`
