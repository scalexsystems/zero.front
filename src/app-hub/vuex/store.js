import group from './group';
import user from './user';

export default {
  state: {
    ...group.state,
    ...user.state,
  },
  getters: {
    ...group.getters,
    ...user.getters,
  },
  mutations: {
    ...group.mutations,
    ...user.mutations,
  },
  actions: {
    ...group.actions,
    ...user.actions,
  },
};
