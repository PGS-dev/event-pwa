import filter from 'lodash/filter';
import { db } from '../../firebase';
import lf from '../../localforage';

export const actionTypes = {
  LOAD_PARTICIPANTS: 'events/LOAD_PARTICIPANTS',
  LOAD_EVENTS: 'events/LOAD_EVENTS',
  GET_EVENT_DETAILS: 'events/GET_EVENT_DETAILS',
  SAVE_EVENT: 'events/SAVE_EVENT',
  SAVE_QUESTION: 'events/SAVE_QUESTION',
  EDIT_EVENT: 'events/EDIT_EVENT',
  EDIT_QUESTION: 'events/EDIT_EVENT',
  DELETE_EVENT: 'events/DELETE_EVENT',
  DELETE_QUESTION: 'events/DELETE_QUESTION',
  UPDATE_ACTIVE_QUESTION: 'events/UPDATE_ACTIVE_QUESTION',
  UPDATE_QUESTION_WINNER: 'events/UPDATE_QUESTION_WINNER',
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
    eventRef.on('value', (snapshot) => {
      const event = filter(snapshot.val(), e => e)[0];
      context.commit(mutationTypes.GET_EVENT_DETAILS_SUCCESS, { event });
    });
  },

  // TODO: Replace console.logs with proper state mutations \/

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

  [actionTypes.SAVE_QUESTION](context, payload) {
    const newQuestionRef = db.ref(`events/${context.state.selectedEvent.id}/questions/`).push();
    newQuestionRef.set({ ...payload, id: newQuestionRef.key })
      .then(() => {
        console.log('Question added');
      })
      .catch(() => {
        console.log('Error');
      });
  },

  [actionTypes.EDIT_EVENT](context, payload) {
    const updatedRef = db.ref(`events/${context.state.selectedEvent.id}`);
    updatedRef.update(payload)
      .then(() => {
        console.log('Event edited');
      })
      .catch(() => {
        console.log('Error');
      });
  },

  [actionTypes.EDIT_QUESTION](context, payload) {
    const updatedRef = db.ref(
      `events/${context.state.selectedEvent.id}/questions/${context.rootState.route.params.questionId}`,
    );
    updatedRef.update(payload)
      .then(() => {
        console.log('Question edited');
      })
      .catch(() => {
        console.log('Error');
      });
  },

  [actionTypes.DELETE_EVENT](context, id) {
    const ref = db.ref(
      `events/${id}`,
    );
    ref.remove()
      .then(() => {
        console.log('Event removed');
      })
      .catch(() => {
        console.log('Error');
      });
  },

  [actionTypes.DELETE_QUESTION](context, id) {
    const ref = db.ref(
      `events/${context.state.selectedEvent.id}/questions/${id}`,
    );
    ref.remove()
      .then(() => {
        console.log('Question removed');
      })
      .catch(() => {
        console.log('Error');
      });
  },

  [actionTypes.UPDATE_ACTIVE_QUESTION](context, { id, isActive }) {
    const payload = {
      active: isActive,
      winner: null,
    };
    const updatedRef = db.ref(`events/${context.state.selectedEvent.id}/questions/${id}`);
    updatedRef.update(payload)
      .then(() => {
        console.log('Active question chosen');
      })
      .catch(() => {
        console.log('Error');
      });
  },

  [actionTypes.UPDATE_QUESTION_WINNER](context, { questionRef, drawing, winner }) {
    const payload = {
      drawing,
      winner,
    };
    const updatedRef = db.ref(questionRef);
    updatedRef.update(payload)
      .then(() => {
        console.log('Active question chosen');
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
