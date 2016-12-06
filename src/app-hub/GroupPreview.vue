<template>
<activity-box v-if="group" class="hub-group-preview"
              v-bind="{ title, subtitle, show: true, actions: [], disableFooter: true }"
              @close="$router.go(-1)">
  <template slot="actions">
    <router-link v-if="group.is_admin" :to="{name: 'hub.group-edit', params: { group: group.id } }"
                 class="btn btn-primary">Edit</router-link>
  </template>
  <div class="container py-2">
    <div class="text-xs-center">
      <div class="my-2">
        <span class="alert alert-info group-preview-tag" v-if="!group.private">Public Group</span>
        <span class="alert alert-danger group-preview-tag" v-else>Public Group</span>
      </div>
      <img class="group-preview-photo my-2" :src="group.photo">
      <h2>{{ group.name }}</h2>
      <p>

      <small class="text-muted">{{ group.bio }}</small>
      </p>
      <div class="my-2">
      <a href='#' @click.prevent="joinGroup" class="btn btn-primary"> Join Group </a>
      <a href='#' @click.prevent="leaveGroup" class="btn btn-warning"> Leave Group </a>
      </div>
    </div>

    <div class="row">
      <div class="col-xs-12 col-lg-8 offset-lg-2 my-2">
        <div class="input-group input-group-lg">
          <span class="input-group-addon"><i class="fa fa-search"></i></span>
          <input class="form-control"
                 type="search" v-model="q"
                 @keyup="search">
        </div>
      </div>
      <div class="col-xs-12 col-lg-8 offset-lg-2 my-2">
        <div class="row">
          <div class="col-xs-12 col-lg-6" v-for="(member, index) of members">
            <item-card :item="member"
                       @open="openMemberProfile(member, index)"></item-card>
          </div>
          <infinite-scroll class="col-xs-12" :on-infinite="onInfinite"
                           ref="infinite"></infinite-scroll>
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
import { actions } from './vuex/meta';
import { getters as rootGetters, actions as rootActions } from '../vuex/meta';
import { LoadingPlaceholder, ActivityBox, PersonCard as ItemCard } from '../components';

export default {
  name: 'GroupPreview',
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
    group() {
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
    ...mapActions({
      getGroup: rootActions.getGroups,
      joinGroupAction: actions.joinGroup,
      leaveGroupAction: actions.leaveGroup,
    }),

    joinGroup() {
      this.$http.put(`groups/${this.group.id}/join`)
      .then(() => {
        this.$router.push({ name: 'hub.group' });
      });
    },

    leaveGroup() {
      this.$http.delete(`groups/${this.group.id}/leave`)
      .then(() => {
        this.leaveGroupAction({ groupId: this.group.id });
        this.$router.push({ name: 'hub.groups' });
      });
    },
  },
  watch: {
    $route() {
      this.findGroup();
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
