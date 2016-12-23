import Settings from './Settings.vue';
import Departments from './Departments.vue';
import Disciplines from './Disciplines.vue';
import CourseManagement from './CourseManagement.vue';
import InstituteDetails from './InstituteDetails.vue';


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
    {
      name: 'disciplines',
      path: '/settings/disciplines',
      component: Disciplines,
    },
    {
      name: 'course-management',
      path: '/settings/course-management',
      component: CourseManagement,
    },
    {
      name: 'institute-details',
      path: '/settings/institute-details',
      component: InstituteDetails,
    },
  ]);
}
