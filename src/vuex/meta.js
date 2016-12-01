export const types = {
  ADD_USER: 'school/ADD_USER',
  ADD_EMPLOYEE: 'school/ADD_EMPLOYEE',
  ADD_STUDENT: 'school/ADD_STUDENT',
  ADD_TEACHER: 'school/ADD_TEACHER',
  ADD_GROUP: 'school/ADD_GROUP',

  SET_USER: 'me/SET_USER',
};

export const actions = {
  getGroups: 'school/getGroups',
  getUsers: 'school/getUsers',
  getStudents: 'school/getStudents',
  getTeachers: 'school/getTeachers',
  getEmployees: 'school/getEmployees',
  getUser: 'me/getUser',
};

export const getters = {
  groups: 'school/groups',
  groupMap: 'school/groupMap',
  users: 'school/users',
  employees: 'school/employees',
  students: 'school/students',
  teachers: 'school/teachers',

  user: 'me/user',
};
