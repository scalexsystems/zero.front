<template>
<div>
  <div class="card card-block" role="button" @click='$emit("cardClicked", index)'>
      <div class="settings-card-title">
        <slot name="title">
            <span class="card-title"> {{ title }} </span>
        </slot>
   </div>
    <div class="settings-card-text">
          <slot name="text">
          <small class="card-text text-muted">{{ text }} </small>
          </slot>
    </div>

    <div class="settings-card-additional-text" v-if="additional">
        <slot name="additional-text">
        </slot>
    </div>
  </div>
 </div>
</template>
<script lang="babel">
export default{
  data() {
    return {
    };
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
    },
    index: {
      default: 0,
    },
    additional: {
      default: false,
    },
  },
  methods: {
    settingClicked() {
    },
  },
  components: {},
};
</script>
<style lang="scss" scoped>
@import '../styles/methods';

.settings-card {
  &-title {

  }

    &-text {
      text-align: left;
      padding: 0 rem(10px);
  }


}


</style>
