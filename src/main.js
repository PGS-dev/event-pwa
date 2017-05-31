import Vue from 'vue';
import VueFire from 'vuefire';
import VueMdl from 'vue-mdl';
import OfflinePlugin from 'offline-plugin/runtime';
import { sync } from 'vuex-router-sync';
import 'material-design-lite/material.min.css';
import 'material-design-lite/material.min';
import App from './App';
import router from './router';
import store from './store/index';

sync(store, router);

OfflinePlugin.install({
  onUpdateReady: () => {
    // Tells to new SW to take control immediately
    OfflinePlugin.applyUpdate();
  },
  onUpdated: () => {
    // Reload the webpage to load into the new version
    window.location.reload();
  },
});

Vue.use(VueMdl);
Vue.use(VueFire);

/* eslint-disable no-new */
new Vue({
  router,
  store,
  el: '#app',
  template: '<App/>',
  //render: h => h(App),
  components: { App },
});
