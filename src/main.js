import Vue from 'vue';
import VueFire from 'vuefire';
import VueMdl from 'vue-mdl';
import OfflinePlugin from 'offline-plugin/runtime';
import { sync } from 'vuex-router-sync';
import 'material-design-lite/material.min.css';
import 'material-design-lite/material.min';
import axios from 'axios';
import App from './App';
import router from './router';
import store from './store/index';
import { messaging } from './firebase';
import { actionTypes as userAction } from './store/modules/user';

sync(store, router);

OfflinePlugin.install();
// https://github.com/NekR/offline-plugin/issues/61
if (navigator.serviceWorker) {
  navigator.serviceWorker.ready.then((reg) => {
    messaging.useServiceWorker(reg);
    messaging.requestPermission()
      .then(() => messaging.getToken())
      .then((token) => {
        store.dispatch(userAction.TOKEN_RECEIVED, token);
        axios({
          method: 'get',
          url: '/topicAssignment',
          params: {
            token,
            topic: 'allUsers',
          },
        });
      })
      .catch(() => {
        store.dispatch(userAction.TOKEN_DENIED);
      });
  });
} else {
  store.dispatch(userAction.TOKEN_DENIED);
}

Vue.use(VueMdl);
Vue.use(VueFire);

/* eslint-disable no-new */
new Vue({
  router,
  store,
  el: '#app',
  template: '<App/>',
  components: { App },
});
