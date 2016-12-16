<template>
<nav class="navbar navbar-fixed-top navbar-dark bg-accent">
  <div class="container navbar-container fl">
    <apps-menu></apps-menu>
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
        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbar-toggler">
          <div class="dropdown-item hidden-lg-up fl-auto navbar-user-info">
            <div class="name">{{ name }}</div>
            <div class="school">{{ schoolName }}</div>
          </div>
          <a class="dropdown-item" href="#">Action</a>
          <a class="dropdown-item" href="#">Another action</a>
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

<style lang="scss">
@import '../styles/methods';

$navbar-height: 54px !default;

.bg-accent {
  background: $brand-accent;
}

body {
  padding-top: rem($navbar-height);
}

.navbar {
  line-height: 1.9; // This makes navbar height 54px with 14px base size.
}

.navbar-brand {
  text-overflow: ellipsis;
  white-space: nowrap;
}

.navbar-user {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  text-align: right;
}

.navbar-user-info {
  line-height: 1.3;

  .name {

  }

  .school {
    font-size: 0.6rem;
  }
}

.navbar-user-photo {
  margin: -1px 0 -1px .5rem;
  border-radius: 100%;
  background-color: white;
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
