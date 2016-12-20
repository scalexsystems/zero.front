<template>
<nav class="navbar navbar-fixed-top navbar-dark bg-accent">
  <div class="container navbar-container fl">
    <a role="button" class="navbar-brand" tabindex @click="$root.$emit('sidebar')">
      <i class="fa fa-fw fa-bars hidden-lg-up"></i>
      <img src="../assets/logo.svg" alt="Zero" class="hidden-md-down">
    </a>
    <global-search class="fl-auto"></global-search>
    <div class="navbar-user">
      <div class="dropdown">
        <a class="user-menu-toggler text-white"
           role="button" href="#"
           data-toggle="dropdown"
           aria-haspopup="true"
           aria-expanded="false">
           <div class="fl">
             <div class="hidden-md-down fl-auto navbar-user-info">
               <div class="name">{{ name }}</div>
               <div class="school">{{ schoolName }}</div>
             </div>
            <img class="navbar-user-photo" width="28" height="28" src="../assets/person.jpg">
           </div>
        </a>
        <div class="dropdown-menu dropdown-menu-right user-menu-dropdown" aria-labelledby="navbar-toggler">
          <div class="dropdown-item hidden-lg-up fl-auto navbar-user-info">
            <div class="name">{{ name }}</div>
            <div class="school">{{ schoolName }}</div>
          </div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-item" href="#">
            <form method="POST" action="/logout">
              <input type="hidden" name="_token" :value="token">
              <input type="submit" class="user-logout-button" value="Logout">
            </form>
          </div>
        </div>
      </div>
    </div>
    <apps-menu></apps-menu>
  </div>
</nav>
</template>

<script lang="babel">
import { mapGetters } from 'vuex';
import { getters } from '../vuex/meta';

import GlobalSearch from './GlobalSearch.vue';
import AppsMenu from './AppsMenu.vue';

export default {
  computed: {
    schoolName() {
      return 'Name of the School';
    },
    name() {
      const user = this.user;

      if ('name' in user) return user.name;

      return '';
    },
    token() {
      return window.Laravel.csrfToken;
    },
    ...mapGetters({ user: getters.user }),
  },
  components: { AppsMenu, GlobalSearch },
};
</script>

<style lang="scss" scoped>
@import '../styles/variables';
@import '../styles/methods';
@import '../styles/mixins';

$navbar-height: 46px !default;

.bg-accent {
  background: $brand-accent;
}

.navbar {
  line-height: 1.9; // This makes navbar height 54px with 14px base size.
  border-top: 2px solid black;
  padding: rem(1px) 1rem rem(3px);
}

.navbar-brand {
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: rem(3px) .5rem;
  padding-right: 0;
}

@include media-breakpoint-down(md) {
  .navbar, .navbar-container {
    padding-left: 0;
    padding-right: 0;
  }
}

.navbar-user {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  text-align: right;
}

.navbar-user-info {
  line-height: 1.3;
  .name {
    font-size: rem(12px)
  }
  .school {
    font-size: rem(10px);
  }
}
.navbar-user-photo {
  margin: -1px 0 -1px .5rem;
  border-radius: 100%;
  background-color: white;
}

.user-menu-dropdown {
  margin-top: 9px;
}
.user-menu-toggler {
  &:hover, &:focus, &:active {
    text-decoration: none;
  }
}
.user-logout-button {
  border: none;
  padding: 0;
  margin: 0;
  background: transparent;
  cursor: pointer;
}
</style>

<style lang="scss">
@import '../styles/variables';

$navbar-height: 46px !default;

body {
  padding-top: $navbar-height;
}
</style>
