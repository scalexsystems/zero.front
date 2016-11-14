<template>
<transition name="activity-box" appear v-if="show">
  <layout-box v-bind="{ actions, disableFooter }" @option-click="onOptionClick">
    <template slot="context">
    <a class="activity-box-dismiss" href="#" @click.prevent.stop="$emit('close')">
      <img src="../assets/cross.svg">
    </a>
    <div class="activity-box-title-container">
      <div class="activity-box-title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div class="activity-box-subtitle">
        <slot name="subtitle">{{ subtitle }}</slot>
      </div>
    </div>
    </template>
    <template slot="actions" v-if="enableTopbar">
      <slot name="topbar"></slot>
    </template>

    <slot></slot>
  </layout-box>
</transition>
</template>

<script lang="babel">
import LayoutBox from './LayoutBox.vue';

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: String,
    subtitle: String,
    enableTopbar: {
      default: false,
      type: Boolean,
    },
    ...LayoutBox.props,
  },
  components: { LayoutBox },
  methods: {
    onOptionClick: LayoutBox.methods.onOptionClick,
  },
};
</script>

<style lang="scss">
@import '../styles/methods';

$border-radius-sm: 0.2rem !default;
$activity-box-subtitle-color: #9b9b9b !default;

.activity-box-enter {}
.activity-box-enter-active {}
.activity-box-leave {}
.activity-box-leave-active {}

.activity-box-dismiss {
  width: rem(42px);
  height: rem(42px);
  &:hover, &:focus {
    text-decoration: none;
  }

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: $border-radius-sm;

  &:hover, &:focus {
    background: darken(#fff, 5%);
  }
}

.activity-box-title-container {
  margin: -1px 1rem; // Top and bottom margin -1px to make height 70px.
}

.activity-box-title {
  font-size: 1.28571rem;
}

.activity-box-subtitle {
  color: $activity-box-subtitle-color;
  font-size: 0.85714rem;
}
</style>
