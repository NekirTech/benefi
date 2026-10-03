<template>
  <div class="wrap not-found">
    <img src="/benefi_logo.svg" alt="Benefi Café" width="96" height="96" />
    <h1>404</h1>
    <p>{{ text.notFound }}</p>
    <router-link to="/">{{ text.backHome }}</router-link>
  </div>
</template>

<script setup lang="ts">
import { useLocale } from 'src/composables/useLocale';

const { text } = useLocale();
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  text-align: center;
}

h1 {
  font-size: 4rem;
}

a {
  color: var(--mint-ink);
  font-weight: 500;
}
</style>
