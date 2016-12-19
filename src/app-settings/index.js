import Settings from './Settings.vue';
import Departments from './Departments.vue';


export default function (Vue, { routes }) {
  routes.push(...[
    {
      name: 'settings',
      path: '/settings',
      component: Settings,
    },
    {
      name: 'departments',
      path: '/settings/departments',
      component: Departments,
    },
  ]);
}
