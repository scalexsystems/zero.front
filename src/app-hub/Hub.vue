<template>
<div class="container hub-container">
  <div class="row hub-body">
    <div class="col-xs-12 col-lg-2 hub-sidebar-left" ref="sidebarLeft" @click="closeSidebar">
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
  methods: {
    closeSidebar() {
      this.$el.classList.remove('open-sidebar');
    },
    openSidebar() {
      this.$el.classList.add('open-sidebar');
    },
    toggleSidebar() {
      if (this.$el.classList.contains('open-sidebar')) {
        this.closeSidebar();
      } else {
        this.openSidebar();
      }
    },
    ...mapActions({ onMessage: actions.onNewMessageToUser }),
  },
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
    this.$root.$on('sidebar', () => this.toggleSidebar());
  },
};
</script>


<style lang="scss" scoped>
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

@include media-breakpoint-down(md) {
  .hub-container {
    .hub-sidebar-left {
      z-index: $zindex-navbar;
      position: fixed;
      width: 70%;
      left: -70%;
      transition: left .3s;
    }
    .hub-content {
      transition: transform .3s;
    }

    &.open-sidebar {
      .sidebar-toggler {
        right: 0;
      }
      .hub-sidebar-left {
        left: 0;
      }
      .hub-content {
        transform: translateX(70%);
      }
    }
  }
}
</style>
