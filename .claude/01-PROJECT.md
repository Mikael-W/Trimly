# Trimly — Project Definition

## 🎯 Mission en une phrase

**Trimly mesure et optimise ta consommation de tokens LLM, là où tu prompts vraiment : Claude Code dans ton terminal et claude.ai dans ton navigateur.**

## 🔥 Le problème

Aujourd'hui, des millions de développeurs utilisent Claude Code, ChatGPT, claude.ai avec une mentalité "abonnement illimité à 90€/mois". Or :

- Chaque message consomme des tokens (input + output)
- À chaque tour de conversation, on renvoie tout l'historique → **coût quadratique**
- Les prompts sont rédigés en langage naturel, bourrés de formules de politesse, de hedging, de "pourrais-tu m'expliquer si ce n'est pas trop demander"
- Aucun outil ne montre **où va l'argent** ni **combien on consomme**
- Le dev croit que c'est "gratuit" parce qu'il paie un abo fixe

Résultat : aucune conscience de la consommation, prompts inefficaces, et coûts qui explosent quand on passe en API.

## 💡 La solution Trimly (suite complète)

Trois produits cohérents qui partagent le même cœur :

### 1. Plugin Claude Code (`trimly-claude-code`)
- Hooks officiels (`UserPromptSubmit`, `Stop`, `PreCompact`, `SessionStart`, `SessionEnd`)
- Tracking détaillé de chaque prompt + réponse
- Commande `/trimly:stats` pour stats ASCII dans le terminal
- Commande `/trimly:dashboard` pour lancer le dashboard local
- Détection filler words avec suggestion (en attendant l'API `updatedPrompt`)

### 2. Extension navigateur (`trimly-browser`)
- Content script injecté dans claude.ai
- Compteur tokens temps réel pendant la frappe
- Coût estimé par message + cumul session
- Bouton "Optimiser" qui propose une version cleanFiller du prompt
- Popup stats globales

### 3. Dashboard local (`@trimly/dashboard`)
- App Nuxt 3 lancée en local
- Lit le storage du plugin **et** de l'extension (vue unifiée)
- Charts : timeline, top modèles, top stratégies d'économie, comparateur abo/API
- i18n FR + EN

## 👥 Cible prioritaire

**User principal V1** : toi-même (dogfooding). Tu utilises Claude Code quotidiennement, donc tu es ton meilleur tester.

**Cible secondaire** : les autres devs Claude Code, naturellement Tech Lead-friendly.

**Cible business** : visibilité GitHub + LinkedIn → missions premium (scénario A).

## 🌍 Portée internationale (V1)

- **Code** : cross-platform Mac, Linux, Windows (cf. ARCHITECTURE)
- **Filler patterns** : 6 langues V1 : FR, EN, ES, DE, IT, PT
- **Dashboard** : i18n FR + EN, auto-détection navigateur
- **Devise** : USD par défaut, EUR configurable
- **Documentation** : README en EN, traduction FR

## 📦 Scope V1

### ✅ Inclus

**Package `@trimly/core`** (cœur partagé) :
- Tokenization multi-provider (Anthropic + OpenAI + Mistral pour ouverture future)
- Calcul de coût en temps réel
- 4 stratégies d'optimisation : cleanFiller (6 langues), compactWhitespace, deduplicate, compactHistory (shadow)
- Storage portable `node:sqlite` + `@libsql/client` fallback
- Types TypeScript stricts exportés

**Plugin Claude Code** :
- Hooks : UserPromptSubmit, Stop, PreCompact, SessionStart, SessionEnd
- Commandes slash : `/trimly:stats`, `/trimly:dashboard`, `/trimly:config`, `/trimly:clear`
- Détection filler words avec affichage de suggestion (l'user copie-colle en attendant `updatedPrompt`)
- Tracking dans SQLite local

**Extension navigateur** :
- Manifest V3, Chrome + Firefox
- Content script claude.ai (mvp), architecture extensible pour ChatGPT/Gemini en V2
- Compteur temps réel
- Bouton "Optimiser"
- Storage IndexedDB local + sync optionnelle vers SQLite via fichier (V2)

**Dashboard local** :
- Nuxt 3 + UnoCSS, i18n FR + EN
- 4 pages : Overview, Events, Savings, Settings
- Lance via `/trimly:dashboard` ou `npx trimly dashboard`

### ❌ Explicitement HORS scope V1

- Compression sémantique style LLMLingua
- Cache sémantique avec embeddings
- Routing automatique par tâche
- Module Vercel AI SDK dédié
- Wrapper SDK npm (`@trimly/anthropic`, etc.) → V2 si traction
- Dashboard cloud hébergé
- Support Python
- Support Gemini, Cohere, Ollama
- Mode "apply" pour compactHistory
- Langues filler hors des 6 incluses
- Extension pour ChatGPT/Gemini/Mistral chat (V2)
- Cursor/Windsurf (Electron fermé)

## 🎨 Identité

- **Nom** : Trimly
- **Tagline EN** : "See and trim your AI token spend."
- **Tagline FR** : "Voyez et allégez vos coûts IA."
- **Tone** : direct, pédagogique, légèrement provoc ("90€/mois illimité ? Vraiment ?")
- **Couleurs suggérées** : palette sobre, accent vert (économies)

## 📜 Licence

**Apache 2.0** pour tout le code. Décision ferme.

## 🚫 Non-goals

- Trimly ne remplace PAS Helicone/Langfuse/Portkey (c'est complémentaire, surface différente)
- Trimly n'envoie AUCUNE donnée externe (privacy by default, 100% local)
- Trimly ne prétend PAS faire de compression neuronale avancée
- Trimly ne touche PAS Cursor/Windsurf en V1 (Electron fermé)

## 📊 Critères de succès V1

- Installation plugin Claude Code en < 1 minute via marketplace
- Installation extension navigateur en < 30 secondes via store
- Tracking détaillé fonctionnel : chaque prompt loggé avec tokens + coût
- Dashboard accessible en 1 commande (`/trimly:dashboard`)
- 6 langues cleanFiller couvrent ~80% du marché européen
- Tu (Mika) utilises Trimly tous les jours sans friction
- 3-5 posts LinkedIn générés sur la base du projet pendant et après le dev
- Repo GitHub propre avec stars qui s'accumulent

## 📅 Stratégie business attachée

- **Sprint 1-4 jours** : V1 développée avec Claude Code
- **Semaine 2** : publication GitHub + marketplace Claude Code + Chrome Web Store
- **Semaines 3-12** : 2 posts LinkedIn/semaine, screenshots de TON dashboard, métriques personnelles
- **Mois 3-6** : retours utilisateurs, V2 si traction, prospection Tech Leads en direct
- **Mois 6** : bilan factuel, missions premium ou sleeping
