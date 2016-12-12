<template>
  <div class='message-action-wrapper'>
    <slot name='messageActions'>
        <template v-for="(action, index) of actions">
          <a href="#" class="message-box-action" @click.prevent="click($event, action, index)">
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
  methods: {
    click(event, action, index) {
      this.$emit('message-option-click', event, action, index);
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
