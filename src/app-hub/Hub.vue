<template>
<div class="container hub-container">
  <div class="row hub-body">
    <div class="col-xs-12 col-lg-2 hub-sidebar-left" ref="sidebarLeft">
      <div class="btn-group my-1">
        <a class="btn btn-outline-secondary" :class="{active: !browseUsers}" href="#" @click.stop.prevent="browseUsers = false">Groups</a>
        <a class="btn btn-outline-secondary" :class="{active: browseUsers}" href="#" @click.stop.prevent="browseUsers = true">Private</a>
      </div>

      <group-list v-show="!browseUsers"></group-list>
      <user-list v-show="browseUsers"></user-list>
    </div>
    <div class="col-xs-12 col-lg-10 hub-content">
      <router-view></router-view>
    </div>
  </div>
</div>
</template>

<script lang="babel">
import scrollbar from 'perfect-scrollbar';
import { mapActions, mapGetters } from 'vuex';

import * as components from './components';
import { actions } from './vuex/meta';
import { getters as rootGetters } from '../vuex/meta';

export default {
  name: 'Hub',
  components: { ...components },
  beforeDestroy() {
    scrollbar.destroy(this.$refs.sidebarLeft);
  },
  computed: { ...mapGetters({ user: rootGetters.user }) },
  data() {
    return {
      browseUsers: false,
    };
  },
  methods: { ...mapActions({ onMessage: actions.onNewMessageToUser }) },
  mounted() {
    this.$nextTick(() => {
      scrollbar.initialize(this.$refs.sidebarLeft, {
        suppressScrollX: true,
      });
    });
  },
  created() {
    this.$echo
            .private(this.user.channel)
            .listen('NewMessage', message => this.onMessage({ message }));
  },
};
</script>


<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.hub-container {
  @include match-parent();

  .btn-outline-secondary.active {
    background: white;
    color: inherit;
    border-color: $btn-secondary-border;
  }
}

.hub-body, .hub-content {
  height: 100%;
}

.hub-content {
  @include media-breakpoint-down(sm) {
    padding-left: 0;
    padding-right: 0;
  }
}

.hub-sidebar-left {
  height: 100%;
  overflow-y: auto;
  overflow-x: visible;

  @include media-breakpoint-up(lg) {
    margin-right: -15px;
    margin-left: 15/2px;
  }
}
</style>
