# Trimly — Features V1 (granulaire)

## Vue d'ensemble

| ID | Surface | Feature | Difficulté | Priorité |
|---|---|---|---|---|
| **CORE** | core | | | |
| F1 | core | Tokenization multi-provider | 2/5 | P0 |
| F2 | core | Calcul de coût + pricing JSON | 1/5 | P0 |
| F3 | core | Storage portable (node:sqlite + libsql) | 3/5 | P0 |
| F4 | core | Stratégie cleanFiller (6 langues) | 3/5 | P0 |
| F5 | core | Stratégie compactWhitespace | 1/5 | P0 |
| F6 | core | Stratégie deduplicate | 2/5 | P1 |
| F7 | core | Stratégie compactHistory (shadow) | 3/5 | P1 |
| **PLUGIN** | plugin | | | |
| F8 | plugin | Plugin manifest + structure | 1/5 | P0 |
| F9 | plugin | Hook UserPromptSubmit | 3/5 | P0 |
| F10 | plugin | Hook Stop (récup tokens output) | 3/5 | P0 |
| F11 | plugin | Hooks PreCompact + SessionStart + SessionEnd | 2/5 | P1 |
| F12 | plugin | Commande `/trimly:stats` | 2/5 | P0 |
| F13 | plugin | Commande `/trimly:dashboard` | 2/5 | P0 |
| F14 | plugin | Commandes `/trimly:config` + `/trimly:clear` | 1/5 | P1 |
| F15 | plugin | Skill prompt-optimization | 1/5 | P2 |
| **EXTENSION** | extension | | | |
| F16 | extension | Manifest V3 + setup Vite | 2/5 | P0 |
| F17 | extension | Content script claude.ai + adapter | 3/5 | P0 |
| F18 | extension | TokenBadge UI + temps réel | 3/5 | P0 |
| F19 | extension | OptimizeOverlay + remplacement texte | 3/5 | P0 |
| F20 | extension | Popup stats globales | 2/5 | P1 |
| F21 | extension | i18n Chrome (FR + EN) | 1/5 | P1 |
| F22 | extension | Export pour dashboard | 2/5 | P2 |
| **DASHBOARD** | dashboard | | | |
| F23 | dashboard | Setup Nuxt 3 + i18n + UnoCSS | 2/5 | P0 |
| F24 | dashboard | API routes lecture SQLite | 2/5 | P0 |
| F25 | dashboard | Page Overview avec big numbers | 2/5 | P0 |
| F26 | dashboard | Page Events paginée | 2/5 | P0 |
| F27 | dashboard | Page Savings + section shadow | 3/5 | P1 |
| F28 | dashboard | Page Settings (config + langue + devise) | 2/5 | P1 |
| F29 | dashboard | Charts (timeline + camembert) | 3/5 | P1 |
| **CLI** | cli | | | |
| F30 | cli | Binary `trimly` + commandes | 2/5 | P0 |
| F31 | cli | Commande `trimly import-browser` | 2/5 | P2 |
| **CI** | infra | | | |
| F32 | infra | GitHub Actions matrix multi-OS | 2/5 | P0 |

## F1 — Tokenization multi-provider

**Objectif** : compter exactement les tokens d'un payload selon le provider/modèle, en Node et en browser.

### Tâches

- [ ] `src/tokenizer/index.ts` avec `countTokens(provider, model, text|messages)`
- [ ] Adapter `anthropic` : `@anthropic-ai/tokenizer` local + option async via API
- [ ] Adapter `openai` : `js-tiktoken` (encodings `cl100k_base`, `o200k_base`)
- [ ] Adapter `mistral` : heuristique ou `mistral-tokenizer-js`
- [ ] Cache du tokenizer instancié
- [ ] Build dual : ESM Node + ESM browser-safe (sans deps Node)
- [ ] Tests avec fixtures FR, EN, ES, DE, IT, PT, JA, ZH

### Acceptance

```typescript
const t = await countTokens('anthropic', 'claude-sonnet-4-5', 'Hello world')
expect(t).toBeGreaterThan(0)
expect(t).toBeLessThan(10)
```

## F2 — Calcul de coût + pricing JSON

**Objectif** : convertir usage tokens en coût USD/EUR avec pricing à jour.

### Tâches

- [ ] `src/pricing/models.json` mis à jour mai 2026 :
  - Anthropic : claude-sonnet-4-7, claude-opus-4-7, claude-haiku-4-5
  - OpenAI : gpt-4o, gpt-4o-mini, gpt-5 (à vérifier), o3, o3-mini
  - Mistral : mistral-large, mistral-small, codestral
- [ ] Pricing cache read/write Anthropic inclus
- [ ] `computeCost(provider, model, usage): number`
- [ ] `formatCost(cost, currency, locale): string` via `Intl.NumberFormat`
- [ ] **Vérifier pricing sur sites officiels avant Jour 1**
- [ ] Mécanisme de mise à jour : `models.json` peut être fetché depuis `https://trimly.dev/models.json` au démarrage du dashboard

### Acceptance

```typescript
const cost = computeCost('anthropic', 'claude-sonnet-4-5', {
  input_tokens: 1000, output_tokens: 500
})
expect(cost).toBeCloseTo(0.0105, 4)
```

## F3 — Storage portable

**Objectif** : SQLite cross-platform sans dépendance native.

### Tâches

- [ ] `src/storage/factory.ts` avec auto-détection
- [ ] `src/storage/adapters/node-sqlite.ts` (Node 22.5+)
- [ ] `src/storage/adapters/libsql.ts` (fallback universel)
- [ ] Interface `TrimlyStorage` partagée
- [ ] `src/storage/schema.ts` avec migrations
- [ ] Mode WAL activé sur les deux adapters
- [ ] Auto-création de `~/.trimly/` avec `path.join` + `homedir()`
- [ ] Tests : les deux adapters passent les mêmes tests

### Schema

```sql
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,           -- 'claude-code' | 'browser-extension'
  started_at INTEGER NOT NULL,
  ended_at INTEGER,
  cwd TEXT,
  total_tokens_input INTEGER DEFAULT 0,
  total_tokens_output INTEGER DEFAULT 0,
  total_cost_usd REAL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  session_id TEXT REFERENCES sessions(id),
  timestamp INTEGER NOT NULL,
  source TEXT NOT NULL,
  
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  
  tokens_input INTEGER NOT NULL,
  tokens_output INTEGER DEFAULT 0,
  tokens_cache_read INTEGER DEFAULT 0,
  tokens_cache_write INTEGER DEFAULT 0,
  
  tokens_saved_optim INTEGER DEFAULT 0,
  tokens_saved_shadow INTEGER DEFAULT 0,
  
  cost_usd REAL NOT NULL,
  cost_saved_usd REAL DEFAULT 0,
  cost_saved_shadow_usd REAL DEFAULT 0,
  
  duration_ms INTEGER,
  status TEXT NOT NULL DEFAULT 'completed',  -- 'pending' | 'completed'
  
  filler_detected BOOLEAN DEFAULT FALSE,
  strategies_applied TEXT,  -- JSON array
  
  prompt_preview TEXT,      -- premiers 200 chars uniquement, opt-in
  tags TEXT
);

CREATE INDEX idx_events_timestamp ON events(timestamp);
CREATE INDEX idx_events_session ON events(session_id);
CREATE INDEX idx_events_provider_model ON events(provider, model);
CREATE INDEX idx_events_source ON events(source);

CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
```

## F4 — Stratégie cleanFiller (6 langues)

**Objectif** : supprimer les formules de politesse et bavardage en FR, EN, ES, DE, IT, PT.

### Tâches

- [ ] `src/strategies/cleanFiller/index.ts` avec fonction principale
- [ ] 6 fichiers `patterns/<lang>.ts` avec 20+ patterns chacun
- [ ] Détection automatique de langue via heuristique simple (mots-clés)
- [ ] Mode "detect only" (compte sans modifier) vs "apply" (modifie le texte)
- [ ] Support `customPatterns` pour extension
- [ ] Support `preserve` (mots à protéger)
- [ ] Tests avec 20+ fixtures par langue
- [ ] `CONTRIBUTING_LANGUAGES.md` doc

### Patterns FR (échantillon — 20+ à compléter)

```typescript
export const FR_FILLER_PATTERNS: FillerPattern[] = [
  { id: 'fr-politeness-please', pattern: /\bs'?il (te|vous) pla[iî]t\b/gi, replace: '' },
  { id: 'fr-politeness-thanks-advance', pattern: /\bmerci d'avance\b/gi, replace: '' },
  { id: 'fr-politeness-bother', pattern: /\bsi (ça|cela) ne (te|vous) (dérange|gêne) pas\b/gi, replace: '' },
  { id: 'fr-hedge-wondering', pattern: /\bje me demandais si\b/gi, replace: '' },
  { id: 'fr-hedge-could-you', pattern: /\best-ce que (tu|vous) (pourrais|pourriez)\b/gi, replace: '' },
  { id: 'fr-filler-actually', pattern: /\b(en fait|du coup|en gros|voilà|bref)\b/gi, replace: '' },
  { id: 'fr-reformulation-broad', pattern: /\bdans les grandes lignes\b/gi, replace: '' },
  { id: 'fr-reformulation-allow', pattern: /\bsi je peux me permettre\b/gi, replace: '' },
  // ... 12+ autres
]
```

### Patterns EN (échantillon)

```typescript
export const EN_FILLER_PATTERNS: FillerPattern[] = [
  { id: 'en-please', pattern: /\bplease\b/gi, replace: '' },
  { id: 'en-thanks-advance', pattern: /\bthank you in advance\b/gi, replace: '' },
  { id: 'en-could-you', pattern: /\b(could you|would you mind|would it be possible to)\b/gi, replace: '' },
  { id: 'en-wondering', pattern: /\bi was wondering if\b/gi, replace: '' },
  { id: 'en-fillers', pattern: /\b(basically|literally|actually|really|very|quite)\b/gi, replace: '' },
  { id: 'en-nutshell', pattern: /\bin a nutshell\b/gi, replace: '' },
  // ...
]
```

### Patterns ES, DE, IT, PT (à compléter)

Suivre le même schéma. 15+ patterns minimum par langue.

### Acceptance

```typescript
const result = cleanFiller([
  { role: 'user', content: 'Salut, est-ce que tu pourrais s\'il te plaît m\'expliquer Redis ?' }
])
expect(result.applied).toBe(true)
expect(result.tokensSaved).toBeGreaterThan(0)
expect(result.text).not.toMatch(/s'il te plaît|est-ce que tu pourrais/i)
```

## F5 — compactWhitespace

**Objectif** : normaliser whitespace (universel, toutes langues).

### Tâches

- [ ] `src/strategies/compactWhitespace.ts`
- [ ] Règles : espaces multiples → 1, newlines 3+ → 2, trim
- [ ] **Préserver** contenu dans blocs ``` ```
- [ ] Tests fixtures mixtes code+prose

## F6 — deduplicate

**Objectif** : supprimer phrases identiques répétées.

### Tâches

- [ ] Splitting via `Intl.Segmenter` granularité phrase + fallback regex
- [ ] Détection phrases identiques (normalize case + whitespace)
- [ ] Suppression intra-message
- [ ] Tests
- [ ] Doc limitation : langues sans espaces (ZH, JA, TH) → no-op

## F7 — compactHistory shadow

**Objectif** : calculer économies hypothétiques d'une compaction d'historique.

### Tâches V1 (shadow uniquement)

- [ ] Détection : nb messages > 6 OU tokens > 4000
- [ ] Simulation : keep system + 6 derniers, estime résumé à 200 tokens
- [ ] Calcule `tokensSavedShadow`, `costSavedShadowUSD`
- [ ] **Ne modifie pas** les messages réels
- [ ] Tests

## F8 — Plugin manifest + structure

- [ ] `.claude-plugin/plugin.json` conforme à la doc
- [ ] `hooks/hooks.json` avec les 5 hooks déclarés
- [ ] Structure `commands/`, `skills/`, `scripts/`
- [ ] README plugin avec install instructions
- [ ] Test local : `ln -s` vers `~/.claude/plugins/trimly` et vérif chargement

## F9 — Hook UserPromptSubmit

**Objectif** : intercepter chaque prompt, tracker, détecter filler.

### Tâches

- [ ] `hooks/user-prompt-submit.mjs` script Node ESM
- [ ] Lecture JSON depuis stdin
- [ ] Tokenization du prompt
- [ ] Détection cleanFiller en mode "detect only"
- [ ] Calcul coût input estimé
- [ ] Insert event "pending" dans SQLite
- [ ] Si advisor mode actif + seuil dépassé : stdout suggestion
- [ ] Timeout safe (< 5s)
- [ ] Tests unitaires + fixtures stdin

### Acceptance

```bash
echo '{"session_id":"test","transcript_path":"/tmp/test.jsonl","cwd":"/tmp","prompt":"Hello"}' | node hooks/user-prompt-submit.mjs
# Devrait insert un event "pending" en base
```

## F10 — Hook Stop (récup tokens output réels)

**Objectif** : finaliser l'event avec les vrais tokens output après réponse Claude.

### Tâches

- [ ] `hooks/stop.mjs`
- [ ] Lecture du `transcript_path` (fichier JSONL)
- [ ] Extraction du dernier message assistant + `usage`
- [ ] Update event "pending" → "completed" avec tokens réels
- [ ] Calcul coût final (input + output + cache)
- [ ] Tests avec fixtures JSONL

## F11 — Hooks PreCompact + SessionStart + SessionEnd

- [ ] `hooks/pre-compact.mjs` : log event de compaction
- [ ] `hooks/session-start.mjs` : create row sessions
- [ ] `hooks/session-end.mjs` : finalize sessions + optional summary stdout

## F12 — Commande `/trimly:stats`

- [ ] `commands/stats.md` avec frontmatter
- [ ] Script `commands/stats.mjs` qui lit SQLite et output ASCII
- [ ] Options : `--session` (courante), `--today`, `--month`, `--all`
- [ ] Tableau aligné avec `kleur` pour couleurs

## F13 — Commande `/trimly:dashboard`

- [ ] `commands/dashboard.md`
- [ ] Script `commands/dashboard.mjs`
- [ ] Spawn `npx @trimly/dashboard` via `cross-spawn`
- [ ] Détection port libre, fallback si 3737 pris
- [ ] Open browser auto (option)

## F14 — Commandes `/trimly:config` + `/trimly:clear`

- [ ] `commands/config.md` + script qui ouvre `~/.trimly/config.json` dans `$EDITOR`
- [ ] `commands/clear.md` + script avec confirmation (`prompts` lib)
- [ ] Options : `--all`, `--before YYYY-MM-DD`, `--session ID`

## F15 — Skill prompt-optimization

- [ ] `skills/prompt-optimization/SKILL.md`
- [ ] Description : aide à écrire des prompts efficaces
- [ ] Référence les données Trimly de l'user si dispo

## F16 — Manifest V3 + setup Vite

- [ ] `src/manifest.json` MV3 conforme
- [ ] `vite.config.ts` avec `vite-plugin-web-extension`
- [ ] Build dual : Chrome + Firefox
- [ ] Scripts package.json : `dev`, `build`, `package`

## F17 — Content script claude.ai + adapter

- [ ] `src/content/index.ts` entry point qui load adapter
- [ ] `src/content/sites/claude-ai-adapter.ts` avec sélecteurs DOM
- [ ] Mount Vue app dans shadow DOM (isolation styles)
- [ ] Observer DOM via `MutationObserver` pour textarea dynamique
- [ ] Debounce des updates (200ms)
- [ ] Tests E2E Playwright (V1.5)

## F18 — TokenBadge UI temps réel

- [ ] `src/content/ui/TokenBadge.vue`
- [ ] Position : flottant bas-droite du textarea
- [ ] Update via composable `useTokenCounter(text, model)`
- [ ] Affichage : `247 tokens · $0.001 · 💡 -32%`
- [ ] Couleurs adaptatives (sombre/clair)
- [ ] Animation discrète sur changement

## F19 — OptimizeOverlay + remplacement texte

- [ ] `src/content/ui/OptimizeOverlay.vue`
- [ ] Affiche : original vs optimized avec diff
- [ ] Bouton "Appliquer" → utilise adapter `setInputText`
- [ ] Bouton "Annuler"
- [ ] Tests : remplacement fonctionnel sur contenteditable

## F20 — Popup stats globales

- [ ] `src/popup/App.vue`
- [ ] Composants : BigNumber, sections Aujourd'hui/Mois
- [ ] Lecture `chrome.storage.local` via composable
- [ ] Comparateur abo vs API équivalente
- [ ] Bouton "Exporter pour dashboard" (download JSON)
- [ ] Bouton "Réglages"

## F21 — i18n Chrome (FR + EN)

- [ ] `_locales/fr/messages.json`
- [ ] `_locales/en/messages.json`
- [ ] Détection auto via `chrome.i18n.getUILanguage()`
- [ ] Switcher manuel dans popup

## F22 — Export pour dashboard

- [ ] Bouton dans popup "Exporter"
- [ ] Génère JSON conforme au format `BrowserEvent[]`
- [ ] Téléchargement via `chrome.downloads.download`
- [ ] User peut faire `npx trimly import-browser file.json` → fusionne dans SQLite

## F23 — Setup Nuxt 3 + i18n + UnoCSS

- [ ] `nuxt.config.ts` minimal
- [ ] `@nuxtjs/i18n` configuré FR + EN
- [ ] UnoCSS preset wind
- [ ] Layout par défaut avec Sidebar
- [ ] Conventions : pas de UButton, composants `base/layout/component/common`

## F24 — API routes lecture SQLite

- [ ] `server/api/events.get.ts` : pagination cursor
- [ ] `server/api/stats.get.ts` : agrégations
- [ ] `server/api/timeline.get.ts` : daily aggregates
- [ ] Lecture via `@trimly/core` storage factory
- [ ] Auto-détection path `~/.trimly/events.db`

## F25 — Page Overview

- [ ] `pages/index.vue`
- [ ] Big numbers : total spend, total tokens, total requests
- [ ] Toggle "Aujourd'hui" / "7 jours" / "30 jours" / "Tout"
- [ ] Comparateur abo vs API
- [ ] Top 3 modèles (camembert)
- [ ] Timeline 30 jours (line chart)

## F26 — Page Events paginée

- [ ] `pages/events.vue`
- [ ] Tableau via `EventsTable.vue`
- [ ] Colonnes : timestamp, source, provider, model, tokens, cost, saved, durée
- [ ] Filtres : source, provider, date range
- [ ] Pagination cursor-based
- [ ] Modal détail au click

## F27 — Page Savings

- [ ] `pages/savings.vue`
- [ ] Big number "économisé ce mois"
- [ ] Décomposition par stratégie + par langue
- [ ] Section shadow avec CTA "activer compactHistory" (V2)
- [ ] Charts comparatifs avant/après

## F28 — Page Settings

- [ ] `pages/settings.vue`
- [ ] Lecture `~/.trimly/config.json` (read-only V1, écriture V2)
- [ ] Switcher langue dashboard
- [ ] Switcher devise (USD / EUR)
- [ ] Section "Import from extension"

## F29 — Charts

- [ ] Wrapper `base/Chart.vue` (unovis-vue ou Recharts via wrapper Vue)
- [ ] Types : line (timeline), pie (modèles), bar (savings par stratégie)
- [ ] Responsive
- [ ] Couleurs cohérentes (palette identité)

## F30 — Binary `trimly` + commandes

- [ ] `packages/cli/bin/trimly` avec shebang
- [ ] Commande `trimly init` : crée config + dossier
- [ ] Commande `trimly dashboard` : alias de `npx @trimly/dashboard`
- [ ] Commande `trimly stats` : ASCII en console
- [ ] Commande `trimly export [--csv|--json]`
- [ ] Commande `trimly clear`
- [ ] Tests via `execa` cross-platform

## F31 — `trimly import-browser`

- [ ] Lit fichier JSON exporté depuis extension
- [ ] Valide schema
- [ ] Insère dans SQLite avec `source: 'browser-extension'`
- [ ] Deduplication par event id
- [ ] Confirmation count inserted

## F32 — CI multi-OS multi-Node

- [ ] `.github/workflows/ci.yml`
- [ ] Matrix : ubuntu-latest + macos-latest + windows-latest
- [ ] Node : 20, 22, 24
- [ ] Jobs : `install`, `lint`, `typecheck`, `test`, `build`
- [ ] Cache pnpm
- [ ] Upload coverage Codecov (optionnel)
