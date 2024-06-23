<template>
  <q-expansion-item
    v-for="(categories, categoryKey) in items"
    :key="categoryKey"
    :label="getTranslation(categoryKey, 'name')"
    :header-inset-level="level"
    dense
    header-class=" text-dark text-subtitle2 bg-accent
"
    expand-separator
  >
    <my-expansion-item
      v-if="!Array.isArray(categories)"
      :items="categories"
      :level="Number(level) + 1"
    ></my-expansion-item>
    <q-item
      v-for="item in Array.isArray(categories) ? categories : []"
      :key="item"
      class="q-px-md q-py-sm"
    >
      <q-item-section avatar v-if="getStaticValues(item, 'picture')">
        <q-avatar rounded size="xl">
          <img :src="getStaticValues(item, 'picture')" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ getTranslation(item, 'name') }}</q-item-label>
        <q-item-label
          caption
          v-if="getTranslation(item, 'description') != 'No Translation'"
          >{{ getTranslation(item, 'description') }}
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-item-label v-if="getStaticValues(item, 'smallPrice')"
          >{{ getStaticValues(item, 'smallPrice') }} /
          {{ getStaticValues(item, 'largePrice') }}
        </q-item-label>

        <q-item-label v-if="!getStaticValues(item, 'smallPrice')">
          {{ getStaticValues(item, 'largePrice') }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-expansion-item>
</template>
<script setup>
import { ref } from 'vue';
import { inject } from 'vue';
defineProps(['items', 'level']);
import myExpansionItem from 'src/components/MyExpansionItem.vue';
import menu_en from 'src/locales/menu_en.json';
import menu_tr from 'src/locales/menu_tr.json';
import menu_static from 'src/locales/menu_static.json';
let menu_dynamic = ref(menu_en);

function getTranslation(key, value_name) {
  let translation = 'No Translation';
  if (!menu_dynamic.value.hasOwnProperty(key)) {
    return translation;
  }
  if (menu_dynamic.value[key].hasOwnProperty(value_name)) {
    translation = menu_dynamic.value[key][value_name];
  }
  return translation;
}
function getStaticValues(key, value_name) {
  let static_value = '';
  if (!menu_static.hasOwnProperty(key)) {
    return static_value;
  }
  if (menu_static[key].hasOwnProperty(value_name)) {
    static_value = menu_static[key][value_name];
  }
  return static_value;
}
const bus = inject('bus');

function switchLanguage(language) {
  if (language == 'tr') {
    menu_dynamic.value = menu_tr;
  } else if (language == 'en') {
    menu_dynamic.value = menu_en;
  } else {
    return;
  }
}
bus.on('changeLanguage', (lang) => {
  switchLanguage(lang);
});
</script>
