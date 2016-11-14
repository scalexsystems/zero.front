<template>
<activity-box v-if="group"
              v-bind="{ title, subtitle, show: true, actions: [], disableFooter: true }"
              @close="close">

  <div class="container py-2">
    <div class="text-xs-center">
      <img class="group-preview-photo my-2" :src="group.photo">

      <div class="my-2">
        <span class="alert alert-info group-preview-tag" v-if="!group.private">Public Group</span>
        <span class="alert alert-danger group-preview-tag" v-else>Public Group</span>
      </div>

      <h2>{{ group.name }}</h2>
      <p><small class="text-muted">{{ group.bio }}</small></p>
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
            <item-card :person="member"
                       @open="openMemberProfile(member, index)"></item-card>
          </div>
          <infinite-scroll class="col-xs-12"
                           :on-infinite="onInfinite" ref="infinite"></infinite-scroll>
        </div>
      </div>
    </div>
  </div>
</activity-box>
<loading-placeholder v-else></loading-placeholder>
</template>

<script lang="babel">
import Vue from 'vue';
import throttle from 'lodash/throttle';
import InfiniteScroll from 'vue-infinite-loading';

import { pushIf } from '../util';
import { LoadingPlaceholder, ActivityBox, PersonCard as ItemCard } from '../components';

export default {
  name: 'GroupPreview',
  beforeRouteEnter(to, from, next) {
    Vue.http.get(`groups/${to.params.group}`)
            .then(response => response.json())
            .then((result) => {
              next((vm) => {
                Vue.set(vm, 'group', result);
              });
            })
            .catch(() => {
              // TODO: Redirect to 404!
            });
  },
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
  },
  data() {
    return {
      group: null,
      ids: {},
      members: [],
      q: '',
      page: 0,
    };
  },
  methods: {
    close() {
      window.history.back();
    },
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
