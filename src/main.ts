import { createApp } from 'vue';
import { createWebHistory } from 'vue-router';
import '@fontsource-variable/fraunces';
import '@fontsource-variable/outfit';
import 'src/css/app.css';
import App from './App.vue';
import { loadMenu } from './composables/useMenu';
import { createAppRouter } from './router';

async function start() {
  const app = createApp(App);
  const router = createAppRouter(createWebHistory());
  app.use(router);
  await router.isReady();

  // The page arrives prerendered. Mounting replaces that HTML, so on the menu
  // wait for the live prices first (at most briefly) to avoid an empty flash.
  if (router.currentRoute.value.path === '/menu') {
    await Promise.race([
      loadMenu(),
      new Promise((resolve) => setTimeout(resolve, 2500)),
    ]);
  }
  app.mount('#app');
}

start();
