<template>
<default-list title="Users" icon="globe" type="user" class="hub-user-list"
              v-bind="{ items: users.slice(0, max) }"
              @list-browse="onListBrowse"
              @list-select="onListSelect"></default-list>
</template>

<script lang="babel">
import each from 'lodash/each';
import { mapActions, mapGetters } from 'vuex';

import DefaultList from './List.vue';
import { GET_USERS } from '../../vuex/action-types';

export default {
  props: {
    max: {
      default: 5,
    },
  },
  created() {
    if (!this.users.length) {
      this.getUsers();
    }
  },
  components: { DefaultList },
  computed: {
    userMap() {
      const users = this.users;
      const map = {};
      each(users, (user, index) => {
        map[user.id] = index;
      });

      return map;
    },
    ...mapGetters({
      users: 'hubRecentUsers',
    }),
  },
  methods: {
    onListBrowse() {
      this.$router.push({ name: 'hub.users' });
    },
    onListSelect(user) {
      this.$router.push({
        name: 'hub.user',
        params: { user: user.id },
      });
    },
    joinUserChannel() {},
    ...mapActions({
      getUsers: GET_USERS,
    }),
  },
};
</script>

<style lang="scss">
.hub-user-list {
  .hub-list-action {
    display: none;
  }
}
</style>
