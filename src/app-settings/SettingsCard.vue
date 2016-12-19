<template>
<div>
  <div class="card card-block" role="button" @click='settingClicked()'>
      <div class="settings-card-title">
        <slot name="title">
            <span class="card-title"> {{ setting.title }} </span>
        </slot>
   </div>
    <div class="settings-card-text">
          <slot name="text">
          <p class="card-text">{{ setting.text }}
          </slot>
    </div>
  </div>
  </div>
</template>
<script lang="babel">
export default{
  data() {
    return {};
  },
  props: {
    setting: {
      type: Object,
      required: true,
    },
  },
  methods: {
    settingClicked() {
      debugger;
      this.$router.push({ name: this.setting.path });
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
