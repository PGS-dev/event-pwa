import filter from 'lodash/filter';
import { db } from '../../firebase';
import lf from '../../localforage';

export const actionTypes = {
  LOAD_PARTICIPANTS: 'events/LOAD_PARTICIPANTS',
  LOAD_EVENTS: 'events/LOAD_EVENTS',
  GET_EVENT_DETAILS: 'events/GET_EVENT_DETAILS',
  SAVE_EVENT: 'events/SAVE_EVENT',
  SAVE_PARTICIPANT: 'events/SAVE_PARTICIPANT',
  SAVE_QUESTION: 'events/SAVE_QUESTION',
  EDIT_EVENT: 'events/EDIT_EVENT',
  EDIT_QUESTION: 'events/EDIT_QUESTION',
  DELETE_EVENT: 'events/DELETE_EVENT',
  DELETE_QUESTION: 'events/DELETE_QUESTION',
  UPDATE_ACTIVE_QUESTION: 'events/UPDATE_ACTIVE_QUESTION',
  UPDATE_QUESTION_WINNER: 'events/UPDATE_QUESTION_WINNER',
  SHOW_POPUP_MESSAGE: 'events/SHOW_POPUP_MESSAGE',
  CLEAR_POPUP_MESSAGE: 'events/CLEAR_POPUP_MESSAGE',
};

const mutationTypes = {
  LOAD_PARTICIPANTS_SUCCESS: 'events/LOAD_PARTICIPANTS_SUCCESS',
  LOAD_EVENTS_SUCCESS: 'events/LOAD_EVENTS_SUCCESS',
  GET_EVENT_DETAILS_SUCCESS: 'events/GET_EVENT_DETAILS_SUCCESS',
  SHOW_POPUP_MESSAGE: 'events/SHOW_POPUP_MESSAGE',
  CLEAR_POPUP_MESSAGE: 'events/CLEAR_POPUP_MESSAGE',
};

const state = {
  events: [],
  eventsFetched: false,
  selectedEvent: {},
  participants: [],
  popupMessage: null,
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

  [actionTypes.SAVE_PARTICIPANT](context, payload) {
    const newParticipantRef = db.ref('participants').push();
    lf.getItem('submissions').then((values) => {
      const currentSubmissions = values || [];
      currentSubmissions.push({ ...payload, id: newParticipantRef.key });
      lf.setItem('submissions', currentSubmissions);
    });
    return newParticipantRef.set({ ...payload, id: newParticipantRef.key })
      .catch((error) => {
        context.commit(mutationTypes.SHOW_POPUP_MESSAGE, 'Wystąpił błąd podczas zapisywania odpowiedzi!');
        throw error;
      },
    );
  },

  // TODO: Replace console.logs with proper state mutations \/

  [actionTypes.SAVE_EVENT](context, payload) {
    const newEventRef = db.ref('events').push();
    return newEventRef.set({ ...payload, id: newEventRef.key })
      .then(() => {
        context.commit(mutationTypes.SHOW_POPUP_MESSAGE, 'Wydarzenie zostało dodane');
      })
      .catch((error) => {
        context.commit(mutationTypes.SHOW_POPUP_MESSAGE, 'Wystąpił błąd podczas dodawania wydarzenia!');
        throw error;
      });
  },

  [actionTypes.SAVE_QUESTION](context, payload) {
    const newQuestionRef = db.ref(`events/${context.state.selectedEvent.id}/questions/`).push();
    return newQuestionRef.set({ ...payload, id: newQuestionRef.key })
      .then(() => {
        context.commit(mutationTypes.SHOW_POPUP_MESSAGE, 'Pytanie zostało dodane');
      })
      .catch((error) => {
        context.commit(mutationTypes.SHOW_POPUP_MESSAGE, 'Wystąpił błąd podczas dodawania pytania!');
        throw error;
      });
  },

  [actionTypes.EDIT_EVENT](context, payload) {
    const updatedRef = db.ref(`events/${context.state.selectedEvent.id}`);
    return updatedRef.update(payload)
      .then(() => {
        context.commit(mutationTypes.SHOW_POPUP_MESSAGE, 'Wydarzenie zostało zapisane');
      })
      .catch((error) => {
        context.commit(mutationTypes.SHOW_POPUP_MESSAGE, 'Wystąpił błąd podczas zapisywania wydarzenia!');
        throw error;
      });
  },

  [actionTypes.EDIT_QUESTION](context, payload) {
    const updatedRef = db.ref(
      `events/${context.state.selectedEvent.id}/questions/${context.rootState.route.params.questionId}`,
    );
    return updatedRef.update(payload)
      .then(() => {
        context.commit(mutationTypes.SHOW_POPUP_MESSAGE, 'Pytanie zostało zapisane');
      })
      .catch((error) => {
        context.commit(mutationTypes.SHOW_POPUP_MESSAGE, 'Wystąpił błąd podczas zapisywania pytania!');
        throw error;
      });
  },

  [actionTypes.DELETE_EVENT](context, id) {
    const ref = db.ref(
      `events/${id}`,
    );
    return ref.remove()
      .then(() => {
        context.commit(mutationTypes.SHOW_POPUP_MESSAGE, 'Wydarzenie zostało usunięte');
      })
      .catch((error) => {
        context.commit(mutationTypes.SHOW_POPUP_MESSAGE, 'Wystąpił błąd podczas usuwania wydarzenia!');
        throw error;
      });
  },

  [actionTypes.DELETE_QUESTION](context, id) {
    const ref = db.ref(
      `events/${context.state.selectedEvent.id}/questions/${id}`,
    );
    return ref.remove()
      .then(() => {
        context.commit(mutationTypes.SHOW_POPUP_MESSAGE, 'Pytanie zostało usunięte');
      })
      .catch((error) => {
        context.commit(mutationTypes.SHOW_POPUP_MESSAGE, 'Wystąpił błąd podczas usuwania pytania!');
        throw error;
      });
  },

  [actionTypes.UPDATE_ACTIVE_QUESTION](context, { id, isActive }) {
    const payload = {
      active: isActive,
      winner: null,
    };
    const updatedRef = db.ref(`events/${context.state.selectedEvent.id}/questions/${id}`);
    return updatedRef.update(payload)
      .then(() => {
        context.commit(mutationTypes.SHOW_POPUP_MESSAGE, 'Aktywane pytanie zostało zapisane');
      })
      .catch((error) => {
        context.commit(mutationTypes.SHOW_POPUP_MESSAGE, 'Wystąpił błąd podczas zapisywania aktywnego pytania!');
        throw error;
      });
  },

  [actionTypes.UPDATE_QUESTION_WINNER](context, { questionRef, drawing, winner }) {
    const payload = {
      drawing,
      winner,
    };
    const updatedRef = db.ref(questionRef);
    return updatedRef.update(payload)
      .then(() => {
        if (!payload.drawing) {
          context.commit(mutationTypes.SHOW_POPUP_MESSAGE, 'Zwycięzca został wylosowany');
        }
      })
      .catch((error) => {
        context.commit(mutationTypes.SHOW_POPUP_MESSAGE, 'Wystąpił błąd podczas losowania zwicięzcy!');
        throw error;
      });
  },

  [actionTypes.SHOW_POPUP_MESSAGE](context, { message }) {
    context.commit(mutationTypes.SHOW_POPUP_MESSAGE, message);
  },

  [actionTypes.CLEAR_POPUP_MESSAGE](context) {
    context.commit(mutationTypes.CLEAR_POPUP_MESSAGE);
  },
};

const mutations = {
  [mutationTypes.LOAD_PARTICIPANTS_SUCCESS](state, { participants }) {
    state.participants = participants;
  },
  [mutationTypes.LOAD_EVENTS_SUCCESS](state, { events }) {
    state.events = events;
    state.eventsFetched = true;
  },
  [mutationTypes.GET_EVENT_DETAILS_SUCCESS](state, { event }) {
    state.selectedEvent = event;
  },
  [mutationTypes.SHOW_POPUP_MESSAGE](state, value) {
    state.popupMessage = value;
  },
  [mutationTypes.CLEAR_POPUP_MESSAGE](state) {
    state.popupMessage = null;
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
