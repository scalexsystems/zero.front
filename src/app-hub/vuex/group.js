import isArray from 'lodash/isArray';
import each from 'lodash/each';
import get from 'lodash/get';
import first from 'lodash/first';
import sort from 'lodash/sortBy';
import moment from 'moment';
import Vue from 'vue';
import * as m from './mutation-types';
import * as a from './action-types';

export default {
  state: {
    groups: [],
    groupMap: {}, // NOTICE: Internal!
    groupPages: {},
  },
  getters: {
    hubGroups(state) {
      return state.groups;
    },
    hubRecentGroups(state) {
      const score = (item) => {
        if (item) {
          return -moment(item).valueOf();
        }

        return 0;
      };

      return sort(state.groups, group => score(group.active_at));
    },
  },
  mutations: {
    [m.ADD_GROUP](state, payload) {
      const groups = isArray(payload.groups) ? payload.groups : [payload.groups];

      each(groups, (group) => {
        if (!(group.id in state.groupMap)) {
          if (!('messages' in group)) {
            group.messages = [];
          }
          state.groupMap[group.id] = state.groups.length;
          state.groups.push(group);
        }
      });

      state.groupPages = payload.paginator;
    },
    [m.ADD_GROUP_MESSAGE](state, { group, messages, prepend, replace }) {
      if (group in state.groupMap) {
        const index = state.groupMap[group];
        if (replace !== undefined) {
          const messageIndex = state.groups[index].indexOf(replace);
          state.groups[index].splice(messageIndex, 1, messages);

          return;
        }

        if (prepend === true) {
          state.groups[index].messages.unshift(...messages);
        } else {
          state.groups[index].messages.push(...messages);
        }

        state.groups[index].messages = sort(state.groups[index].messages, 'id');
      }
    },
    [m.MARK_GROUP_MESSAGE_READ](state, { group, message }) {
      const index = state.groupMap[group];
      const messageIndex = state.groups[index].messages.indexOf(message);
      state.groups[index].messages[messageIndex].read_at = (new Date()).toISOString();
      state.groups[index].messages[messageIndex].unread = false;
    },
  },

  actions: {
    [a.GET_GROUPS]({ commit, dispatch }, params = {}) {
      return Vue.http.get('me/groups', { params })
          .then(response => response.json())
          .then((result) => {
            const groups = result.data;
            const paginator = get(result, '_meta.pagination');

            commit(m.ADD_GROUP, { groups, paginator });

            if (paginator.current_page < paginator.total_pages) {
              dispatch(a.GET_GROUPS, { page: paginator.current_page + 1 });
            }

            return result;
          })
          .catch(response => response); // FIXME: Unhandled error.
    },
    [a.NEW_MESSAGE_IN_GROUP]({ commit }, { group, message, replace }) {
      commit(m.ADD_GROUP_MESSAGE, { group, messages: [message], prepend: false, replace });
    },
    [a.GET_GROUP_MESSAGES]({ commit, state }, { group, params }) {
      const index = state.groupMap[group];
      const lastMessage = (state.groups[index]
              ? first(state.groups[index].messages)
              : { id: 2147483647 }) || { id: 2147483647 };

      return Vue.http.get(`groups/${group}/messages`, { params: { before: lastMessage.id, ...params } })
          .then(response => response.json())
          .then((result) => {
            commit(m.ADD_GROUP_MESSAGE, { group, messages: sort(result.data, 'id'), prepend: true });

            return result;
          })
          .catch(response => response); // FIXME: Unhandled error.
    },
    [a.SEND_GROUP_MESSAGE_READ_RECEIPT]({ commit }, { group, message }) {
      return Vue.http.put(`groups/messages/${message.id}/read`)
          .then(() => commit(m.MARK_GROUP_MESSAGE_READ, { group, message }))
          .catch(response => response); // FIXME: Unhandled error.
    },
  },
};
