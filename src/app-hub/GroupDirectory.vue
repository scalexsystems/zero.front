<template>
<directory title="Campus Groups"
           subtitle="You can join any of these groups."
           v-bind="{ items: groups, enableTopbar: true }"
           @close="onClose"
           @search="onSearch"
           @load-more="onInfinite"
           @item="onGroupSelected">
  <template slot="actions">
  <router-link :to="{ name: 'hub.group-create' }" class="btn btn-secondary">
    <i class="fa fa-plus fa-fw"></i> Create New Group</router-link>
  </template>
</directory>
</template>

<script lang="babel">
import throttle from 'lodash/throttle';
import { mapActions, mapGetters } from 'vuex';

import { httpThen } from '../util';
import { getters, actions } from '../vuex/meta';
import Directory from '../components/Directory.vue';

export default {
  name: 'GroupDirectory',
  components: { Directory },
  computed: {
    ...mapGetters({
      groups: getters.groups,
    }),
  },
  data() {
    return { q: '', page: 0 };
  },
  methods: {
    onClose() {
      this.$router.go(-1);
    },
    onGroupSelected(group) {
      const name = group.is_member === true ? 'hub.group' : 'hub.group-preview';

      this.$router.push({ name, params: { group: group.id } });
    },
    onSearch: throttle(function onSearch(query) {
      this.q = query;
      this.page = 1;
      this.getGroups({ q: query });
    }, 500),
    onInfinite({ done, end, error }) {
      this.getGroups({ q: this.q, page: this.page + 1 })
              .then(httpThen)
              .then((result) => {
                this.page = result._meta.pagination.current_page;

                return result.data.length ? done() : end();
              })
              .catch(() => error());
    },
    ...mapActions({
      getGroups: actions.getGroups,
    }),
  },
};
</script>

<style lang="scss">
</style>
