import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import school from './modules/school';
import user from './modules/user';

require('es6-promise/auto');

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { app, school, user },
});
