import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: (to, _from, saved) =>
    saved ?? (to.hash ? { el: to.hash } : { top: 0 }),
});
