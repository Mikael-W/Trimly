# Trimly — Plugin Claude Code

## 🎯 Objectif du plugin

Tracker, analyser et alléger ta consommation de tokens Claude Code, depuis Claude Code lui-même.

## 📋 Format officiel

Le plugin suit la structure officielle Anthropic :

```
trimly-claude-code/
├── .claude-plugin/
│   └── plugin.json          ← REQUIS : manifeste
├── hooks/
│   └── hooks.json           ← déclare les hooks
├── commands/                ← commandes slash
├── skills/                  ← skills optionnelles
└── README.md
```

## 📄 `.claude-plugin/plugin.json`

```json
{
  "name": "trimly",
  "version": "0.1.0",
  "description": "See and trim your Claude Code token spend",
  "author": "Mika (https://github.com/...)",
  "license": "Apache-2.0",
  "homepage": "https://trimly.dev",
  "repository": "https://github.com/.../trimly"
}
```

## 🔌 Hooks ciblés V1

Tous les hooks sont déclarés dans `hooks/hooks.json` :

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ${CLAUDE_PLUGIN_ROOT}/hooks/user-prompt-submit.mjs",
            "timeout": 5000
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ${CLAUDE_PLUGIN_ROOT}/hooks/stop.mjs",
            "timeout": 3000
          }
        ]
      }
    ],
    "PreCompact": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ${CLAUDE_PLUGIN_ROOT}/hooks/pre-compact.mjs",
            "timeout": 3000
          }
        ]
      }
    ],
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ${CLAUDE_PLUGIN_ROOT}/hooks/session-start.mjs",
            "timeout": 2000
          }
        ]
      }
    ],
    "SessionEnd": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ${CLAUDE_PLUGIN_ROOT}/hooks/session-end.mjs",
            "timeout": 2000
          }
        ]
      }
    ]
  }
}
```

### Détail des hooks

#### `UserPromptSubmit`

**Déclenché** : à chaque prompt envoyé par l'utilisateur, avant traitement Claude.

**Input stdin (JSON)** :
```json
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../session.jsonl",
  "cwd": "/Users/...",
  "prompt": "Le texte du prompt utilisateur"
}
```

**Logique du hook** :
1. Parser JSON depuis stdin
2. Lire le modèle actif (depuis env `ANTHROPIC_MODEL` ou config Claude Code)
3. Compter les tokens du prompt via `@trimly/core` tokenizer Anthropic
4. Détecter filler words (cleanFiller en mode detection)
5. Calculer coût estimé input
6. Insérer event "pending" dans `~/.trimly/events.db` :
   ```sql
   INSERT INTO events (
     id, session_id, timestamp, source,
     provider, model,
     tokens_input, cost_input_usd,
     filler_detected, filler_savings,
     status
   ) VALUES ('uuid', 'abc123', 1716300000, 'claude-code',
     'anthropic', 'claude-sonnet-4-5',
     247, 0.00074,
     true, 156,
     'pending')
   ```
7. Si seuil filler dépassé (configurable) **et** mode "advisor" actif, afficher sur stdout :
   ```
   💡 Trimly: 247 tokens (~$0.001). 63% de gain possible. Alternative:
      "Explique Redis (concepts de base)."
      (Aujourd'hui en attendant updatedPrompt, copie-colle si tu veux l'appliquer)
   ```
8. Sortie : ne BLOQUE PAS le prompt (toujours laisser passer).

**Output** : tout ce qui est sur stdout est affiché dans la session Claude Code. **Ne pas spammer** : par défaut, sortie silencieuse, mode `verbose` opt-in.

#### `Stop`

**Déclenché** : quand Claude finit de répondre.

**Input stdin** :
```json
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../session.jsonl"
}
```

**Logique** :
1. Lire le transcript JSONL
2. Extraire le dernier message assistant + son `usage` (input_tokens, output_tokens, cache_*_tokens)
3. Update l'event "pending" en "completed" :
   ```sql
   UPDATE events SET
     tokens_input = ?, tokens_output = ?,
     tokens_cache_read = ?, tokens_cache_write = ?,
     cost_usd = ?, duration_ms = ?,
     status = 'completed'
   WHERE session_id = ? AND status = 'pending'
   ORDER BY timestamp DESC LIMIT 1
   ```
4. Sortie silencieuse.

#### `PreCompact`

**Déclenché** : avant que Claude Code compacte automatiquement l'historique.

**Logique** :
1. Logger l'event de compaction (sera utile dans le dashboard pour expliquer les sauts de coûts)
2. Stocker dans table `sessions` les tokens cumulés avant compaction

**Pourquoi c'est utile** : permet de montrer dans le dashboard "ta session a été compactée à X tokens, voici ce que tu as économisé en évitant d'y aller manuellement".

#### `SessionStart`

**Déclenché** : au début d'une session Claude Code.

**Logique** :
1. Créer une ligne dans `sessions` avec session_id, started_at, cwd
2. Reset le compteur de session

#### `SessionEnd`

**Déclenché** : à la fin d'une session.

**Logique** :
1. Update la session avec ended_at, total_tokens, total_cost
2. Si mode `summary` actif, affiche sur stdout :
   ```
   📊 Trimly session summary
      Duration: 1h 23m
      Prompts: 47
      Tokens: 142,350 in / 18,420 out
      Cost: $0.49
   ```

## 🪄 Commandes slash V1

Les commandes sont des fichiers Markdown dans `commands/`. Claude Code les expose automatiquement.

### `commands/stats.md`

```markdown
---
name: trimly:stats
description: Affiche les stats Trimly de la session courante et globales
---

Exécute le script Node :
\`\`\`bash
node ${CLAUDE_PLUGIN_ROOT}/commands/stats.mjs --session $CLAUDE_SESSION_ID
\`\`\`
```

Le script `stats.mjs` lit SQLite et output ASCII :

```
📊 Trimly stats

Cette session (45 min):
  Prompts:    23
  Tokens:     45,123 in / 8,234 out
  Cost:       $0.149
  Saved:      $0.023 (13%)

Aujourd'hui:
  Prompts:    87
  Cost:       $0.62

Ce mois (1-21 mai):
  Prompts:    1,247
  Cost:       $14.18
  Saved:      $4.27 (23%)
  
Top modèles:
  claude-sonnet-4-5    78%
  claude-haiku-4-5     22%

💡 Run /trimly:dashboard pour la vue détaillée.
```

### `commands/dashboard.md`

```markdown
---
name: trimly:dashboard
description: Lance le dashboard Nuxt local
---

Lance le dashboard :
\`\`\`bash
node ${CLAUDE_PLUGIN_ROOT}/commands/dashboard.mjs
\`\`\`
```

Le script :
1. Vérifie que le port 3737 est libre
2. Spawn `npx @trimly/dashboard` (ou path local si dev mode) via `cross-spawn`
3. Affiche : `🚀 Trimly dashboard: http://localhost:3737`
4. Optionnel : ouvre le navigateur automatiquement (`open` package)

### `commands/config.md`

Affiche et permet de modifier la config Trimly stockée dans `~/.trimly/config.json` :

```json
{
  "verbose": false,
  "advisor": true,
  "filler": {
    "enabled": true,
    "languages": ["fr", "en"],
    "threshold_pct": 20
  },
  "storage": {
    "path": "~/.trimly/events.db",
    "retention_days": 90
  },
  "currency": "EUR",
  "summary_on_session_end": true
}
```

Le script `config.mjs` ouvre le fichier dans `$EDITOR` ou affiche un récap éditable.

### `commands/clear.md`

```markdown
---
name: trimly:clear
description: Supprime tous les events Trimly (avec confirmation)
---

Exécute :
\`\`\`bash
node ${CLAUDE_PLUGIN_ROOT}/commands/clear.mjs
\`\`\`
```

Script qui demande confirmation, puis :
- `clear --all` : vide la base
- `clear --before YYYY-MM-DD` : supprime avant une date
- `clear --session ID` : supprime une session

## 🎓 Skill `prompt-optimization`

Skill optionnelle dans `skills/prompt-optimization/SKILL.md` qui peut être invoquée par Claude lui-même quand l'user demande "comment réduire mes coûts ?".

```markdown
---
name: prompt-optimization
description: Helps users write more efficient prompts to reduce token costs
---

This skill helps when users ask about reducing their LLM token costs or 
optimizing prompts.

When triggered, suggest:
1. Use clear, direct language (avoid filler words)
2. Skip politeness markers in technical prompts
3. Trim conversational redundancy
4. Use bullet points for lists instead of prose
5. Reference the user's actual Trimly data if available

Example transformations:
- "Could you please explain..." → "Explain..."
- "I was wondering if..." → direct question
- "Basically what I want is..." → just state the request
```

## 📦 Installation du plugin

### Via la marketplace officielle (post-publication)

```bash
# Dans Claude Code
/plugin marketplace add trimlydev/plugins
/plugin install trimly@trimlydev
```

### Dev local (pendant le développement)

```bash
# Dans ton repo trimly/
cd apps/claude-code-plugin
pnpm install

# Lien symbolique vers le dossier plugins de Claude Code
# Sur Mac/Linux :
ln -s "$(pwd)" "${HOME}/.claude/plugins/trimly"

# Sur Windows :
mklink /D "%USERPROFILE%\.claude\plugins\trimly" "%CD%"

# Redémarre Claude Code, le plugin est chargé
```

## ⚠️ Points critiques d'implémentation

### Le problème `updatedPrompt`

Aujourd'hui (mai 2026), `UserPromptSubmit` ne supporte **pas** `updatedPrompt` pour modifier le prompt avant envoi. C'est une issue GitHub ouverte (#27365).

**Workaround V1** : Trimly affiche la version optimisée dans stdout, l'user copie-colle s'il veut l'utiliser. **Pas idéal**, mais ça fait le job de pédagogie + tracking.

**Watch** : surveiller mensuellement la release de `updatedPrompt`. Quand ça arrive, mettre à jour les hooks pour modifier automatiquement, ce sera un changement de ~10 lignes.

### Le timeout des hooks

`UserPromptSubmit` a un timeout de 30 secondes par défaut, mais **bloque la session**. On configure `timeout: 5000` (5s) pour ne jamais ralentir l'expérience.

Si tokenizer prend > 1s sur de gros prompts, prévoir fallback heuristique (chars/4) pour rester rapide.

### Performance disque

Chaque prompt = 1 insert SQLite. À 1000 prompts/jour, c'est 1 MB/jour. Storage négligeable.

### Lecture du transcript

Le `transcript_path` reçu dans les hooks pointe vers un `.jsonl` que Claude Code écrit. Parser ce fichier est la **seule façon fiable** de récupérer les vrais tokens output (l'API directe n'est pas exposée aux hooks).

Format JSONL : une ligne par message, format Anthropic API standard avec `usage`.

### Cross-platform shebang

Les fichiers `.mjs` lancés via `node ${CLAUDE_PLUGIN_ROOT}/...` n'ont pas besoin de shebang (Node est appelé explicitement). C'est plus portable que des binaires natifs.

## 🧪 Tests du plugin

### Tests unitaires

Chaque hook a son fichier de test :

```typescript
// hooks/__tests__/user-prompt-submit.test.ts
import { describe, it, expect, vi } from 'vitest'
import { runHook } from '../user-prompt-submit.mjs'

describe('UserPromptSubmit hook', () => {
  it('counts tokens and inserts pending event', async () => {
    const input = {
      session_id: 'test-123',
      transcript_path: '/tmp/test.jsonl',
      cwd: '/tmp',
      prompt: 'Hello world'
    }
    
    const result = await runHook(input, { storage: ':memory:' })
    
    expect(result.eventId).toBeDefined()
    expect(result.tokensInput).toBeGreaterThan(0)
  })
  
  it('detects filler words in FR', async () => {
    const input = {
      // ...
      prompt: 'S\'il te plaît, est-ce que tu pourrais m\'expliquer Redis ?'
    }
    
    const result = await runHook(input, {/*...*/})
    
    expect(result.fillerDetected).toBe(true)
    expect(result.suggestion).toBeDefined()
  })
})
```

### Test manuel post-install

```bash
# Activer mode verbose
/trimly:config
# Mettre verbose: true

# Tester un prompt avec filler
> Salut, est-ce que tu pourrais s'il te plaît m'expliquer Redis ?

# Devrait afficher :
# 💡 Trimly: 87 tokens (~$0.0003). 63% gain possible.
```

## 📈 Métriques de succès du plugin

- Installation en 1 commande
- Aucun ralentissement perceptible (hook < 100ms typique)
- Stats accessibles en 1 commande
- Au moins 1 prompt "optimisable" détecté par session moyenne
- Toi (Mika) l'utilises tous les jours pendant 1 mois sans le désactiver

## 🔁 Évolutions V2+

- Quand `updatedPrompt` arrive : passer en mode automatique (sans copier-coller)
- Skills additionnelles : `cost-explainer`, `prompt-coach`
- Hooks `PostToolUse` pour tracker les tool calls qui sont chers
- Multi-config par projet (`.trimly/config.json` à la racine du projet)
- Export OpenTelemetry pour intégration avec Langfuse/Helicone si l'user veut
