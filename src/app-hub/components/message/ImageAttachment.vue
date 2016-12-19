<template>
  <div class="card image-attachment" role="button">
    <div class="embed-responsive embed-responsive-16by9">
      <img class="embed-responsive-item" :src="attachment.path">
    </div>
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
<style lang="scss" scoped>
@import '../../../styles/variables';
@import '../../../styles/mixins';

.image-attachment {
  width: 100%;

  margin: .5rem .5rem .5rem 0;

  @include media-breakpoint-up(md) {
    width: 450px;
    height: 253px;
  }

  img {
    object-fit: cover;
  }
}
</style>
