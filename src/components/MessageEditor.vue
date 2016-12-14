<template>
<div class="row message-input-wrapper">
  <textarea class="message-input" name="message" :value="value" ref="input"
            placeholder="Start discussing..." autofocus @input="onInput"
            @keydown.enter="onEnter" :disabled="disabled" rows='1'
            autocomplete="off" autocorrect="off" @focus="$emit('focused')"></textarea>

   <slot name='message-actions'>
       <message-action :actions="[{ name: 'Import File', icon: 'plus' }]" @message-option-click="actionClicks"></message-action>
       <slot name='file-uploader'>
               <file-uploader ref='uploader' :dest="uploadDest" @uploaded="uploaded"
                              @groupFileShared="fileShared">
               </file-uploader>
       </slot>
   </slot>

</div>
</template>

<script lang="babel">
import resize from 'autosize';
import MessageAction from './MessageAction.vue';
import Popup from './Popup.vue';
import FileUploader from './FileUploader.vue';

export default {
  data() {
    return {
      showPopup: false,
    };
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      required: true,
    },

    uploadDest: {
      type: String,
    },
  },
  components: { MessageAction, Popup, FileUploader },
  methods: {
    resize() {
      const event = window.document.createEvent('Event');
      event.initEvent('autosize:destroy', false, true);
      this.$refs.input.dispatchEvent(event);
      this.$nextTick(() => {
        resize(this.$refs.input);
      });
    },
    focus() {
      setTimeout(() => this.$refs.input.focus(), 0);
    },
    onInput(event) {
      this.$emit('input', event.target.value);
    },
    onEnter(event) {
      if (event.shiftKey !== true && event.target.value.trim()) {
        event.preventDefault();
        this.$emit('send', event);
      }
    },
    actionClicks(event, action, index) {
      const clickActions = [this.importFile];
      return clickActions[index] ? clickActions[index]() : () => {};
    },

    importFile() {
      this.$refs.uploader.$emit('triggerFileInput');
    },
    closePopup() {
      this.showPopup = false;
    },
    uploaded() {

    },
    fileShared(event, file) {
      this.$emit('groupFileShared', event, file);
    },
  },
  mounted() {
    this.$nextTick(() => {
      resize(this.$refs.input);
    });
  },
};
</script>


<style lang="scss">
@import '../styles/variables';

.message-input-wrapper {
  padding: 0 1.8714rem;
  border-top: 1px solid $border-color;
}

.message-input {
  border: none;
  resize: none;
  width: 95%;
  min-height: 21px;
  max-height: 300px;
  line-height: 1.5;
  overflow-x: hidden;
  padding: 1.45rem 0;
  &:active, &:focus {
    outline: none;
  }
}

.message-actions {
 width: 5%;
}
</style>
