<template>
<div class="hub-list-container">
  <div class="hub-list-header" @click="onListBrowse">
    <slot name="header">
      <div class="hub-list-icon"><i class="fa fa-fw" :class="[iconClass]"></i></div>
      <span class="hub-list-title">{{ title }}</span>
      <button class="btn hub-list-action"
              @click.stop.prevent="onListAction"><i
              class="fa fa-fw fa-plus-square-o"></i></button>
    </slot>
  </div>
  <div class="hub-list-items">
    <div class="hub-list-item" v-for="(item, index) of listItems"
         :class="{active: isActive(item)}"
         @click.stop.prevent="onListSelect(item, index, $event)">
      <slot :name="'hub-list-item-'+index">{{ item.name }}</slot>
    </div>
  </div>
</div>
</template>

<script lang="babel">
import int from 'lodash/toInteger';

export default {
  props: {
    icon: String,
    title: String,
    limit: {
      default: -1,
    },
    type: {
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
  },
  computed: {
    listItems() {
      const limit = this.limit;
      const items = this.items;

      if (limit < 0) return items;

      return items.slice(0, parseInt(limit, 10));
    },
    iconClass() {
      const icon = this.icon;

      if (icon) {
        return `fa-${icon}`;
      }

      return undefined;
    },
  },
  methods: {
    onListSelect(item, index, event) {
      this.$emit('list-select', item, index, event);
    },
    onListAction(event) {
      this.$emit('list-action', event);
    },
    onListBrowse(event) {
      this.$emit('list-browse', this.items, this.type, event);
    },
    isActive(item) {
      /* eslint-disable no-underscore-dangle */
      return this.type === item._type && int(this.$route.params[this.type]) === item.id;
    },
  },
};
</script>

<style lang="scss">
@import '../../../styles/variables';
@import '../../../styles/methods';

$hub-list-item-border-radius: rem(2px) !default;

.hub-list-container {
  margin-bottom: 2rem;
  overflow-x: hidden;
}

.hub-list-header {
  margin: .75rem 0;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.hub-list-icon {
  color: $gray-light;
  margin-right: rem(7px);
  cursor: pointer;
}

.hub-list-title {
  letter-spacing: rem(3px);
  text-transform: uppercase;
  font-weight: bold;
  flex: 1;
  cursor: pointer;
}

.hub-list-action {
  color: $gray-light;
  background: none;
  padding: 0.5rem;

  &:hover, &:focus {
    outline: none;
    background: darken(white, 10%);
  }
}

.hub-list-items {
}

.hub-list-item {
  cursor: pointer;
  padding: rem(4px) rem(8px);
  white-space: nowrap;
  text-overflow: ellipsis;
  border-radius: $hub-list-item-border-radius;

  &:hover {
    background: lighten($brand-primary, 90%);
  }

  &.active {
    color: white;
    background: $brand-primary;
  }
}
</style>
