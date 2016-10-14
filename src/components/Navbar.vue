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
      {{ name }} <img class="navbar-user-photo" width="28" height="28" src="../assets/person.jpg">
    </div>
  </div>
</nav>
</template>

<script>
export default {
  data() {
    return { title: 'Zero | School Name Here', name: 'User Name Here' };
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

.navbar-container {
  display: flex;
  flex-direction: row;
}

.navbar-brand {
  flex: 1;
}

.navbar-user {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.navbar-user-photo {
  margin: -1px 0 -1px .5rem;
  border-radius: 100%;
  border: solid 0.0714rem white;
}
</style>
