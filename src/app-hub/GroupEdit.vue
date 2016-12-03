<template>
<activity-box v-if="values"
              v-bind="{ title, subtitle, show: true, actions: [], disableFooter: true }"
              @close="$router.go(-1)">
  <template slot="actions">
  <a class="btn btn-primary" href="#" @click.prevent.stop="updateGroup" ref="action">
    Update Group
  </a>
  </template>

  <div class="container py-1">
    <div class="my-2 text-xs-center">
    </div>
    <div class="row">
      <div class="col-xs-12 col-lg-8 offset-lg-2">
        <input-text title="Name of the group" required v-model="values.name" :feedback="errors.name"></input-text>
      </div>
      <div class="col-xs-6 col-lg-8 offset-lg-2">
        <input-radio title="Group Type" required v-model="values.type" :options="groupTypes"
                     :feedback="errors.type"></input-radio>
      </div>
      <div class="col-xs-6 col-lg-8 offset-lg-2">
        <input-textarea title="Description" v-model="values.description" :feedback="errors.description"></input-textarea>
      </div>
      <div class="col-xs-6 col-lg-8 offset-lg-2">
        <input-search title="Add Members" v-model="query" v-bind="{suggestions}" @suggest="onSuggest"
                      @select="onSelect"></input-search>

        <div class="row">
          <div class="col-xs-12 col-lg-6" v-for="(member, key) in members" :key="key">
            <person-card :item="member">
              <a slot="actions" class="text-muted" href="#" v-tooltip="'Remove'"
                 @click.stop.prevent="removeMember(member)"
              ><i class="fa fa-fw fa-trash-o"></i></a>
            </person-card>
          </div>

          <infinite-scroll class="col-xs-12" :on-infinite="onInfinite" ref="infinite"></infinite-scroll>
        </div>
      </div>
    </div>
  </div>
</activity-box>
<loading-placeholder v-else></loading-placeholder>
</template>

<script lang="babel">
import int from 'lodash/toInteger';
import Validator from 'Validator';
import { mapGetters, mapActions } from 'vuex';
import throttle from 'lodash/throttle';
import InfiniteScroll from 'vue-infinite-loading';

import { pushIf, isValidationException, normalizeValidationErrors as normalize } from '../util';
import { types as mutations } from './vuex/meta';
import { types as rootMutations, getters as rootGetters, actions as rootActions } from '../vuex/meta';
import { LoadingPlaceholder, ActivityBox, PersonCard } from '../components';

export default {
  name: 'GroupEdit',
  components: { LoadingPlaceholder, ActivityBox, PersonCard, InfiniteScroll },
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
    group() {
      const route = this.$route;
      const groupMap = this.groupMap;
      const groups = this.groups;

      const id = int(route.params.group);
      const index = groupMap[id];
      const group = groups[index];

      return group;
    },
    ...mapGetters({
      groups: rootGetters.groups,
      groupMap: rootGetters.groupMap,
      suggestions: rootGetters.users,
    }),
  },
  created() {
    this.findGroup();
  },
  data() {
    return {
      values: null,
      errors: {},
      query: '',
      page: 0,
      members: [],
    };
  },
  methods: {
    updateGroup() {
      if (!this.validate()) {
        return;
      }

      this.$refs.action.classList.add('disabled');
      this.$http.put(`groups/${this.group.id}`, this.values)
              .then(response => response.json())
              .then((result) => {
                this.$refs.action.classList.remove('disabled');
                this.$store.commit(mutations.ADD_GROUP, result);
                this.$store.commit(rootMutations.ADD_GROUP, result);

                return result;
              })
              .catch((response) => {
                this.$refs.action.classList.remove('disabled');
                if (isValidationException(response)) {
                  response.json().then(result => this.$set(this, 'errors', normalize(result.errors)));
                }

                return response;
              });
    },
    validate() {
      const v = Validator.make(this.values, {
        name: 'required|min:3|max:60',
        type: 'required',
        description: 'required',
      });

      if (v.fails()) {
        this.$set(this, 'errors', normalize(v.getErrors()));

        return false;
      }

      this.$set(this, 'errors', {});

      return true;
    },
    onSuggest: throttle(function onSuggest({ value, start, end }) {
      start();
      this.findMembers({ q: value }).then(end);
    }, 400),
    onSelect(member) {
      if (this.group.member_ids.indexOf(member.id) < 0) {
        this.group.member_ids.push(member.id);
        this.members.push(member);
      }
    },
    removeMember(member) {
      const index = this.group.member_ids.indexOf(member.id);
      if (index > -1) {
        this.group.member_ids.splice(index, 1);
        this.members.splice(index, 1);
      }
    },
    search: throttle(function search() {
      this.page = 0;
      this.onInfinite();
    }),
    onInfinite() {
      this.$http.get(`groups/${this.group.id}/members`, { params: { q: this.query, page: this.page + 1 } })
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
    setGroup() {
      if (this.group) {
        this.values = {
          name: this.group.name || '',
          type: this.group.type || '',
          description: this.group.description || '',
        };
      }
    },
    findGroup() {
      const id = int(this.$route.params.group);

      if (!(id in this.groupMap)) {
        this.getGroup({ id });
      } else {
        this.setGroup();
      }
    },
    ...mapActions({ getGroup: rootActions.getGroups }),
  },
  watch: {
    $route: 'findGroup',
    group: 'setGroup',
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
