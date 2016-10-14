<template>
<div class="layout-box">
  <div class="layout-box-header">
    <slot name="header">
      <slot name="context"></slot>
      <div class="layout-box-actions-container">
        <slot name="actions">
          <action-menu></action-menu>
        </slot>
      </div>
    </slot>
  </div>
  <div class="layout-box-body">
    <slot></slot>
  </div>
  <div v-if="!isFooterDisabled" class="layout-box-footer">
    <slot name="footer"></slot>
  </div>
</div>
</template>

<script lang="babel">
import { bool } from '../util';
import ActionMenu from './ActionMenu.vue';

export default {
  props: {
    type: {
      type: String,
      default: 'user',
    },
    title: String,
    subtitle: String,
    disableFooter: {
      default: false,
    },
  },
  components: { ActionMenu },
  computed: {
    typeClass() {
      const type = this.type;

      switch (type) {
        case 'user':
          return 'photo-square';
        default:
          return 'photo-round';
      }
    },
    isFooterDisabled() {
      const disableFooter = this.disableFooter;

      return bool(disableFooter);
    },
  },
};
</script>

<style lang="scss">
@import '../styles/methods';
@import '../styles/mixins';

$layout-box-bg: white !default;
$layout-box-subtitle-color: #9b9b9b !default;
$layout-box-actions-color: #9b9b9b !default;

.layout-box {
  display: flex;
  flex-direction: column;
  background: white;

  @include match-parent();

  border: 1px solid $border-color;
}

.layout-box-header {
  display: flex;
  flex-direction: row;
  padding: 1rem 1.714rem;
  border-bottom: 1px solid $border-color;
}

.layout-box-body {
  flex: 1;
}

.layout-box-footer {
  border-top: 1px solid $border-color;
}

.layout-box-photo {
  width: rem(42px);
  height: rem(42px);

  &.photo-square {
    border-radius: $border-radius-sm;
  }

  &.photo-round {
    border-radius: 100%;
  }
}

.layout-box-title-container {
  flex: 1;
  margin: -1px 1rem; // Top and bottom margin -1px to make height 70px.
}

.layout-box-title {
  font-size: 1.28571rem;
}

.layout-box-subtitle {
  color: $layout-box-subtitle-color;
  font-size: 0.85714rem;
}

.layout-box-actions-container {
  align-self: center;
  color: $layout-box-actions-color;

  * {
    color: inherit;
  }
}
</style>
