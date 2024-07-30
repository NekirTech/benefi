<template>
  <q-layout view="hHh lpR fFf">
    <div class="header row justify-between bg-accent">
      <div class="logo-container">
        <router-link to="/" class="logo-container q-px-xs">
          <img src="benefi_logo.svg" alt="Café Logo" class="logo" />
          <div class="text-h5 text-dark logo-text">Benefi Café</div>
        </router-link>
        <q-separator vertical inset></q-separator>
        <router-link to="/menu" class="logo-container q-px-xs">
          <div class="text-h5 text-dark logo-text">Menu</div>
        </router-link>
        <q-separator vertical inset></q-separator>
      </div>
      <div class="flags">
        <country-flag country="us" size="big" @click="changeLanguage('en')" />
        <country-flag country="tr" size="big" @click="changeLanguage('tr')" />
      </div>
    </div>

    <q-page-container class="q-page">
      <router-view />
    </q-page-container>
    <div>
      <q-btn
        icon="fa-brands fa-instagram"
        size="xl"
        href="https://www.instagram.com/benefi_cafe/"
        target="_blank"
        round
        flat
      ></q-btn>
      <q-btn
        icon="fa-brands fa-tiktok"
        href="https://www.tiktok.com/@benefi.cafe"
        target="_blank"
        size="xl"
        round
        flat
      ></q-btn>
    </div>
  </q-layout>
</template>
<script setup>
import CountryFlag from 'vue-country-flag-next';
import { inject } from 'vue';
const bus = inject('bus');
function changeLanguage(lang) {
  bus.emit('changeLanguage', lang);
}
</script>
<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #41658a; /* Hintergrundfarbe anpassen */
  z-index: 1000;
  padding: 0px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1); /* Optional: Schatten für einen schwebenden Effekt */
}
.flags {
  display: flex;
  gap: 1px; /* Hier wird ein Abstand zwischen den Flaggen hinzugefügt (optional) */
  align-items: center;
}
.logo {
  max-height: 80px; /* Passen Sie die Höhe nach Bedarf an */
  max-width: 100%; /* Sicherstellen, dass das Logo responsiv bleibt */
  margin: 0;
}

.q-page {
  padding-top: 90px; /* Platz für den fixierten Header schaffen */
}
.logo-container {
  display: flex;
  align-items: center;
}
.logo-text {
  margin-left: 0px; /* Abstand zwischen Logo und Text anpassen */
}
a {
  text-decoration: none;
}
</style>
