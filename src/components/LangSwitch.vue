<template>
  <div class="lang" role="group" aria-label="Language / Dil">
    <button
      v-for="option in options"
      :key="option"
      type="button"
      :aria-pressed="lang === option"
      @click="setLang(option)"
    >
      {{ option.toUpperCase() }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useLocale, type Lang } from 'src/composables/useLocale';

const options: Lang[] = ['tr', 'en'];
const { lang, setLang } = useLocale();
</script>

<style scoped>
.lang {
  display: flex;
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 2px;
}

button {
  border: 0;
  background: none;
  padding: 0.3rem 0.6rem;
  min-width: 2.5rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--ink-soft);
  cursor: pointer;
}

button[aria-pressed='true'] {
  background: var(--ink);
  color: var(--paper);
}
</style>
