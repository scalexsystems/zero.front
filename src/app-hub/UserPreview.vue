<template>
<activity-box v-if="user"
              v-bind="{ title, subtitle, show: true, actions: [], disableFooter: true }"
              @close="close">

  <div class="container py-2">
    <div class="text-xs-center">
      <img class="user-preview-photo my-2" :src="user.photo">

      <h2>{{ user.name }}</h2>
      <p>
        <span class="text-muted" v-if="user.person._type === 'student'">Roll Number:</span>
        <span class="text-muted" v-else>Employee ID:</span> {{ user.person.uid }}
      </p>
      <p v-if="user.person._type === 'student'">
        Student &centerdot; {{ department(user.person.department_id) }}
      </p>
      <p v-if="user.person._type === 'teacher'">
        {{ user.person.designation || 'Teacher' }} &centerdot; {{ department(user.person.department_id) }}
      </p>
      <p v-if="user.person._type === 'employee'">
        {{ user.person.designation || 'Employee' }} &centerdot; {{ department(user.person.department_id) }}
      </p>

      <div class="my-2">
        <router-link :to="{name: 'hub.user', params: { user: user.id } }"
                     class="btn btn-primary">Send Message
        </router-link>
      </div>
    </div>
  </div>
</activity-box>
<loading-placeholder v-else></loading-placeholder>
</template>

<script lang="babel">
import Vue from 'vue';
import first from 'lodash/first';
import { mapGetters, mapActions } from 'vuex';

import { LoadingPlaceholder, ActivityBox } from '../components';
import { getters, actions } from '../vuex/meta';

export default {
  name: 'userPreview',
  beforeRouteEnter(to, from, next) {
    Vue.http.get(`people/${to.params.user}`)
            .then(response => response.json())
            .then((result) => {
              next((vm) => {
                Vue.set(vm, 'user', result);
              });
            })
            .catch(() => {
              // TODO: Redirect to 404!
            });
  },
  components: { LoadingPlaceholder, ActivityBox },
  computed: {
    title() {
      const user = this.user || {};

      return user.name;
    },
    subtitle() {
      const user = this.user || {};

      return user.bio || 'User Profile';
    },
    ...mapGetters({ departments: getters.departments }),
  },
  data() {
    return {
      user: null,
    };
  },
  created() {
    if (!this.departments.length) {
      this.getDepartments();
    }
  },
  methods: {
    close() {
      window.history.back();
    },
    department(value) {
      return (first(this.departments.filter(d => d.id === value)) || {}).name;
    },
    ...mapActions({ getDepartments: actions.getDepartments }),
  },
};
</script>

<style lang="scss">
@import "../styles/variables";
@import "../styles/methods";

.user-preview {
  &-photo {
    width: rem(160px);
    height: rem(160px);
    border-radius: $border-radius-sm;
  }
  &-tag {
    padding: $spacer / 2;
  }
}
</style>
