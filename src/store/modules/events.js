import filter from 'lodash/filter';
import { db } from '../../firebase';
import lf from '../../localforage';

export const actionTypes = {
  LOAD_PARTICIPANTS: 'events/LOAD_PARTICIPANTS',
  LOAD_EVENTS: 'events/LOAD_EVENTS',
  GET_EVENT_DETAILS: 'events/GET_EVENT_DETAILS',
  SAVE_EVENT: 'events/SAVE_EVENT',
};

const mutationTypes = {
  LOAD_PARTICIPANTS_SUCCESS: 'events/LOAD_PARTICIPANTS_SUCCESS',
  LOAD_EVENTS_SUCCESS: 'events/LOAD_EVENTS_SUCCESS',
  GET_EVENT_DETAILS_SUCCESS: 'events/GET_EVENT_DETAILS_SUCCESS',
};

const state = {
  events: [],
  selectedEvent: {},
  participants: [],
};

const actions = {
  [actionTypes.LOAD_PARTICIPANTS](context) {
    const participantsRef = db.ref('participants');
    participantsRef.on('value', (snapshot) => {
      const participants = filter(snapshot.val(), e => e);
      context.commit(mutationTypes.LOAD_PARTICIPANTS_SUCCESS, { participants });
    });
  },

  [actionTypes.LOAD_EVENTS](context) {
    const eventsRef = db.ref('events');
    if (navigator.onLine) {
      eventsRef.on('value', (snapshot) => {
        const events = filter(snapshot.val(), e => e);
        context.commit(mutationTypes.LOAD_EVENTS_SUCCESS, { events });
        lf.setItem('events', events);
      });
    } else {
      lf.getItem('events').then((value) => {
        context.commit(mutationTypes.LOAD_EVENTS_SUCCESS, { value });
      });
    }
  },

  [actionTypes.GET_EVENT_DETAILS](context) {
    const seoSlug = context.rootState.route.params.seoSlug;
    const eventRef = db.ref('events').orderByChild('seoSlug').equalTo(seoSlug);
    eventRef.on('child_added', (snapshot) => {
      const event = snapshot.val();
      context.commit(mutationTypes.GET_EVENT_DETAILS_SUCCESS, { event });
    });
  },

  [actionTypes.SAVE_EVENT](context, payload) {
    const newEventRef = db.ref('events').push();
    newEventRef.set({ ...payload, id: newEventRef.key })
          .then(() => {
            console.log('Event added');
          })
          .catch(() => {
            console.log('Error');
          });
  },
};

const mutations = {
  [mutationTypes.LOAD_PARTICIPANTS_SUCCESS](state, { participants }) {
    state.participants = participants;
  },
  [mutationTypes.LOAD_EVENTS_SUCCESS](state, { events }) {
    state.events = events;
  },
  [mutationTypes.GET_EVENT_DETAILS_SUCCESS](state, { event }) {
    state.selectedEvent = event;
  },
};

const getters = {

};

export default {
  state,
  actions,
  mutations,
  getters,
};
