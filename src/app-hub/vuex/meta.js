export const types = {
  ADD_GROUP: 'hub/ADD_GROUP',
  ADD_MESSAGE_TO_GROUP: 'hub/ADD_MESSAGE_TO_GROUP',
  SET_MESSAGE_PAGE_TO_GROUP: 'hub/SET_MESSAGE_PAGE_TO_GROUP',
  STATUS_GROUP_MESSAGE: 'hub/STATUS_GROUP_MESSAGE',
  READ_GROUP_MESSAGE: 'hub/READ_GROUP_MESSAGE',

  ADD_USER: 'hub/ADD_USER',
  ADD_MESSAGE: 'hub/ADD_MESSAGE',
  SET_MESSAGE_PAGE_TO_USER: 'hub/SET_MESSAGE_PAGE_TO_GROUP',
  STATUS_MESSAGE: 'hub/STATUS_MESSAGE',
  READ_MESSAGE: 'hub/READ_MESSAGE',
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
  onJoinGroup: 'hub/onJoinGroup',
};

export const getters = {
  groups: 'hub/groups',
  groupMap: 'hub/groupMap',

  users: 'hub/users',
  userMap: 'hub/userMap',
};
