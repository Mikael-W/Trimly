<script setup lang="ts">
const props = defineProps<{
  original: string
  optimized: string
  tokensOriginal: number
  tokensOptimized: number
  savingsPct: number
}>()

const emit = defineEmits<{ apply: []; dismiss: [] }>()
</script>

<template>
  <div class="overlay">
    <div class="modal">
      <h3 class="modal-title">✨ Version optimisée</h3>

      <div class="modal-diff">
        <div class="diff-block diff-block--before">
          <span class="diff-label">Avant</span>
          <p class="diff-text">{{ original }}</p>
        </div>
        <div class="diff-arrow">→</div>
        <div class="diff-block diff-block--after">
          <span class="diff-label">Après</span>
          <p class="diff-text">{{ optimized }}</p>
        </div>
      </div>

      <div class="modal-meta">
        <span>{{ tokensOriginal }} → {{ tokensOptimized }} tokens</span>
        <span class="modal-saving">-{{ savingsPct }}%</span>
      </div>

      <div class="modal-actions">
        <button class="btn btn--primary" @click="emit('apply')">Appliquer</button>
        <button class="btn btn--ghost" @click="emit('dismiss')">Annuler</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  backdrop-filter: blur(2px);
}

.modal {
  background: #111;
  border: 1px solid #2a2a2a;
  border-radius: 14px;
  padding: 20px;
  width: 500px;
  max-width: 92vw;
  font-family: system-ui, -apple-system, sans-serif;
  color: #e5e5e5;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.85);
}

.modal-title {
  font-size: 14px;
  font-weight: 600;
  color: #a78bfa;
  margin: 0 0 14px;
}

.modal-diff {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin-bottom: 12px;
}

.diff-arrow {
  font-size: 14px;
  color: #3f3f46;
  margin-top: 28px;
  flex-shrink: 0;
}

.diff-block {
  flex: 1;
  background: #0d0d0d;
  border: 1px solid #1f1f1f;
  border-radius: 8px;
  padding: 10px;
  min-width: 0;
}

.diff-label {
  display: block;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #52525b;
  margin-bottom: 6px;
}

.diff-block--after .diff-label { color: #7c3aed; }

.diff-text {
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.5;
  margin: 0;
  word-break: break-word;
  max-height: 120px;
  overflow-y: auto;
}

.diff-block--after .diff-text { color: #c4b5fd; }

.modal-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 16px;
}

.modal-saving {
  color: #22c55e;
  font-weight: 600;
}

.modal-actions {
  display: flex;
  gap: 8px;
}

.btn {
  flex: 1;
  padding: 8px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.15s;
}

.btn:hover { opacity: 0.85; }

.btn--primary {
  background: #8b5cf6;
  color: white;
  border: none;
}

.btn--ghost {
  background: transparent;
  color: #9ca3af;
  border: 1px solid #2a2a2a;
}
</style>
