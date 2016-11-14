<template>
<activity-box v-if="user"
              v-bind="{ title, subtitle, show: true, actions: [], disableFooter: true }"
              @close="close">

  <div class="container py-2">
    <div class="text-xs-center">
      <img class="user-preview-photo my-2" :src="user.photo">

      <h2>{{ user.name }}</h2>
      <p>
        <small class="text-muted">{{ user.bio }}</small>
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

import { LoadingPlaceholder, ActivityBox } from '../components';

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
      const user = this.user;

      return user ? user.name : '';
    },
    subtitle() {
      const user = this.user;

      return user ? user.bio : '';
    },
  },
  data() {
    return {
      user: null,
    };
  },
  methods: {
    close() {
      window.history.back();
    },
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
