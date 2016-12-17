import isArray from 'lodash/isArray';
import sort from 'lodash/sortBy';
import unique from 'lodash/uniqBy';
import omit from 'lodash/omit';
import Vue from 'vue';
import { pushIf } from '../../util';
import { types as rootTypes } from '../../vuex/meta';
import { actions, getters, types } from './meta';

const bootedAt = Date.now();

export default {
  state: {
    groups: [],
    groupMap: {},
  },
  getters: {
    [getters.groups](state) {
      return state.groups;
    },
    [getters.groupMap](state) {
      return state.groupMap;
    },
  },
  mutations: {
    [types.ADD_GROUP](state, payload) {
      const groups = (isArray(payload) ? payload : [payload])
          .map(group => ({
            messages: [],
            messages_next_page: 1,
            has_unread: false,
            unread_count: 0,
            ...group,
          }));

      pushIf(state.groups, groups, state.groupMap, ['messages', 'messages_next_page', 'unread_count', 'has_unread']);
    },
    [types.SET_MESSAGE_PAGE_TO_GROUP](state, { groupId, paginator }) {
      if (!(groupId in state.groupMap)) return;

      const index = state.groupMap[groupId];
      state.groups[index].messages_next_page = paginator.current_page + 1;
    },
    [types.ADD_MESSAGE_TO_GROUP](state, { groupId, messages }) {
      if (!(groupId in state.groupMap)) return;

      const index = state.groupMap[groupId];
      const group = state.groups[index];
      group.messages.push(...messages);
      group.messages = sort(unique(group.messages, 'id'), 'id');
      group.unread_count = group.messages.filter(message => message.unread).length;
      group.has_unread = group.unread_count > 0;
    },
    [types.READ_GROUP_MESSAGE](state, { groupId, message }) {
      if (!(groupId in state.groupMap)) return;

      const index = state.groupMap[groupId];
      const group = state.groups[index];
      const messageIndex = group.messages.indexOf(message);
      const messageState = group.messages[messageIndex];
      messageState.read_at = (new Date()).toISOString();
      if (messageState.unread) {
        messageState.unread_count -= 1;
      }
      messageState.unread = false;
      group.has_unread = group.unread_count > 0;
    },
    [types.STATUS_GROUP_MESSAGE](state, { groupId, message, payload, success }) {
      if (!(groupId in state.groupMap)) return;

      const index = state.groupMap[groupId];
      const messageIndex = state.groups[index].messages.indexOf(message);
      if (success) {
        state.groups[index].messages[messageIndex] = payload;
      } else {
        state.groups[index].messages[messageIndex].failed = true;
        state.groups[index].messages[messageIndex].sending = false;
      }
    },
    [types.REMOVE_GROUP](state, { groupId }) {
      const mappedIndex = state.groupMap[groupId];
      state.groups.splice(mappedIndex, 1);
      state.groupMap = omit(state.groupMap, groupId);
      Object.keys(state.groupMap).forEach((index) => {
        if (state.groupMap[index] > mappedIndex) {
          state.groupMap[index] -= 1;
        }
      });
    },
    [types.SET_VALUE_ON_GROUP](state, { groupId, key, value }) {
      const mappedIndex = state.groupMap[groupId];

      state.groups[mappedIndex][key] = value;
    },
  },
  actions: {
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
    [actions.getMessagesFromGroup]({ commit, state }, { groupId, params }) {
      const index = state.groupMap[groupId];
      const group = state.groups[index];
      const payload = {
        params: {
          timestamp: bootedAt,
          page: group.messages_next_page,
          ...params,
        },
      };

      return Vue.http.get(`groups/${groupId}/messages`, payload)
          .then(response => response.json())
          .then((result) => {
            commit(types.ADD_MESSAGE_TO_GROUP, { groupId, messages: result.data });

            return result;
          })
          .catch(response => response);
    },
    [actions.onNewMessageToGroup]({ commit }, { groupId, message }) {
      const senderId = groupId === undefined
          ? message.sender.id
          : groupId;

      commit(types.ADD_MESSAGE, { groupId: senderId, messages: [message] });
    },
    [actions.sendMessageToGroup]({ commit, rootState }, { groupId, content, params = {} }) {
      const message = { id: Date.now(), content, sending: true, sender: rootState.user.user };
      commit(types.ADD_MESSAGE_TO_GROUP, { groupId, messages: [message] });

      return Vue.http.post(`groups/${groupId}/messages`, { content, ...params })
          .then(response => response.json())
          .then((result) => {
            commit(types.STATUS_GROUP_MESSAGE, {
              groupId,
              message,
              payload: result,
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
      if (message.sender_id === rootState.user.me.id) {
        commit(types.READ_GROUP_MESSAGE, { groupId, message });

        return;
      }

      Vue.http.put(`groups/messages/${message.id}/read`)
          .then(() => commit(types.READ_GROUP_MESSAGE, { groupId, message }))
          .catch(response => response);
    },

    [actions.joinGroup]({ commit }, { groupId }) {
      commit(rootTypes.SET_USER_IS_MEMBER, { groupId, isMember: true });
    },
    [actions.leaveGroup]({ commit }, { groupId }) {
      commit(types.REMOVE_GROUP, { groupId });
      commit(rootTypes.SET_VALUE_ON_GROUP, { groupId, isMember: false });
    },
    [actions.updateGroupPhoto]({ commit }, { groupId, photo }) {
      commit(types.SET_VALUE_ON_GROUP, { groupId, key: 'photo', value: photo });
      commit(rootTypes.SET_VALUE_ON_GROUP, { groupId, key: 'photo', value: photo });
    },
  },
};
