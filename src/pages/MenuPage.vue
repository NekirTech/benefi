<template>
  <div class="content">
    <h1 class="text-h4 q-mb-lg text-center">Menü</h1>
    <q-list bordered padding>
      <q-expansion-item
        v-for="category in menu"
        :key="category.name"
        :label="category.name"
        dense
        header-class=" text-dark text-subtitle2 bg-accent
"
        expand-separator
      >
        <q-item
          v-for="item in category.items"
          :key="item.name"
          class="q-px-md q-py-sm"
        >
          <q-item-section>
            <q-item-label>{{ item.name }}</q-item-label>
            <q-item-label caption v-if="item.description">{{
              item.description
            }}</q-item-label>
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
    </q-list>
  </div>
</template>

<script setup>
import menu from 'src/locales/menu.json';
</script>
