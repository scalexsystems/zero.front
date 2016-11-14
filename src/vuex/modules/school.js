import each from 'lodash/each';
import map from 'lodash/map';
import first from 'lodash/first';
import Vue from 'vue';
import { ADD_USER, ADD_STUDENT, ADD_TEACHER, ADD_EMPLOYEE, ADD_GROUP } from '../mutation-types';
import { pushIf } from '../../util';

const commitUsers = (result, commit) => {
  if ('user' in first(result.data)) {
    commit(ADD_USER, map(result.data, person => ({ person, ...person.user })));
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
    employees(state) {
      return state.employees;
    },
    groups(state) {
      return state.groups;
    },
    students(state) {
      return state.students;
    },
    teachers(state) {
      return state.teachers;
    },
    users(state) {
      return state.users;
    },
  },
  mutations: {
    [ADD_USER](state, users) {
      pushIf(state.users, users, state.userMap);
    },
    [ADD_STUDENT](state, students) {
      pushIf(state.students, students, state.studentMap);
    },
    [ADD_TEACHER](state, teachers) {
      pushIf(state.teachers, teachers, state.teacherMap);
    },
    [ADD_EMPLOYEE](state, employees) {
      pushIf(state.employees, employees, state.employeeMap);
    },
    [ADD_GROUP](state, groups) {
      pushIf(state.groups, groups, state.groupMap);
    },
  },
  actions: {
    getStudents({ commit }, params = {}) {
      return Vue.http.get('people/students', { params })
          .then(response => response.json())
          .then((result) => {
            commit(ADD_STUDENT, result.data);
            commitUsers(result, commit);

            return result;
          })
          .catch(response => response);
    },
    getEmployees({ commit }, params = {}) {
      return Vue.http.get('people/employees', { params })
          .then(response => response.json())
          .then((result) => {
            commit(ADD_EMPLOYEE, result.data);
            commitUsers(result, commit);
            return result;
          })
          .catch(response => response);// FIXME: Unhandled exception.
    },
    getTeachers({ commit }, params = {}) {
      return Vue.http.get('people/teachers', { params })
          .then(response => response.json())
          .then((result) => {
            commit(ADD_TEACHER, result.data);
            commitUsers(result, commit);

            return result;
          })
          .catch(response => response);
    },
    getGroups({ commit }, params = {}) {
      return Vue.http.get('groups', { params })
          .then(response => response.json())
          .then((result) => {
            commit(ADD_GROUP, result.data);

            return result;
          })
          .catch(response => response);
    },
    getPeople({ commit }, params = {}) {
      return Vue.http.get('people', { params })
          .then(response => response.json())
          .then((result) => {
            const employees = [];
            const students = [];
            const teachers = [];

            each(result.data, (user) => {
              switch (user.person_type) {
                case 'student':
                  students.push(user.person);
                  break;
                case 'teacher':
                  teachers.push(user.person);
                  break;
                case 'employee':
                  employees.push(user.person);
                  break;
                default:
                  break;
              }
            });

            commit(ADD_USER, result.data);
            commit(ADD_STUDENT, students);
            commit(ADD_EMPLOYEE, employees);
            commit(ADD_TEACHER, teachers);

            return result;
          })
          .catch(response => response);
    },
  },
};
