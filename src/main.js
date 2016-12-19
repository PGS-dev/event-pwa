import Vue from 'vue';
import VueRouter from 'vue-router';
import VueFire from 'vuefire';
import VueMdl from 'vue-mdl';
import App from './App';
import EventsList from './components/EventsList';
import EventDetails from './components/EventDetails';

Vue.use(VueMdl);
Vue.use(VueFire);
Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: EventsList },
    { path: '/event/:seoSlug', name: 'event', component: EventDetails },
  ],
});

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  template: '<App/>',
  components: { App },
});
