import Vue from 'vue';
import VueFire from 'vuefire';
import VueMdl from 'vue-mdl';
import App from './App.vue';
import router from './router';
import store from './store/index';
import './registerServiceWorker';
import { sync } from 'vuex-router-sync';

sync(store, router);

Vue.config.productionTip = false;

Vue.use(VueMdl);
Vue.use(VueFire);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
