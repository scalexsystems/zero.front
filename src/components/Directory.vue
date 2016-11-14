<template>
<activity-box
        v-bind="{ title, subtitle, show: true, actions, disableFooter: true }"
        @close="$emit('close')"
        @option-click="onOptionClick">
  <div class="directory-header row">
    <div class="col-xs-12 col-lg-8 offset-lg-2 my-2">
      <div class="input-group input-group-lg">
        <span class="input-group-addon"><i class="fa fa-search"></i></span>
        <input class="form-control" type="search" v-model="q" @keyup="$emit('search', q)">
      </div>
    </div>
  </div>

  <div class="row directory-results-container">
    <div class="col-xs-12 col-lg-8 offset-lg-2">
      <div class="row">
        <div class="col-xs-12 directory-results-description">{{ resultMessage }}</div>
      </div>
      <div class="row">
        <div v-for="(item, index) of filtered" class="col-xs-12 col-md-6">
          <item-card :person="item" @open="$emit('item', item, index)"></item-card>
        </div>

        <infinite-scroll class="col-xs-12" :on-infinite="onInfinite" ref="infinite"></infinite-scroll>
      </div>
    </div>
  </div>
</activity-box>
</template>

<script lang="babel">
import Shifter from 'sifter';
import InfiniteScroll from 'vue-infinite-loading';

import ItemCard from './PersonCard.vue';
import ActivityBox from './ActivityBox.vue';
import { mapObject } from '../util';

export default {
  props: {
    items: {
      required: true,
    },
    ...mapObject(ActivityBox.props, ['title', 'subtitle', 'actions']),
  },
  components: { ActivityBox, ItemCard, InfiniteScroll },
  computed: {
    searchable() {
      const items = this.items;

      return new Shifter(items);
    },
    filtered() {
      const searchable = this.searchable;
      const items = this.items;
      const query = this.q;
      const result = searchable.search(query, {
        fields: ['name'],
        sort_empty: [{ field: 'name', direction: 'asc' }],
      });
      return result.items.map(({ id }) => items[id]);
    },
  },
  data() {
    return {
      q: '',
      resultMessage: '',
    };
  },
  methods: {
    onOptionClick: ActivityBox.methods.onOptionClick,
    onInfinite() {
      const end = () => this.$refs.infinite.$emit('$InfiniteLoading:complete');
      const done = () => this.$refs.infinite.$emit('$InfiniteLoading:loaded');

      this.$emit('load-more', {
        done,
        end,
        error: end,
      });
    },
  },
};
</script>

<style lang="scss">
.directory {
  &-header {

  }
  &-result-container {

  }
}
</style>
