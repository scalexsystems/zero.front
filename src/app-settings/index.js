import Settings from './Settings.vue';
import Departments from './Departments.vue';
import Disciplines from './Disciplines.vue';
import Semesters from './Semesters.vue';
import CourseManagement from './CourseManagement.vue';
import InstituteDetails from './InstituteDetails.vue';
import Invite from './Invite.vue';
import AdminSettings from './AdminSettings.vue';


export default function (Vue, { routes }) {
  routes.push(...[
    {
      path: '/settings',
      component: AdminSettings,
      children: [
        {
          name: 'settings',
          path: '/',
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
          name: 'semesters',
          path: '/settings/semesters',
          component: Semesters,
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
        {
          name: 'send-invites',
          path: '/settings/send-invites',
          component: Invite,
        },

      ] }]);
}
