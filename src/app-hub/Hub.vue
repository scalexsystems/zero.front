<template>
<div class="container hub-container">
  <div class="row hub-body">
    <div class="col-xs-2 hub-sidebar-left" ref="sidebarLeft">
      <group-list></group-list>
      <user-list></user-list>
    </div>
    <div class="col-xs-10 hub-content">
      <router-view></router-view>
    </div>
  </div>
</div>
</template>

<script lang="babel">
import scrollbar from 'perfect-scrollbar';
import * as components from './components';

export default {
  name: 'Hub',
  components: { ...components },
  beforeDestroy() {
    scrollbar.destroy(this.$refs.sidebarLeft);
  },
  mounted() {
    this.$nextTick(() => {
      scrollbar.initialize(this.$refs.sidebarLeft, {
        suppressScrollX: true,
      });
    });
  },
};
</script>


<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.hub-container {
  @include match-parent();
}

.hub-body, .hub-content {
  height: 100%;
}

.hub-sidebar-left {
  height: 100%;
  overflow-y: auto;
  overflow-x: visible;
  padding-right: 20px;
}

.hub-content {
  padding-left: 0;
}
</style>
