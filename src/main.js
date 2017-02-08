import Vue from 'vue';
import VueFire from 'vuefire';
import VueMdl from 'vue-mdl';
import OfflinePlugin from 'offline-plugin/runtime';
import 'material-design-lite/material.min.css';
import 'material-design-lite/material.min';
import App from './App';
import router from './router';

OfflinePlugin.install();

Vue.use(VueMdl);
Vue.use(VueFire);

// Check if the user is offline.
if (!navigator.onLine) {
  document.body.classList.add('offline');
}

window.addEventListener('online', () => {
  document.body.classList.remove('offline');
}, false);

window.addEventListener('offline', () => {
  document.body.classList.add('offline');
}, false);

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  template: '<App/>',
  components: { App },
});
