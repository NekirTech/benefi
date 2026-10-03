import { createApp } from 'vue';
import '@fontsource-variable/fraunces';
import 'src/css/app.css';
import App from './App.vue';
import router from './router';

createApp(App).use(router).mount('#app');
