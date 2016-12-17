<template>
    <div class='attachment-wrapper'>
      <div v-for="(attachment, index) of attachments">
          <image-attachment v-bind="{ attachment }" v-if="isImage(attachment.mime)"></image-attachment>
          <file-attachment v-bind="{ attachment }" v-else></file-attachment>




      </div>
    </div>
</template>
<script lang="babel">
import FileAttachment from './FileAttachment.vue';
import ImageAttachment from './ImageAttachment.vue';

export default{
  data() {
    return { };
  },

  props: {
    attachments: {
      type: Array,
      required: true,
    },
  },
  methods: {
    isImage(mime) {
      return mime.slice(0, mime.indexOf('/')) === 'image';
    },
  },

  components: { FileAttachment, ImageAttachment },
};
</script>
<style lang="scss">
@import '../../../styles/methods';
.attachment-wrapper {
    padding: rem(10px) 0 rem(10px);
}

</style>
