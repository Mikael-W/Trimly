<template>
  <div class="shell">
    <LayoutSidebar />
    <main class="shell-main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.shell {
  min-height: 100vh;
  display: flex;
  background: var(--bg);
}

.shell-main {
  flex: 1;
  min-width: 0;
  padding: 2.5rem 3rem;
  overflow-y: auto;
}
</style>
