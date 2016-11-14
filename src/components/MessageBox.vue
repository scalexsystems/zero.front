<template>
<layout-box v-bind="{ actions, disableFooter }">
  <template slot="context">
  <img class="message-box-photo" src="../assets/person.jpg" :src="photo" :class="[typeClass]">
  <div class="message-box-title-container">
    <div class="message-box-title">
      <slot name="title">{{ title }}</slot>
    </div>
    <div class="message-box-subtitle">
      <slot name="subtitle">{{ subtitle }}</slot>
    </div>
  </div>
  </template>

  <template slot="footer">
    <slot name="footer"></slot>
  </template>

  <slot></slot>
</layout-box>
</template>

<script lang="babel">
import LayoutBox from './LayoutBox.vue';

export default {
  props: {
    type: {
      type: String,
      default: 'user',
    },
    title: String,
    subtitle: String,
    photo: String,
    ...LayoutBox.props,
  },
  components: { LayoutBox },
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
  },
};
</script>

<style lang="scss">
@import '../styles/methods';
@import '../styles/mixins';

$message-box-subtitle-color: #9b9b9b !default;
$border-radius-sm: .2rem;

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
  align-self: center;
  margin: -1px 1rem; // Top and bottom margin -1px to make height 70px.
}

.message-box-title {
  font-size: 1.28571rem;
}

.message-box-subtitle {
  color: $message-box-subtitle-color;
  font-size: 0.85714rem;
}
</style>
