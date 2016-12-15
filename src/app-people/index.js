import Dashboard from './Dashboard.vue';
import StudentSearch from './StudentSearch.vue';

export default function (Vue, { routes }) {
  routes.push(...[
    {
      name: 'people',
      path: '/people',
      component: Dashboard,
    },
    {
      name: 'student',
      path: '/people/students',
      component: StudentSearch,
    },
  ]);
}
