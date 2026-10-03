<template>
  <div class="menu-page">
    <div class="wrap top">
      <h1>{{ text.menu }}</h1>
      <label class="search">
        <span class="visually-hidden">{{ text.search }}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4.5 4.5" />
        </svg>
        <input
          v-model="query"
          type="search"
          :placeholder="text.search"
          enterkeyhint="search"
        />
      </label>
    </div>

    <nav ref="navEl" class="categories" aria-label="Categories">
      <div class="wrap bar">
        <ul v-show="!query">
          <li v-for="key in topKeys" :key="key">
            <button
              type="button"
              :data-key="key"
              :aria-current="active === key ? 'true' : undefined"
              @click="jumpTo(key)"
            >
              {{ splitNote(name(key)).title }}
            </button>
          </li>
        </ul>
        <LangSwitch class="lang" />
      </div>
    </nav>

    <div class="wrap">
      <p v-if="!loaded" class="state">…</p>
      <p v-else-if="query && !Object.keys(visible).length" class="state">
        {{ text.noResults }} „{{ query }}“
      </p>
      <MenuSection
        v-for="(node, key) in visible"
        :key="key"
        :category-key="String(key)"
        :node="node"
        :depth="0"
      />
    </div>

    <dialog ref="dialogEl" class="lightbox" @click="dialogEl?.close()">
      <img v-if="zoomed" :src="zoomed.src" :alt="zoomed.alt" />
      <p v-if="zoomed">{{ zoomed.alt }}</p>
      <button type="button" class="close" :aria-label="text.close">×</button>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  watch,
} from 'vue';
import LangSwitch from 'src/components/LangSwitch.vue';
import MenuSection from 'src/components/MenuSection.vue';
import { useLocale } from 'src/composables/useLocale';
import { useMenu, type MenuTree } from 'src/composables/useMenu';
import { splitNote } from 'src/utils/heading';
import { openImageKey } from 'src/utils/keys';

const { text } = useLocale();
const { tree, loaded, name } = useMenu();

const topKeys = computed(() => Object.keys(tree.value));

/* ---------- search ---------- */

const query = ref('');

function normalize(value: string) {
  return value
    .toLocaleLowerCase('tr')
    .replace(/ı/g, 'i')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function filterNode(
  node: MenuTree | string[],
  needle: string,
): MenuTree | string[] | null {
  if (Array.isArray(node)) {
    const hits = node.filter((item) => normalize(name(item)).includes(needle));
    return hits.length ? hits : null;
  }
  const result: MenuTree = {};
  for (const [key, child] of Object.entries(node)) {
    // A matching category keeps all of its items.
    const kept = normalize(name(key)).includes(needle)
      ? child
      : filterNode(child, needle);
    if (kept) result[key] = kept;
  }
  return Object.keys(result).length ? result : null;
}

const visible = computed<MenuTree>(() => {
  const needle = normalize(query.value.trim());
  if (!needle) return tree.value;
  return (filterNode(tree.value, needle) as MenuTree | null) ?? {};
});

/* ---------- category bar ---------- */

const navEl = ref<HTMLElement>();
const active = ref<string>();
const anchorOf = (key: string) => 'c-' + key.replace(/[^\w-]/g, '');

function jumpTo(key: string) {
  document
    .getElementById(anchorOf(key))
    ?.scrollIntoView({ behavior: 'smooth' });
}

// The active category is the last one whose top has passed the upper
// third of the screen (or the first one while still at the top).
let frame = 0;
function updateActive() {
  frame = 0;
  const line = window.innerHeight / 3;
  let current = topKeys.value[0];
  for (const key of topKeys.value) {
    const el = document.getElementById(anchorOf(key));
    if (el && el.getBoundingClientRect().top <= line) current = key;
  }
  active.value = current;
}
function onScroll() {
  frame ||= requestAnimationFrame(updateActive);
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  updateActive();
});
watch(topKeys, () => nextTick(updateActive));

// Keep the highlighted category visible inside the horizontally scrolling bar.
watch(active, (key) => {
  const list = navEl.value?.querySelector('ul');
  const button = list?.querySelector<HTMLElement>(
    `[data-key="${CSS.escape(key ?? '')}"]`,
  );
  if (!list || !button) return;
  list.scrollTo({
    left: button.offsetLeft - (list.clientWidth - button.offsetWidth) / 2,
    behavior: 'smooth',
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
  cancelAnimationFrame(frame);
});

/* ---------- image lightbox ---------- */

const dialogEl = ref<HTMLDialogElement>();
const zoomed = ref<{ src: string; alt: string }>();

provide(openImageKey, (src, alt) => {
  zoomed.value = { src, alt };
  dialogEl.value?.showModal();
});
</script>

<style scoped>
.top {
  padding-top: 1.5rem;
}

h1 {
  font-size: clamp(2.5rem, 11vw, 3.25rem);
}

.search {
  position: relative;
  display: block;
  margin-top: 1.25rem;
}

.search svg {
  position: absolute;
  left: 0.85rem;
  top: 50%;
  translate: 0 -50%;
  width: 1.15rem;
  height: 1.15rem;
  fill: none;
  stroke: var(--ink-soft);
  stroke-width: 1.8;
  stroke-linecap: round;
}

.search input {
  width: 100%;
  padding: 0.75rem 0.9rem 0.75rem 2.6rem;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--paper-raised);
  color: var(--ink);
  font: inherit;
  font-size: 1rem;
}

.search input:focus {
  outline: none;
  border-color: var(--mint-ink);
}

.categories {
  position: sticky;
  top: 0;
  z-index: 10;
  margin-top: 1rem;
  background: var(--paper);
  border-bottom: 1px solid var(--line);
}

.categories .bar {
  display: flex;
  align-items: center;
  padding-inline: 0;
}

.categories ul {
  flex: 1;
  min-width: 0;
  display: flex;
  gap: 1.25rem;
  margin: 0;
  padding: 0 var(--gutter);
  list-style: none;
  overflow-x: auto;
  scrollbar-width: none;
}

.categories ul::-webkit-scrollbar {
  display: none;
}

/* Stays visible on the right while the categories scroll underneath. */
.categories .lang {
  flex: none;
  margin-left: auto;
  margin-right: var(--gutter);
  box-shadow: -1rem 0 0.75rem var(--paper);
  background: var(--paper);
}

.categories ul button {
  padding: 0.9rem 0 0.75rem;
  border: 0;
  border-bottom: 2px solid transparent;
  background: none;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  white-space: nowrap;
  color: var(--ink-soft);
  cursor: pointer;
}

.categories ul button[aria-current='true'] {
  color: var(--ink);
  border-bottom-color: var(--mint);
}

.state {
  padding-block: 3rem;
  text-align: center;
  color: var(--ink-soft);
}

.lightbox {
  max-width: min(92vw, 28rem);
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: var(--paper-raised);
  color: var(--ink);
  cursor: zoom-out;
}

.lightbox::backdrop {
  background: rgb(20 15 15 / 0.75);
}

.lightbox img {
  width: 100%;
  height: auto;
  max-height: 80vh;
  object-fit: contain;
}

.lightbox p {
  padding: 0.75rem 1rem;
}

.close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 2.25rem;
  height: 2.25rem;
  border: 0;
  border-radius: 50%;
  background: rgb(0 0 0 / 0.55);
  color: #fff;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
}
</style>
