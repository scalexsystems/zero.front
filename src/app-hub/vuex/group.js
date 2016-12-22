import isArray from 'lodash/isArray';
import sort from 'lodash/sortBy';
import unique from 'lodash/uniqBy';
import Vue from 'vue';
import { pushOrMerge } from '../../util';
import { types as rootTypes } from '../../vuex/meta';
import { actions, getters, types } from './meta';

const bootedAt = Date.now();

export default {
  state: {
    groups: [],
  },
  getters: {
    [getters.groups](state) {
      return state.groups;
    },
    [getters.groupMap](state) {
      const map = {};

      state.groups.forEach((group, index) => {
        map[group.id] = index;
      });

      return map;
    },
  },
  mutations: {
    [types.ADD_GROUP](state, payload) {
      const groups = (isArray(payload) ? payload : [payload])
          .map(group => ({
            messages: [],
            messages_next_page: 1,
            messages_loaded: false,
            has_unread: false,
            unread_count: 0,
            ...group,
          }));

      pushOrMerge(state.groups, groups, ['messages', 'messages_loaded', 'messages_next_page', 'unread_count', 'has_unread']);
    },
    [types.ADD_MESSAGE_TO_GROUP](state, { groupId, messages }) {
      const index = state.groups.findIndex(group => group.id === groupId);

      if (index === -1) return;

      const group = state.groups[index];

      group.messages = sort(unique([...group.messages, ...messages], 'id'), 'id');
      group.unread_count = group.messages.filter(message => message.unread).length;
      group.has_unread = group.unread_count > 0;
    },
    [types.READ_GROUP_MESSAGE](state, { groupId, message }) {
      const index = state.groups.findIndex(group => group.id === groupId);

      if (index === -1) return;

      const group = state.groups[index];
      const messageIndex = group.messages.indexOf(message);
      const messageState = group.messages[messageIndex];

      if (messageState.unread) {
        state.groups[index].unread_count -= 1;
      }
      state.groups[index].messages[messageIndex].read_at = (new Date()).toISOString();
      state.groups[index].messages[messageIndex].unread = false;
      state.groups[index].has_unread = group.unread_count > 0;
    },
    [types.STATUS_GROUP_MESSAGE](state, { groupId, message, payload, success }) {
      const index = state.groups.findIndex(group => group.id === groupId);

      if (index === -1) return;
      const messageIndex = state.groups[index].messages.indexOf(message);

      if (success) {
        state.groups[index].messages.splice(messageIndex, 1, payload);
      } else {
        state.groups[index].messages[messageIndex].failed = true;
        state.groups[index].messages[messageIndex].sending = false;
      }
    },
    [types.REMOVE_GROUP](state, { groupId }) {
      const index = state.groups.findIndex(group => group.id === groupId);

      state.groups.splice(index, 1);
    },
    [types.SET_VALUE_ON_GROUP](state, { groupId, key, value }) {
      const index = state.groups.findIndex(group => group.id === groupId);

      state.groups[index][key] = value;
    },
  },
  actions: {
    [actions.findGroupById]({ state }, groupId) {
      const index = state.groups.findIndex(group => group.id === groupId);

      if (index in state.groups) {
        return state.groups[index];
      }

      return null;
    },
    [actions.setGroups]({ commit }, groups) {
      commit(types.ADD_GROUP, groups);
      commit(rootTypes.ADD_GROUP, groups);
    },
    [actions.getGroups]({ commit }, params = {}) {
      return Vue.http.get('me/groups', { params })
          .then(response => response.json())
          .then((result) => {
            commit(types.ADD_GROUP, result.data);
            commit(rootTypes.ADD_GROUP, result.data);

            return result;
          })
          .catch(response => response);
    },
    [actions.getMessagesFromGroup]({ commit, state }, { groupId, params = {} }) {
      const index = state.groups.findIndex(group => group.id === groupId);
      const group = state.groups[index];
      const payload = {
        params: {
          ...params,
          timestamp: bootedAt,
          page: group.messages_next_page,
        },
      };

      if (group.messages_loaded) {
        return new Promise((_, reject) => reject({ message: 'All messages loaded.' }));
      }

      commit(types.SET_VALUE_ON_GROUP, {
        groupId,
        key: 'messages_next_page',
        value: group.messages_next_page + 1,
      });

      return Vue.http.get(`groups/${groupId}/messages`, payload)
          .then(response => response.json())
          .then((result) => {
            commit(types.ADD_MESSAGE_TO_GROUP, { groupId, messages: result.data });

            if (result._meta.pagination.current_page === result._meta.pagination.total_pages) {
              commit(types.SET_VALUE_ON_GROUP, {
                groupId,
                key: 'messages_loaded',
                value: true,
              });
            }

            return result;
          })
          .catch(response => response);
    },
    [actions.onNewMessageToGroup]({ commit }, { groupId, message }) {
      const receiverId = groupId === undefined
          ? message.receiver.id
          : groupId;

      commit(types.ADD_MESSAGE_TO_GROUP, { groupId: receiverId, messages: [message] });
    },
    [actions.sendMessageToGroup]({ commit, rootState },
      { groupId, content, params = {}, errors = [] }) {
      const message = { id: Date.now(), content, sending: true, sender: rootState.user.user };

      commit(types.ADD_MESSAGE_TO_GROUP, { groupId, messages: [message] });

      return Vue.http.post(`groups/${groupId}/messages`, { content, ...params })
          .then(response => response.json())
          .then((result) => {
            commit(types.STATUS_GROUP_MESSAGE, {
              groupId,
              message,
              payload: { ...result, errors },
              success: true,
            });

            return result;
          })
          .catch((response) => {
            commit(types.STATUS_GROUP_MESSAGE, { groupId, message, success: false });

            return response;
          });
    },
    [actions.sendMessageReadReceiptForGroup]({ commit, rootState }, { groupId, message }) {
      if (message.sender_id === rootState.user.user.id) {
        commit(types.READ_GROUP_MESSAGE, { groupId, message });

        return;
      }

      Vue.http.put(`groups/${groupId}/messages/${message.id}/read`)
          .then(() => commit(types.READ_GROUP_MESSAGE, { groupId, message }))
          .catch(response => response);
    },
    [actions.joinGroup]({ commit }, { groupId }) {
      commit(rootTypes.SET_USER_IS_MEMBER, { groupId, isMember: true });
    },
    [actions.leaveGroup]({ commit }, { groupId }) {
      commit(types.REMOVE_GROUP, { groupId });
      commit(rootTypes.SET_VALUE_ON_GROUP, { groupId, key: 'is_member', value: false });
    },
    [actions.updateGroupPhoto]({ commit }, { groupId, photo }) {
      commit(types.SET_VALUE_ON_GROUP, { groupId, key: 'photo', value: photo });
      commit(rootTypes.SET_VALUE_ON_GROUP, { groupId, key: 'photo', value: photo });
    },
  },
};
