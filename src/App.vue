<template>
  <router-view />
</template>

<script setup lang="ts">
import { watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useLocale } from 'src/composables/useLocale';
import { applyHead, pageMeta } from 'src/seo';

const route = useRoute();
const { lang } = useLocale();

watchEffect(() => {
  if (typeof document === 'undefined') return;
  const known = route.matched.some(
    (record) => record.path !== '/:catchAll(.*)*',
  );
  applyHead(pageMeta(known ? route.path : '/404', lang.value));
});
</script>
