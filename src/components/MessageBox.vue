<template>
<div class="message-box">
  <div class="message-box-header">
    <slot name="header">
      <img class="message-box-photo" src="../assets/person.jpg" :class="[typeClass]">
      <div class="message-box-title-container">
        <div class="message-box-title">
          <slot name="title">{{ title }}</slot>
        </div>
        <div class="message-box-subtitle">
          <slot name="subtitle">{{ subtitle }}</slot>
        </div>
      </div>
      <div class="message-box-actions-container">
        <slot name="actions">
          <action-menu></action-menu>
        </slot>
      </div>
    </slot>
  </div>
  <div class="message-box-body">
    <slot></slot>
  </div>
  <div v-if="!isFooterDisabled" class="message-box-footer">
    <slot name="footer">
      <br><br>
    </slot>
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

$message-box-bg: white !default;
$message-box-subtitle-color: #9b9b9b !default;
$message-box-actions-color: #9b9b9b !default;

.message-box {
  display: flex;
  flex-direction: column;
  background: white;

  @include match-parent();

  border: 1px solid $border-color;
}

.message-box-header {
  display: flex;
  flex-direction: row;
  padding: 1rem 1.714rem;
  border-bottom: 1px solid $border-color;
}

.message-box-body {
  flex: 1;
}

.message-box-footer {
  border-top: 1px solid $border-color;
}

.message-box-photo {
  width: rem(42px);
  height: rem(42px);

  &.photo-square {
    border-radius: $border-radius-sm;
  }

  &.photo-round {
    border-radius: 100%;
  }
}

.message-box-title-container {
  flex: 1;
  margin: -1px 1rem; // Top and bottom margin -1px to make height 70px.
}

.message-box-title {
  font-size: 1.28571rem;
}

.message-box-subtitle {
  color: $message-box-subtitle-color;
  font-size: 0.85714rem;
}

.message-box-actions-container {
  align-self: center;
  color: $message-box-actions-color;

  * {
    color: inherit;
  }
}
</style>
