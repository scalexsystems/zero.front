<template>

    <activity-box class="hub-group-preview"
                  v-bind="{ title, subtitle, show: true, actions: [], disableFooter: true }"
                  @close="$router.go(-1)">

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
  },
  components: { ActivityBox },
};
</script>
<style lang="scss" scoped>

</style>
