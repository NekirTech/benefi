<template>
  <div>
    <q-carousel
      v-model="selectedSlide"
      transition-prev="slide-right"
      transition-next="slide-left"
      animated
      arrows
      control-color="primary"
      class="rounded-borders bg-grey"
      infinite
      options="regular"
      navigation
      swipeable
      autoplay
    >
      <q-carousel-slide
        v-for="(slide, index) in slides"
        :key="index"
        :name="slide.alt"
      >
        <q-img
          class="rounded-borders full-height"
          :src="slide.src"
          fit="contain"
        ></q-img>
      </q-carousel-slide>
    </q-carousel>

    <div class="q-pa-md">
      <h1 class="text-h5 q-mb-md">{{ welcome }}</h1>
      <p class="text-body1 q-mb-md">
        {{ enjoy }}
      </p>
    </div>
    <div class="q-pa-md">
      <h1 class="text-h5 q-mb-md">{{ opening }}</h1>
      <p class="text-body1 q-mb-md">{{ location }}</p>
    </div>
    <div class="q-pa-md">
      <h1 class="text-h6 q-mb-md">{{ imprint }}</h1>
      <p class="text-body1">
        {{ name }}<br />
        {{ street }}<br />
        {{ postcode }}<br />
        <br />
        {{ email }}<br />
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { inject } from 'vue';
import en from 'src/locales/en.json';
import tr from 'src/locales/tr.json';
const bus = inject('bus');
let selectedSlide = ref('Coffee');
const slides = [
  {
    src: 'coffee.jpg',
    alt: 'Coffee',
  },
  {
    src: 'cake_1.jpg',
    alt: 'Cake',
  },
  {
    src: 'donut.jpg',
    alt: 'Donut',
  },
];
let current = {};
current = tr;
const welcome = ref(current['welcome']);
const enjoy = ref(current['enjoy']);
const opening = ref(current['opening']);
const location = ref(current['location']);
const imprint = ref(current['imprint']);
const name = ref(current['name']);
const street = ref(current['street']);
const postcode = ref(current['postcode']);
const email = ref(current['email']);
function switchLanguage(language) {
  if (language == 'tr') {
    current = tr;
  } else if (language == 'en') {
    current = en;
  } else {
    return;
  }
  welcome.value = current['welcome'];
  enjoy.value = current['enjoy'];
  opening.value = current['opening'];
  location.value = current['location'];
  imprint.value = current['imprint'];
  name.value = current['name'];
  street.value = current['street'];
  postcode.value = current['postcode'];
  email.value = current['email'];
}
bus.on('changeLanguage', (lang) => {
  switchLanguage(lang);
});
function getUserLocale() {
  const locale =
    window.navigator.language ||
    window.navigator.userLanguage ||
    Trans.defaultLocale;
  return locale.split('-')[0];
}
switchLanguage(getUserLocale());
</script>
