<template>
<nav class="navbar navbar-fixed-top navbar-dark bg-primary">
  <div class="container navbar-container">
    <div class="dropdown">
      <button class="navbar-toggler"
              data-toggle="dropdown"
              type="button" id="navbar-toggler"
              aria-haspopup="true"
              aria-expanded="false"><i class="fa fa-fw fa-bars"></i></button>
      <div class="dropdown-menu" aria-labelledby="navbar-toggler">
        <a class="dropdown-item" href="#">Action</a>
        <a class="dropdown-item" href="#">Another action</a>
        <a class="dropdown-item" href="#">Something else here</a>
      </div>
    </div>
    <div class="navbar-brand">{{ title }}</div>
    <div class="navbar-user">
      <div class="dropdown">
        <a class="user-menu-toggler text-white"
           role="button" href="#"
           data-toggle="dropdown"
           aria-haspopup="true"
           aria-expanded="false">
          <span class="hidden-sm-down">{{ name }}</span>
          <img class="navbar-user-photo" width="28" height="28" src="../assets/person.jpg">
        </a>
        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbar-toggler">
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

export default {
  computed: {
    title() {
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
};
</script>

<style lang="scss">
@import '../styles/methods';

$navbar-height: 54px !default;

body {
  padding-top: rem($navbar-height);
}

.navbar {
  line-height: 1.9; // This makes navbar height 54px with 14px base size.
}

.navbar-toggler {
  padding: .75rem; // This adjusts toggler in middle of line.
}

.navbar-toggler {
  color: inherit;
  user-select: none;
  &:focus {
    outline: none;
  }
}

.navbar-dark .navbar-toggler {
  background-image: none;
  border-color: transparent;
}

.navbar-container {
  display: flex;
  flex-direction: row;
}

.navbar-brand {
  flex: 0 1 auto;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.navbar-user {
  flex: 1 1 auto;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  text-align: right;
}

.navbar-user-photo {
  margin: -1px 0 -1px .5rem;
  border-radius: 100%;
  border: solid 0.0714rem white;
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
