<template>

<activity-box class="hub-group-preview"
              v-bind="{ title, subtitle, show: true, actions: [], disableFooter: true }"
              @close="$router.go(-1)">

    <template slot="icon">

    </template>

        <div class="container py-2">
          <div class="row">
            <div class="col-xs-12 col-lg-8 offset-lg-2 text-xs-center">
              <div class="my-2">
                 <setting-card class="settings-card" :title="setting.title" :text="setting.text" v-bind="{ index }"
                               v-for="(setting,index) in settingCards" @cardClicked="settingClicked">

                 </setting-card>
            </div>
</div>
</div>
</div>
</activity-box>

</template>

<script lang="babel">
import { ActivityBox } from '../components';
import SettingCard from './SettingsCard.vue';

export default {
  data() {
    return {
      title: 'Settings',
      settingCards: [
        {
          title: 'Departments',
          text: 'test text',
          path: 'departments',
        },
        {
          title: 'Disciplines',
          text: '',
          path: '/disciplines',
        },
        {
          title: 'Semesters',
          text: '',
          path: '/semesters',
        },
        {
          title: 'Course Management/Administrator',
          text: '',
          path: '/course-management',
        },
        {
          title: 'Institute webmail domain',
          text: '',
          path: '/webmail-domain',
        },
        {
          title: 'Institute Details',
          text: '',
          path: '/institute-details',
        },
        {
          title: 'Send invites',
          text: '',
          path: '/send-invites',
        },
      ],
    };
  },
  components: { ActivityBox, SettingCard },
  methods: {
    settingClicked(index) {
      this.$router.push({ name: this.settingCards[index].path });
    },
  },
};
</script>

<style lang="scss" scoped>
    a {
        color: inherit;
    }
</style>