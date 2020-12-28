import { createApp } from 'vue';
import dotenv from 'dotenv';
import 'mdb-ui-kit/css/mdb.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
// import JS part of Material Bootstrap, needed for navbar toggles
// eslint-disable-next-line no-unused-vars
import * as mdb from 'mdb-ui-kit';
// import Vuex from 'vuex';
import App from './App.vue';
import router from './router';

dotenv.config();

createApp(App).use(router).mount('#app');
