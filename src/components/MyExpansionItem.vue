<template>
  <q-expansion-item
    v-for="category in items"
    :key="category.name"
    :label="category.name"
    :header-inset-level="level"
    dense
    header-class=" text-dark text-subtitle2 bg-accent
"
    expand-separator
  >
    <my-expansion-item
      :items="category.groups"
      :level="level + 1"
    ></my-expansion-item>
    <q-item
      v-for="item in category.items"
      :key="item.name"
      class="q-px-md q-py-sm"
    >
      <q-item-section avatar v-if="item.picture">
        <q-avatar rounded size="xl">
          <img :src="item.picture" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ item.name }}</q-item-label>
        <q-item-label caption v-if="item.description"
          >{{ item.description }}
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-item-label v-if="item.smallPrice"
          >{{ item.smallPrice }} / {{ item.largePrice }}
        </q-item-label>

        <q-item-label v-if="!item.smallPrice">
          {{ item.largePrice }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-expansion-item>
</template>
<script setup>
defineProps(['items', 'level']);
import myExpansionItem from 'src/components/MyExpansionItem.vue';
</script>
