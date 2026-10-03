<template>
  <li class="item">
    <div class="text">
      <span class="name">{{ title }}</span>
      <span v-if="desc" class="desc">{{ desc }}</span>
    </div>
    <button
      v-if="photo"
      type="button"
      class="thumb"
      :aria-label="title"
      @click="openImage(photo.large, title)"
    >
      <img :src="photo.thumb" alt="" loading="lazy" width="48" height="48" />
    </button>
    <span class="price">
      <span v-for="tag in tags" :key="tag.size ?? 'one'" class="tag">
        <abbr v-if="tag.size">{{ tag.size }}</abbr
        >{{ tag.amount }}
      </span>
    </span>
  </li>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { picturesOf, useMenu } from 'src/composables/useMenu';
import { priceTags } from 'src/utils/price';
import { openImageKey } from 'src/utils/keys';

const props = defineProps<{ itemKey: string; categoryPicture?: string }>();

const { name, description, info } = useMenu();
const openImage = inject(openImageKey)!;

const title = computed(() => name(props.itemKey));
const desc = computed(() => description(props.itemKey));
const tags = computed(() => priceTags(info(props.itemKey)));

// Items without their own photo inherit the category photo in the data.
// That one is already shown next to the category heading.
const photo = computed(() => {
  const values = info(props.itemKey);
  if (values.picture_small === props.categoryPicture) return undefined;
  return picturesOf(values);
});
</script>

<style scoped>
.item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding-block: 0.8rem;
  border-bottom: 1px solid var(--line);
}

.item:last-child {
  border-bottom: 0;
}

.thumb {
  flex: none;
  padding: 0;
  border: 0;
  background: var(--line);
  border-radius: 4px;
  overflow: hidden;
  cursor: zoom-in;
}

.thumb img {
  width: 3rem;
  height: 3rem;
  object-fit: cover;
}

.text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.name {
  overflow-wrap: anywhere;
}

.desc {
  margin-top: 0.15rem;
  font-size: 0.875rem;
  color: var(--ink-soft);
}

.price {
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.1rem;
  font-variant-numeric: tabular-nums;
  min-width: 4.75rem;
  font-weight: 500;
  white-space: nowrap;
}

abbr {
  margin-right: 0.4rem;
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--ink-soft);
}
</style>
