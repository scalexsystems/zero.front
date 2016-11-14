<template>
<div class="app">
  <nav-bar></nav-bar>
  <router-view></router-view>
</div>
</template>

<script>
import NavBar from './components/Navbar.vue';

export default {
  name: 'App',
  components: { NavBar },
};
</script>

<style lang="scss">
@import 'app';

body {
  background: $gray-lighter;
}
</style>
