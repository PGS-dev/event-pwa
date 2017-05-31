import Vuex from 'vuex';
import Vue from 'vue';

import events from './modules/events';

Vue.use(Vuex);

// const debug = process.env.NODE_ENV !== 'production';
const debug = false;

const store = new Vuex.Store({
  strict: debug,
  modules: {
    events,
  },
});

export default store;
