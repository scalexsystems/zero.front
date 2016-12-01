import Vue from 'vue';
import { actions, types, getters } from '../meta';

export default {
  state: {
    user: window.Laravel.user || {},
  },
  getters: {
    [getters.user](state) {
      return state.user;
    },
  },
  mutations: {
    [types.SET_USER](state, user) {
      state.user = user;
    },
  },
  actions: {
    [actions.getUser]({ commit }) {
      return Vue.http.get('me')
          .then(response => response.json())
          .then((result) => {
            commit(types.SET_USER, result);

            return result;
          })
          .catch(response => response);
    },
  },
};
