import map from 'lodash/map';
import group from 'lodash/groupBy';
import first from 'lodash/first';
import Vue from 'vue';
import { types, getters, actions } from '../meta';
import { pushIf } from '../../util';

const commitUsers = (result, commit) => {
  if ('user' in first(result.data)) {
    commit(types.ADD_USER, map(result.data, person => ({ person, ...person.user })));
  }
};

export default {
  state: {
    employees: [],
    employeeMap: {},
    groups: [],
    groupMap: {},
    students: [],
    studentMap: {},
    teachers: [],
    teacherMap: {},
    users: [],
    userMap: {},
    departments: [],
    disciplines: [],
  },
  getters: {
    [getters.employees](state) {
      return state.employees;
    },
    [getters.groups](state) {
      return state.groups;
    },
    [getters.groupMap](state) {
      return state.groupMap;
    },
    [getters.students](state) {
      return state.students;
    },
    [getters.teachers](state) {
      return state.teachers;
    },
    [getters.users](state) {
      return state.users;
    },
  },
  mutations: {
    [types.ADD_USER](state, users) {
      pushIf(state.users, users, state.userMap);
    },
    [types.ADD_STUDENT](state, students) {
      pushIf(state.students, students, state.studentMap);
    },
    [types.ADD_TEACHER](state, teachers) {
      pushIf(state.teachers, teachers, state.teacherMap);
    },
    [types.ADD_EMPLOYEE](state, employees) {
      pushIf(state.employees, employees, state.employeeMap);
    },
    [types.ADD_GROUP](state, groups) {
      pushIf(state.groups, groups, state.groupMap);
    },
    [types.SET_USER_IS_MEMBER](state, { groupId, isMember }) {
      const mappedIndex = state.groupMap[groupId];
      state.groups[mappedIndex].is_member = isMember;
    },
  },
  actions: {
    [actions.getStudents]({ commit }, params = {}) {
      return Vue.http.get('people/students', { params })
          .then(response => response.json())
          .then((result) => {
            commit(types.ADD_STUDENT, result.data);
            commitUsers(result, commit);

            return result;
          })
          .catch(response => response);
    },
    [actions.getEmployees]({ commit }, params = {}) {
      return Vue.http.get('people/employees', { params })
          .then(response => response.json())
          .then((result) => {
            commit(types.ADD_EMPLOYEE, result.data);
            commitUsers(result, commit);

            return result;
          })
          .catch(response => response);
    },
    [actions.getTeachers]({ commit }, params = {}) {
      return Vue.http.get('people/teachers', { params })
          .then(response => response.json())
          .then((result) => {
            commit(types.ADD_TEACHER, result.data);
            commitUsers(result, commit);

            return result;
          })
          .catch(response => response);
    },
    [actions.getGroups]({ commit }, params = {}) {
      return Vue.http.get('groups', { params })
          .then(response => response.json())
          .then((result) => {
            commit(types.ADD_GROUP, result.data);

            return result;
          })
          .catch(response => response);
    },
    [actions.getUsers]({ commit }, params = {}) {
      return Vue.http.get('people', { params })
          .then(response => response.json())
          .then((result) => {
            const groups = group(result.data, 'person_type');

            commit(types.ADD_USER, result.data);

            if ('student' in groups) commit(types.ADD_STUDENT, groups.student);
            if ('employee' in groups) commit(types.ADD_EMPLOYEE, groups.employee);
            if ('teacher' in groups) commit(types.ADD_TEACHER, groups.teacher);

            return result;
          })
          .catch(response => response);
    },
  },
};
