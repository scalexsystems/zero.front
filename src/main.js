import Vue from 'vue';
import VueResource from 'vue-resource';

import App from './App.vue';

/**
 * We'll load jQuery and the Bootstrap jQuery plugin which provides support
 * for JavaScript based Bootstrap features such as modals and tabs. This
 * code may be modified to fit the specific needs of your application.
 */

window.$ = window.jQuery = require('jquery');
window.Tether = require('tether');
require('bootstrap');

Vue.use(VueResource);

Vue.http.options.root = '/api';
Vue.http.headers.common.Authorization = `Bearer ${window.Laravel.csrfToken}`;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
});
