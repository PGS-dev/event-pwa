import Vue from 'vue';
import VueRouter from 'vue-router';
import VueFire from 'vuefire';
import VueMdl from 'vue-mdl';
import OfflinePlugin from 'offline-plugin/runtime';
import 'material-design-lite/material.min.css';
import 'material-design-lite/material.min';
import App from './App';
import EventsList from './components/EventsList';
import EventDetails from './components/EventDetails';
import EventQuiz from './components/EventQuiz';

OfflinePlugin.install();

Vue.use(VueMdl);
Vue.use(VueFire);
Vue.use(VueRouter);

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

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', name: 'events', component: EventsList },
    { path: '/event/:seoSlug', name: 'agenda', component: EventDetails },
    { path: '/event/:seoSlug/konkurs', name: 'quiz', component: EventQuiz },
  ],
});

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  template: '<App/>',
  components: { App },
});
