<template>
  <section
    :id="depth === 0 ? anchor : undefined"
    :class="['section', `depth-${Math.min(depth, 2)}`]"
  >
    <div class="heading">
      <button
        v-if="picture"
        type="button"
        class="thumb"
        :aria-label="label.title"
        @click="openImage(picture.large, label.title)"
      >
        <img
          :src="picture.large"
          alt=""
          loading="lazy"
          width="44"
          height="44"
        />
      </button>
      <div>
        <component :is="depth === 0 ? 'h2' : 'h3'">{{ label.title }}</component>
        <p v-if="label.note" class="note">{{ label.note }}</p>
      </div>
    </div>

    <ul v-if="Array.isArray(node)" class="items">
      <MenuItem
        v-for="item in node"
        :key="item"
        :item-key="item"
        :category-picture="info(categoryKey).picture_small"
      />
    </ul>
    <template v-else>
      <MenuSection
        v-for="(child, childKey) in node"
        :key="childKey"
        :category-key="String(childKey)"
        :node="child"
        :depth="depth + 1"
      />
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import MenuItem from './MenuItem.vue';
import { useMenu, type MenuTree } from 'src/composables/useMenu';
import { splitNote } from 'src/utils/heading';
import { openImageKey } from 'src/utils/keys';

const props = defineProps<{
  categoryKey: string;
  node: MenuTree | string[];
  depth: number;
}>();

const { name, info } = useMenu();
const openImage = inject(openImageKey)!;

const anchor = computed(() => 'c-' + props.categoryKey.replace(/[^\w-]/g, ''));
const label = computed(() => splitNote(name(props.categoryKey)));
const picture = computed(() => {
  const values = info(props.categoryKey);
  const src = values.picture_large ?? values.picture_small;
  return src ? { large: '/' + src } : undefined;
});
</script>

<style scoped>
.depth-0 {
  padding-top: 2.5rem;
}

.depth-0 + .depth-0 {
  margin-top: 1rem;
  border-top: 1px solid var(--ink);
}

.heading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

h2 {
  font-size: 1.5rem;
  letter-spacing: 0.02em;
}

h3 {
  font-family: var(--sans);
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--mint-ink);
}

.depth-1,
.depth-2 {
  padding-top: 1.75rem;
}

.depth-0 > .heading + .items {
  margin-top: 0.5rem;
}

.depth-1 > .heading,
.depth-2 > .heading {
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--line);
}

.note {
  margin-top: 0.2rem;
  font-size: 0.875rem;
  font-style: italic;
  color: var(--ink-soft);
}

.items {
  margin: 0;
  padding: 0;
  list-style: none;
}

.thumb {
  flex: none;
  padding: 0;
  border: 0;
  border-radius: 50%;
  overflow: hidden;
  background: var(--line);
  cursor: zoom-in;
}

.thumb img {
  width: 2.75rem;
  height: 2.75rem;
  object-fit: cover;
}
</style>
