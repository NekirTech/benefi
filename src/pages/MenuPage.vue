<template>
  <div class="content">
    <h1 class="text-h4 q-mb-lg text-center">Menu</h1>
    <q-list bordered padding>
      <my-expansion-item :items="menu" :level="Number(0)"></my-expansion-item>
    </q-list>
  </div>
</template>

<script setup>
import menu from 'src/locales/menu.json';
import myExpansionItem from 'src/components/MyExpansionItem.vue';
</script>
