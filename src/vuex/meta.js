export const types = {
  ADD_USER: 'school/ADD_USER',
  ADD_EMPLOYEE: 'school/ADD_EMPLOYEE',
  ADD_STUDENT: 'school/ADD_STUDENT',
  ADD_TEACHER: 'school/ADD_TEACHER',
  ADD_GROUP: 'school/ADD_GROUP',
  SET_USER_IS_MEMBER: 'school/SET_USER_IS_MEMBER',
  SET_VALUE_ON_GROUP: 'school/SET_VALUE_ON_GROUP',
  SET_DISCIPLINES: 'school/SET_DISCIPLINES',
  SET_DEPARTMENTS: 'school/SET_DEPARTMENTS',
  ADD_DEPARTMENT: 'school/ADD_DEPARTMENT',
  ADD_DISCIPLINE: 'school/ADD_DISCIPLINE',

  SET_USER: 'me/SET_USER',
};

export const actions = {
  getGroups: 'school/getGroups',
  getUsers: 'school/getUsers',
  getStudents: 'school/getStudents',
  getTeachers: 'school/getTeachers',
  getEmployees: 'school/getEmployees',
  getDepartments: 'school/getDepartments',
  getDisciplines: 'school/getDisciplines',
  findStudent: 'school/findStudent',
  addDepartment: 'school/AddDepartment',
  addDiscipline: 'school/AddDiscipline',
  getUser: 'me/getUser',
};

export const getters = {
  groups: 'school/groups',
  groupMap: 'school/groupMap',
  users: 'school/users',
  employees: 'school/employees',
  students: 'school/students',
  teachers: 'school/teachers',
  departments: 'school/departments',
  disciplines: 'school/disciplines',
  departmentsByType: 'school/departmentsByType',
  user: 'me/user',
};
