export const actionTypes = {
  TOKEN_RECEIVED: 'user/TOKEN_RECEIVED',
  TOKEN_DENIED: 'user/TOKEN_DENIED',
};

const mutationTypes = {
  TOKEN_RECEIVE_SUCCESS: 'user/TOKEN_RECEIVE_SUCCESS',
  TOKEN_DENIED: 'user/TOKEN_DENIED',
};

const state = {
  data: {},
};

const actions = {
  [actionTypes.TOKEN_RECEIVED](context, token) {
    context.commit(mutationTypes.TOKEN_RECEIVE_SUCCESS, token);
  },
  [actionTypes.TOKEN_DENIED](context) {
    context.commit(mutationTypes.TOKEN_DENIED);
  },
};

const mutations = {
  [mutationTypes.TOKEN_RECEIVE_SUCCESS](state, token) {
    state.data.token = token;
  },
  [mutationTypes.TOKEN_DENIED](state) {
    state.data.token = null;
  },
};

export default {
  state,
  actions,
  mutations,
};
