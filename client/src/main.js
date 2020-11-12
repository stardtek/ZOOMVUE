/* eslint import/no-unresolved: 2 */

import { createApp } from 'vue';
import 'material-components-web/dist/material-components-web.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import Vuex from 'vuex';
import App from './App.vue';
import router from './router';

createApp(App).use(router).mount('#app');
