import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import app from './modules/app';
import school from './modules/school';
import user from './modules/user';

require('es6-promise/auto');

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { app, school, user },
  plugins: process.env.NODE_ENV !== 'production' ? [createLogger()] : [],
  strict: process.env.NODE_ENV !== 'production',
});
