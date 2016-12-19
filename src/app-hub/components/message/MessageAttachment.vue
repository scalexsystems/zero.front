<template>
    <div class="attachment-wrapper" v-if="attachments.length">
      <template v-for="(attachment, index) of sorted">
          <image-attachment v-bind="{ attachment }" v-if="isImage(attachment)"></image-attachment>
          <file-attachment v-bind="{ attachment }" v-if="isFile(attachment)"></file-attachment>
          <failed-attachment v-bind="{ attachment }" v-if="isError(attachment)"></failed-attachment>
      </template>
    </div>
</template>
<script lang="babel">
import FileAttachment from './FileAttachment.vue';
import ImageAttachment from './ImageAttachment.vue';
import FailedAttachment from './FailedAttachment.vue';

export default{
  data() {
    return { };
  },
  props: {
    message: {
      required: true,
    },
  },
  computed: {
    sorted() {
      const attachments = this.attachments;
      const sorted = [];

      attachments.forEach((attachment) => {
        if (this.isFile(attachment)) {
          sorted.push(attachment);
        }
      });

      attachments.forEach((attachment) => {
        if (this.isImage(attachment)) {
          sorted.push(attachment);
        }
      });

      attachments.forEach((attachment) => {
        if (this.isError(attachment)) {
          sorted.push(attachment);
        }
      });

      return sorted;
    },
    attachments() {
      const message = this.message;
      const errors = this.message.errors;
      const items = message.attachments.data;

      if (errors === undefined) {
        return items;
      }

      const prepared = [];

      for (let i = 0, index = 0; i < errors.length; i += 1) {
        if (errors[i]) {
          prepared[i] = errors[i];
        } else {
          prepared[i] = items[index];

          index += 1;
        }
      }

      return prepared;
    },
  },
  methods: {
    isImage(attachment) {
      if (!('mime' in attachment)) return false;

      return ['png', 'gif', 'jpg', 'jpeg', 'webp', 'tiff'].indexOf(attachment.extension) > -1;
    },
    isFile(attachment) {
      if (!('mime' in attachment)) return false;

      return ['png', 'gif', 'jpg', 'jpeg', 'webp', 'tiff'].indexOf(attachment.extension) < 0;
    },
    isError(attachment) {
      return !('mime' in attachment);
    },
  },

  components: { FileAttachment, ImageAttachment, FailedAttachment },
};
</script>
<style lang="scss" scoped>
@import '../../../styles/methods';
.attachment-wrapper {

}
</style>
