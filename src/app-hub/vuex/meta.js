export const types = {
  ADD_GROUP: 'hub/ADD_GROUP',
  ADD_MESSAGE_TO_GROUP: 'hub/ADD_MESSAGE_TO_GROUP',
  SET_MESSAGE_PAGE_TO_GROUP: 'hub/SET_MESSAGE_PAGE_TO_GROUP',
  STATUS_GROUP_MESSAGE: 'hub/STATUS_GROUP_MESSAGE',
  READ_GROUP_MESSAGE: 'hub/READ_GROUP_MESSAGE',
  REMOVE_GROUP: 'hub/REMOVE_GROUP',

  ADD_USER: 'hub/ADD_USER',
  ADD_MESSAGE: 'hub/ADD_MESSAGE',
  SET_MESSAGE_PAGE_TO_USER: 'hub/SET_MESSAGE_PAGE_TO_GROUP',
  STATUS_MESSAGE: 'hub/STATUS_MESSAGE',
  READ_MESSAGE: 'hub/READ_MESSAGE',
  SET_VALUE_ON_GROUP: 'hub/SET_VALUE_ON_GROUP',
};

export const actions = {
  // Groups.
  getGroups: 'hub/getUsers',
  getMessagesFromGroup: 'hub/getMessagesFromGroup',
  sendMessageToGroup: 'hub/sendMessageToGroup',
  sendMessageReadReceiptForGroup: 'hub/sendMessageReadReceiptForGroup',
  onNewMessageToGroup: 'hub/onNewMessageToGroup',
  // Users.
  getMessagedUsers: 'hub/getMessagedUsers',
  getMessagesFromUser: 'hub/getMessagesFromUser',
  sendMessageToUser: 'hub/sendMessageToUser',
  sendMessageReadReceipt: 'hub/sendMessageReadReceipt',
  onNewMessageToUser: 'hub/onNewMessageToUser',
  joinGroup: 'hub/joinGroup',
  leaveGroup: 'hub/leaveGroup',
  updateGroupPhoto: 'hub/UpdateGroupPhoto',
};

export const getters = {
  groups: 'hub/groups',
  groupMap: 'hub/groupMap',

  users: 'hub/users',
  userMap: 'hub/userMap',
};
