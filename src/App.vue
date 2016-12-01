<template>
<div class="app">
  <nav-bar></nav-bar>
  <router-view></router-view>
</div>
</template>

<script lang="babel">
import { mapActions, mapGetters } from 'vuex';

import NavBar from './components/Navbar.vue';
import { getters, actions } from './vuex/meta';

export default {
  name: 'App',
  components: { NavBar },
  computed: { ...mapGetters({ user: getters.user }) },
  methods: { ...mapActions({ getUser: actions.getUser }) },
  created() {
    if (!('id' in this.user)) {
      this.getUser();
    } else {
      this.$echo.private(this.user.channel);
    }
  },
  watch: {
    user() {
      this.$echo.private(this.user.channel);
    },
  },
};
</script>

<style lang="scss">
@import 'app';

body {
  background: $gray-lighter;
}
</style>
