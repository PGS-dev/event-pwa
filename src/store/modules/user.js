export const actionTypes = {
  TOKEN_RECEIVED: 'user/TOKEN_RECEIVED',
  TOKEN_DENIED: 'user/TOKEN_DENIED',
  TOPIC_ASSIGNED: 'user/TOPIC_ASSIGNED',
};

const mutationTypes = {
  TOKEN_RECEIVE_SUCCESS: 'user/TOKEN_RECEIVE_SUCCESS',
  TOKEN_DENIED: 'user/TOKEN_DENIED',
  TOPIC_ASSIGNED_SUCCESS: 'user/TOPIC_ASSIGNED_SUCCESS',
};

const state = {
  token: null,
  assignedTopics: [],
};

const actions = {
  [actionTypes.TOKEN_RECEIVED](context, token) {
    context.commit(mutationTypes.TOKEN_RECEIVE_SUCCESS, token);
  },
  [actionTypes.TOKEN_DENIED](context) {
    context.commit(mutationTypes.TOKEN_DENIED);
  },
  [actionTypes.TOPIC_ASSIGNED](context, topic) {
    context.commit(mutationTypes.TOPIC_ASSIGNED_SUCCESS, topic);
  },
};

const mutations = {
  [mutationTypes.TOKEN_RECEIVE_SUCCESS](state, token) {
    state.token = token;
  },
  [mutationTypes.TOKEN_DENIED](state) {
    state.token = null;
  },
  [mutationTypes.TOPIC_ASSIGNED_SUCCESS](state, topic) {
    state.assignedTopics = [...state.assignedTopics, topic];
  },
};

export default {
  state,
  actions,
  mutations,
};
