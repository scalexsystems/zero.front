<template>

<activity-box class="hub-group-preview"
              v-bind="{ title, subtitle, show: true, actions: [], disableFooter: true }"
              @close="$router.go(-1)">

    <template slot="icon">
    
    </template>

        <div class="container py-2">
          <div class="row">
            <div class="col-xs-12 col-lg-8 offset-lg-2">
              <div class="row my-2">
                 <div class="col-xs-12 col-lg-6 settings-items" v-for="(setting,index) in settingCards">
                  <setting-card class="settings-card" :title="setting.title" :text="setting.text" v-bind="{ index }"
                               @cardClicked="settingClicked">


                 </setting-card>
            </div>
            </div>
    </div>
    </div>
</div>
</activity-box>

</template>

<script lang="babel">
import { mapGetters, mapActions } from 'vuex';
import { getters, actions } from '../vuex/meta';
import { ActivityBox } from '../components';
import SettingCard from './SettingsCard.vue';


export default {
  created() {
    if (this.departments.length === 0) {
      this.getDepartments()
        .then(() => {
          this.departmentCount = this.departments.length;
        });
    }
  },
  data() {
    return {
      title: 'Settings',
      settingCards: [
        {
          title: 'Departments',
          text: this.departmentCount,
          path: 'departments',
        },
        {
          title: 'Disciplines',
          text: 'Add discipline here',
          path: 'disciplines',
        },
        {
          title: 'Semesters',
          text: 'Click to add semesters',
          path: '/semesters',
        },
        {
          title: 'Course Management/Administrator',
          text: 'Click here to assign',
          path: 'course-management',
        },
        {
          title: 'Institute webmail domain',
          text: '',
          path: '/webmail-domain',
        },
        {
          title: 'Institute Details',
          text: 'Enter institute details',
          path: 'institute-details',
        },
        {
          title: 'Send invites',
          text: 'Invite students and teachers',
          path: 'send-invites',
        },
      ],
      departmentCount: 0,
    };
  },
  components: { ActivityBox, SettingCard },
  computed: {
    ...mapGetters({
      departments: getters.departments,
    }),
  },
  methods: {
    settingClicked(index) {
      this.$router.push({ name: this.settingCards[index].path });
    },
    ...mapActions({
      getDepartments: actions.getDepartments,
    }),
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/methods';

    a {
        color: inherit;
    }

    .settings-items {
       text-align: left;
       height: rem(70px);
       margin: rem(10px) 0;
    }

</style>