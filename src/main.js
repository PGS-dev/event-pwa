import Vue from 'vue';
import VueFire from 'vuefire';
import { sync } from 'vuex-router-sync';
import VueMdl from 'vue-mdl';
import 'material-design-lite/material.min';
import App from './App.vue';
import router from './router';
import store from './store/index';
import { messaging } from './firebase';
import { actionTypes as userAction } from './store/modules/user';
import './registerServiceWorker';

sync(store, router);

if (navigator.serviceWorker) {
  navigator.serviceWorker.ready.then(reg => {
    messaging.useServiceWorker(reg);
    messaging
      .requestPermission()
      .then(() => messaging.getToken())
      .then(token => {
        store.dispatch(userAction.TOKEN_RECEIVED, token);
      })
      .catch(() => {
        store.dispatch(userAction.TOKEN_DENIED);
      });
  });
} else {
  store.dispatch(userAction.TOKEN_DENIED);
}

Vue.config.productionTip = false;

Vue.use(VueMdl);
Vue.use(VueFire);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
