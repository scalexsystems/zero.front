<template>
  <div class='message-action-wrapper'>
    <slot name='messageActions'>
        <template v-for="(action, index) of actions">
          <a href="#" class="message-box-action" @click.prevent="click($event, 'test')">
            <i class="fa fa-fw" :class="[`fa-${action.icon}`]"></i>
          </a>
        </template>
    </slot>
  </div>
</template>

<script lang="babel">
export default{
  data() {
    return {
    };
  },
  props: {
    actions: {
      type: Array,
    },
  },
};
</script>

<style>
.message-action-wrapper {
  display: flex;
  align-items: center;
}


</style>
