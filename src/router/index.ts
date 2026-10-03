import { createRouter, type RouterHistory } from 'vue-router';
import routes from './routes';

export function createAppRouter(history: RouterHistory) {
  return createRouter({
    history,
    routes,
    scrollBehavior: (to, _from, saved) =>
      saved ?? (to.hash ? { el: to.hash } : { top: 0 }),
  });
}
