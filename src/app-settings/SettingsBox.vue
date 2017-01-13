<template>

    <activity-box class="settings-box"
                  v-bind="{ title, subtitle, show: true, actions: [], disableFooter: true }"
                  @close="$router.go(-1)">

        <template slot="icon">
            <slot name="icon">
            <a class="activity-box-dismiss" role="button" @click.prevent.stop="$emit('close')">
                <img src="../assets/cross.svg">
            </a>
            </slot>
        </template>

        <template slot="actions">
            <slot name="actions"></slot>
        </template>

        <div class="settings-pane">
            <div class="text-xs-center">
                <div class="settings-header-image">
                    <slot name="header-image"></slot>
                 </div>
                 <div class="settings-header-name">
                    <slot name="name"></slot>
                 </div>
                 <div class="settings-header-description">
                 <slot name="description">
                 </slot>

                </div>
            </div>
        <slot name="settings-body">
        </slot>
        </div>

    </activity-box>
</template>
<script lang="babel">
import ActivityBox from '../components/ActivityBox.vue';

export default{
  data() {
    return {};
  },

  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
  },
  components: { ActivityBox },
};
</script>
<style lang="scss" scoped>
@import '../styles/methods';

.settings-header-name {
  font-size: 1.5rem;
}

.settings-header-image {
  padding: rem(20px);
}

.settings-header-description {
  font-size: 1em;
  color: $gray;
}

</style>
