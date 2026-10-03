<template>
  <header class="site-header">
    <div class="wrap bar">
      <router-link to="/" class="brand">
        <img src="/benefi_logo.svg" alt="" width="36" height="36" />
        <span>Benefi</span>
      </router-link>
      <nav>
        <router-link v-if="route.path !== '/menu'" to="/menu" class="nav-link">
          {{ text.menu }}
        </router-link>
        <!-- On the menu page the switch sits in the category bar. -->
        <LangSwitch v-if="route.path !== '/menu'" />
      </nav>
    </div>
  </header>

  <main>
    <router-view />
  </main>

  <footer class="site-footer">
    <div class="wrap">
      <SocialLinks />
      <p>
        {{ text.name }} · {{ text.street }}, {{ text.postcode }} ·
        <a :href="`mailto:${text.email}`">{{ text.email }}</a>
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import LangSwitch from 'src/components/LangSwitch.vue';
import SocialLinks from 'src/components/SocialLinks.vue';
import { useLocale } from 'src/composables/useLocale';

const route = useRoute();
const { text } = useLocale();
</script>

<style scoped>
.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-block: 0.75rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  font-family: var(--serif);
  font-size: 1.375rem;
  font-weight: 500;
}

nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-link {
  font-weight: 500;
  text-decoration: none;
}

.nav-link:hover {
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

main {
  min-height: 70vh;
}

.site-footer {
  margin-top: 4rem;
  padding-block: 2rem calc(2rem + env(safe-area-inset-bottom));
  border-top: 1px solid var(--line);
  font-size: 0.875rem;
  color: var(--ink-soft);
}

.site-footer p {
  margin-top: 0.75rem;
}
</style>
