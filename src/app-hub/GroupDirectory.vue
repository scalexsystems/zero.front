<template>
<directory title="Campus Groups"
           subtitle="You can join any of these groups."
           v-bind="{ items: groups }"
           @close="onClose"
           @search="onSearch"
           @load-more="onInfinite"
           @item="onGroupSelected">
</directory>
</template>

<script lang="babel">
import throttle from 'lodash/throttle';
import { mapActions, mapGetters } from 'vuex';

import Directory from '../components/Directory.vue';

export default {
  name: 'GroupDirectory',
  components: { Directory },
  computed: {
    ...mapGetters(['groups']),
  },
  data() {
    return { q: '', page: 0 };
  },
  methods: {
    onClose() {
      window.history.back();
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
              .then((response) => {
                if ('ok' in response) throw response;

                return response;
              })
              .then((result) => {
                this.page = result._meta.pagination.current_page;

                return result.data.length ? done() : end();
              })
              .catch(() => error());
    },
    ...mapActions(['getGroups']),
  },
};
</script>

<style lang="scss">
</style>
