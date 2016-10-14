<template>
<div class="app">
  <nav-bar></nav-bar>
  <div class="container">
    <div class="row">
      <div class="col-md-3"></div>
      <div class="col-md-9">
        <message-box type="user" title="Testing a Title" subtitle="Testing a Subtitle"></message-box>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import NavBar from './components/Navbar.vue';
import MessageBox from './components/MessageBox.vue';

export default {
  components: {
    NavBar,
    MessageBox,
  },
};
</script>

<style lang="scss">
@import 'app';
body {
  background: $gray-lighter;
}
</style>
