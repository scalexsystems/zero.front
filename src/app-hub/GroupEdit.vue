<template>
<activity-box v-if="group"
              v-bind="{ title, subtitle, show: true, actions: [], disableFooter: true }"
              @close="$router.go(-1)">
  <template slot="actions">
  <a class="btn btn-primary" href="#" @click.prevent.stop="createGroup" ref="action">
    Create Group
  </a>
  </template>

  <div class="container py-1">
    <div class="my-2 text-xs-center">
    </div>
    <div class="row">
      <div class="col-xs-12 col-lg-8 offset-lg-2">
        <input-text title="Name of the group" required v-model="group.name" :feedback="errors.name"></input-text>
      </div>
      <div class="col-xs-6 col-lg-8 offset-lg-2">
        <input-radio title="Group Type" required v-model="group.type" :options="groupTypes"
                     :feedback="errors.type"></input-radio>
      </div>
      <div class="col-xs-6 col-lg-8 offset-lg-2">
        <input-textarea title="Description" v-model="group.description" :feedback="errors.description"></input-textarea>
      </div>
      <div class="col-xs-6 col-lg-8 offset-lg-2">
        <input-search title="Members" v-model="query" v-bind="{suggestions}" @suggest="onSuggest"
                      @select="onSelect"></input-search>

        <div class="row">
          <div class="col-xs-12 col-lg-6" v-for="(member, key) in members" :key="key">
            <person-card :item="member">
              <a slot="actions" class="text-muted" href="#" v-tooltip="Remove"
                 @click.stop.prevent="removeMember(member)"
              ><i class="fa fa-fw fa-trash-o"></i></a>
            </person-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</activity-box>
<loading-placeholder v-else></loading-placeholder>
</template>

<script lang="babel">
import int from 'lodash/toInteger';
import { mapGetters, mapActions } from 'vuex';
import throttle from 'lodash/throttle';
import InfiniteScroll from 'vue-infinite-loading';

import { pushIf } from '../util';
import { getters as rootGetters, actions as rootActions } from '../vuex/meta';
import { LoadingPlaceholder, ActivityBox, PersonCard as ItemCard } from '../components';

export default {
  name: 'GroupEdit',
  components: { LoadingPlaceholder, ActivityBox, ItemCard, InfiniteScroll },
  computed: {
    title() {
      const group = this.group;

      return group ? group.name : '';
    },
    subtitle() {
      const group = this.group;

      return group ? group.bio : '';
    },
    groupTypes() {
      return {
        public: 'Public',
        private: 'Private',
      };
    },
    original() {
      const route = this.$route;
      const groupMap = this.groupMap;
      const groups = this.groups;

      const id = int(route.params.group);
      const index = groupMap[id];
      const group = groups[index];

      return group;
    },
    ...mapGetters({ groups: rootGetters.groups, groupMap: rootGetters.groupMap }),
  },
  created() {
    this.findGroup();
  },
  data() {
    return {
      group: null,
      errors: {},
      ids: {},
      members: [],
      q: '',
      page: 0,
    };
  },
  methods: {
    search: throttle(function search() {
      this.page = 0;
      this.onInfinite();
    }),
    onInfinite() {
      this.$http.get(`groups/${this.group.id}/members`, { params: { q: this.q, page: this.page + 1 } })
              .then(response => response.json())
              .then((result) => {
                pushIf(this.members, result.data, this.ids);
                this.page = result._meta.pagination.current_page;
                if (this.page < result._meta.pagination.total_pages) {
                  this.$refs.infinite.$emit('$InfiniteLoading:loaded');
                } else {
                  this.$refs.infinite.$emit('$InfiniteLoading:complete');
                }
              })
              .catch(() => this.$refs.infinite.$emit('$InfiniteLoading:loaded'));
    },
    findGroup() {
      const id = int(this.$route.params.group);

      if (!(id in this.groupMap)) {
        this.getGroup({ id });
      }
    },
    ...mapActions({ getGroup: rootActions.getGroups }),
  },
  watch: {
    $route() {
      this.findGroup();
    },
    original() {
    },
  },
};
</script>

<style lang="scss">
@import "../styles/variables";
@import "../styles/methods";

.group-preview {
  &-photo {
    width: rem(160px);
    height: rem(160px);
    border-radius: $border-radius-sm;
  }
  &-tag {
    padding: $spacer / 2;
  }
}
</style>
