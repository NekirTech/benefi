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
      <h1 class="text-h5 q-mb-md">Welcome to Benefi Café</h1>
      <p class="text-body1 q-mb-md">
        Enjoy Coffee, Tea and homemade cakes in our lovely atmosphere!
      </p>
    </div>
    <div class="q-pa-md">
      <h1 class="text-h5 q-mb-md">Visit us every day 8:30 - 23</h1>
      <p class="text-body1 q-mb-md">Directly opposite of the city square</p>
    </div>
    <div class="q-pa-md">
      <h1 class="text-h6 q-mb-md">Imprint</h1>
      <p class="text-body1">
        Benefi Cafe<br />
        Yeni, Atatürk Blv. No:138<br />
        09270 Didim/Aydın<br />
        <br />
        E-Mail: info@benefi.cafe<br />
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
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
</script>

<style scoped>
/* Fügen Sie hier Ihre benutzerdefinierten Styles hinzu */
</style>
