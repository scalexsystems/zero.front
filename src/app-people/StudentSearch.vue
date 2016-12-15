<template>
  <window-box title="Students" subtitle="Search students">
    <div slot="header">
      <a href="#" class="btn btn-secondary" @click.prevent="$router.go(-1)">
        <i class="fa fa-fw fa-arrow-left"></i> Back
      </a>
    </div>

    <div class="student-search-container">
        <div class="container">
            <h3 class="text-xs-center">Students</h3>
            <div class="row">
                <div class="col-xs-12 col-md-6 offset-md-3 m-t-1">
                    <input-search v-model="query" v-bind="{ suggestions }" @suggest="onSearchInput"></input-search>
                </div>
            </div>
            <p class="text-xs-center">
                Find students by their roll number or name.
            </p>
        </div>
    </div>

  </window-box>
</template>

<script lang="babel">
import { mapGetters, mapActions } from 'vuex';
import throttle from 'lodash/throttle';

import { getters, actions } from '../vuex/meta';
import { WindowBox } from '../components';

export default {
  name: 'StudentSearch',
  components: { WindowBox },
  computed: {
    ...mapGetters({ suggestions: getters.students }),
  },
  data() {
    return {
      query: '',
    };
  },
  methods: {
    onSearchInput: throttle(function onSearchInput({ start, end, value }) {
      start();
      this.getStudents({ q: value }).then(() => end());
    }),
    ...mapActions({ getStudents: actions.getStudents }),
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/variables';
@import '../styles/mixins';

.student-search-container {
  background-size: cover;
  padding-top: 8rem;
  padding-bottom: 11rem;
  margin-bottom: -5rem;
  color: white;

  h3 {
      text-transform: uppercase;
      letter-spacing: rem(2px);
  }

  background-image: linear-gradient(to right, rgba(0, 0, 0, .35), rgba(0, 0, 0, .35)), url(./assets/student-search-m-cover.jpg);

  @include media-breakpoint-up(md) {
      background-image: linear-gradient(to right, rgba(0, 0, 0, .35), rgba(0, 0, 0, .35)), url(./assets/student-search-cover.jpg);
  }
}

</style>
