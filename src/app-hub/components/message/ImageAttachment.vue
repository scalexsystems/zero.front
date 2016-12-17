<template>
    <div>
      <img :src="attachment.path">
    </div>
</template>
<script lang="babel">
export default{
  data() {
    return { };
  },
  props: {
    attachment: {
      type: Object,
      required: true,
    },
  },
  computed: {

  },
  components: {},
};
</script>
<style>

</style>
