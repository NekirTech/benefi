<template>
  <q-layout view="hHh lpR fFf">
    <div class="header">
      <div class="logo-container">
        <img src="benefi_logo.png" alt="Café Logo" class="logo" />
        <div class="text-h5 text-white logo-text">Benefi Café</div>
      </div>
    </div>

    <q-page-container class="q-page">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #41658a; /* Hintergrundfarbe anpassen */
  z-index: 1000;
  padding: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1); /* Optional: Schatten für einen schwebenden Effekt */
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
  margin-left: 10px; /* Abstand zwischen Logo und Text anpassen */
}
</style>
