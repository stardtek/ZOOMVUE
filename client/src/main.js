/* eslint import/no-unresolved: 2 */

import { createApp } from 'vue';

// import Vuex from 'vuex';
import App from './App.vue';
import router from './router';

createApp(App).use(router).mount('#app');
