<template>
<div class="action-menu">
  <div v-if="isSpaceAvailable" class="action-menu-actions"></div>
  <div class="dropdown">
    <button class="action-menu-toggler"
            data-toggle="dropdown"
            type="button" :id="id"
            aria-haspopup="true"
            aria-expanded="false"><i class="fa fa-fw fa-ellipsis-v"></i></button>
    <div class="dropdown-menu dropdown-menu-right" :aria-labelledby="id">

    </div>
  </div>
</div>
</template>

<script lang="babel">
/* eslint-disable no-underscore-dangle */

export default {
  computed: {
    id() {
      return `message-box-${this._id}`;
    },
  },
  data() {
    return {
      isSpaceAvailable: false,
    };
  },
};
</script>

<style lang="scss">
.action-menu-toggler {
  background: transparent;
  border: none;
  font-size: 1.142857rem;
  &:focus {
    outline: none;
  }
}
</style>
