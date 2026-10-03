// Build-time prerendering, used by scripts/prerender.js.
import { createSSRApp } from 'vue';
import { createMemoryHistory } from 'vue-router';
import { renderToString, type SSRContext } from 'vue/server-renderer';
import App from './App.vue';
import { provideMenuData } from './composables/useMenu';
import menu from './locales/menu.json';
import menuEn from './locales/menu_en.json';
import menuTr from './locales/menu_tr.json';
import menuStatic from './locales/menu_static.json';
import { createAppRouter } from './router';

export { businessJsonLd, indexedPaths, pageMeta } from './seo';
export { site } from './site';

provideMenuData([menu, menuEn, menuTr, menuStatic]);

export async function render(url: string) {
  const app = createSSRApp(App);
  const router = createAppRouter(createMemoryHistory());
  app.use(router);
  await router.push(url);
  await router.isReady();

  const context: SSRContext = {};
  const html = await renderToString(app, context);
  return { html, modules: [...((context.modules as Set<string>) ?? [])] };
}
