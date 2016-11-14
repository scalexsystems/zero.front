import isArray from 'lodash/isArray';
import each from 'lodash/each';
import get from 'lodash/get';
import first from 'lodash/first';
import sort from 'lodash/sortBy';
import Vue from 'vue';
import moment from 'moment';
import * as m from './mutation-types';
import * as a from './action-types';

export default {
  state: {
    users: [],
    userMap: {},
    userPages: {},
  },
  getters: {
    hubUsers(state) {
      return state.users;
    },
    hubRecentUsers(state) {
      const score = (item) => {
        if (item) {
          return -moment(item).valueOf();
        }

        return 0;
      };

      return sort(state.users, user => score(user.active_at));
    },
  },
  mutations: {
    [m.ADD_USER](state, payload) {
      const users = isArray(payload.users) ? payload.users : [payload.users];

      each(users, (user) => {
        if (!(user.id in state.userMap)) {
          if (!('messages' in user)) {
            user.messages = [];
          }
          state.userMap[user.id] = state.users.length;
          state.users.push(user);
        }
      });

      if ('paginator' in payload) {
        state.userPages = payload.paginator;
      }
    },
    [m.ADD_USER_MESSAGE](state, { user, messages, prepend, replace }) {
      if (user in state.userMap) {
        const index = state.userMap[user];
        if (replace !== undefined) {
          const messageIndex = state.users[index].indexOf(replace);
          state.users[index].splice(messageIndex, 1, messages);

          return;
        }

        if (prepend === true) {
          state.users[index].messages = messages.concat(state.users[index].messages);
        } else {
          state.users[index].messages = state.users[index].messages.concat(messages);
        }

        sort(state.users[index].messages, 'id');
      }
    },
    [m.MARK_USER_MESSAGE_READ](state, { user, message }) {
      const index = state.userMap[user];
      const messageIndex = state.users[index].messages.indexOf(message);
      state.users[index].messages[messageIndex].read_at = (new Date()).toISOString();
      state.users[index].messages[messageIndex].unread = false;
    },
  },
  actions: {
    [a.GET_USERS]({ commit }, query = {}) {
      return Vue.http.get('me/messages/users', { params: query })
          .then(response => response.json())
          .then((result) => {
            const users = result.data;
            const paginator = get(result, '_meta.pagination');

            if (query.ignore) {
              commit(m.ADD_USER, { users });
            } else {
              commit(m.ADD_USER, { users, paginator });
            }

            return result;
          })
          .catch(response => response); // FIXME: Unhandled error.
    },
    [a.NEW_MESSAGE_IN_USER]({ commit }, { user, message, replace }) {
      commit(m.ADD_USER_MESSAGE, { user, messages: [message], prepend: false, replace });
    },
    [a.GET_USER_MESSAGES]({ commit, state }, { user, params }) {
      const index = state.userMap[user];
      const lastMessage = first(state.users[index].messages) || { id: 2147483647 };

      return Vue.http.get(`me/messages/users/${user}`, { params: { before: lastMessage.id, ...params } })
          .then(response => response.json())
          .then((result) => {
            commit(m.ADD_USER_MESSAGE, { user, messages: sort(result.data, 'id'), prepend: true });

            return result;
          })
          .catch(response => response); // FIXME: Unhandled error.
    },
    [a.SEND_USER_MESSAGE_READ_RECEIPT]({ commit }, { user, message }) {
      return Vue.http.put(`me/messages/${message.id}/read`)
          .then(() => commit(m.MARK_USER_MESSAGE_READ, { user, message }))
          .catch(response => response); // FIXME: Unhandled error.
    },
  },
};
