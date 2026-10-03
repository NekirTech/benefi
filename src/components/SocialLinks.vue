<template>
  <a :href="site.instagram" target="_blank" rel="noopener" class="social">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" />
    </svg>
    <span>Instagram · benefi_cafe</span>
  </a>
</template>

<script setup lang="ts">
import { site } from 'src/site';
</script>

<style scoped>
.social {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding-block: 0.25rem;
  text-decoration: none;
}

.social:hover span {
  text-decoration: underline;
}

svg {
  width: 1.25rem;
  height: 1.25rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
