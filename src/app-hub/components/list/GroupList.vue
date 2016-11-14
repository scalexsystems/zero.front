<template>
<default-list title="Campus" icon="globe" type="group"
              v-bind="{ items: groups.slice(0, max) }"
              @list-action="$router.push({ name: 'hub.group-create' })"
              @list-browse="onListBrowse"
              @list-select="onListSelect"></default-list>
</template>

<script lang="babel">
import each from 'lodash/each';
import { mapActions, mapGetters } from 'vuex';

import DefaultList from './List.vue';
import { GET_GROUPS, NEW_MESSAGE_IN_GROUP } from '../../vuex/action-types';

export default {
  props: {
    max: {
      default: 5,
      type: Number,
    },
  },
  created() {
    if (!this.groups.length) {
      this.getGroups();
    }
  },
  components: { DefaultList },
  computed: {
    groupMap() {
      const groups = this.groups;
      const map = {};
      each(groups, (group, index) => {
        map[group.id] = index;
      });

      return map;
    },
    ...mapGetters({
      groups: 'hubRecentGroups',
    }),
  },
  data() {
    return {
      joined: {},
    };
  },
  methods: {
    onListSelect(group) {
      this.$router.push({
        name: 'hub.group',
        params: { group: group.id },
      });
    },
    onListBrowse() {
      this.$router.push({ name: 'hub.groups' });
    },
    joinGroupChannels() {
      each(this.groups, (group) => {
        if (this.joined[group.id] !== true) {
          this.$echo
                  .join(group.channel)
                  .listen('NewMessage', message => this.addGroupMessage({ group: group.id, message }));
          this.joined[group.id] = true;
        }
      });
    },
    ...mapActions({
      getGroups: GET_GROUPS,
      addGroupMessage: NEW_MESSAGE_IN_GROUP,
    }),
  },
  watch: {
    groups() {
      this.joinGroupChannels();
    },
  },
};
</script>

<style lang="scss">
</style>
