import Vue from 'vue';

export default {
  state: {
    courses: [],
    courses_next_page: 1,
  },
  getters: {
    courses ({ state }) {
      return state.courses;
    },
  },
  mutations: {
    SET_COURSES_PAGE({ state }, value) {
      state.courses_next_page = value;
    }
  },
  actions: {
    getCourses({ commit, state, dispatch }, params = {}) {
      const payload = {
        page: state.courses_next_page,
        with: 'group',
        ...params,
      };

      commit(mutations.SET_COURSES_PAGE, state.courses_next_page + 1);

      return Vue.http.get('me/courses', { params: payload })
        .then(response => response.json())
        .then((result) => {
          commit('school/ADD_COURSE', result.data, { root: true });
          dispatch('setGroups', result.data.map(course => course.group));
        })
        .catch(response => response); // TODO: Retry to handle fail safe.
    },
    setCourses({ commit, dispatch }, courses) {
      commit('ADD_COURSE', courses);
      dispatch('setGroups', result.data.map(course => course.group));
    }
  },
};
