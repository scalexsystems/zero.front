<template>
    <div>
        <div class='file-attachment-wrapper'>
           <div class="file-attachment-logo">
               <i class="fa" :class="[`fa-file-${ext}-o`]"></i>
           </div>
            <div class="file-attachment-filename" @click="downloadFile">
                {{ attachment.filename }}
                <div class="file-attachment-size">
                    <small class='text-muted'> {{ attachment.size }} Kb </small>
                </div>
            </div>
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
      ext() {
        const extMap = { pdf: 'pdf', doc: 'word', docx: 'word', xls: 'excel', xlsx: 'excel', ppt: 'powerpoint', pptx: 'powerpoint' };
        return extMap[this.attachment.extension] || '';
      },
    },
    components: {},
    methods: {
      downloadFile() {
        const path = this.attachment.path || '#';
        window.open(path);
      },
    },
  };
</script>
<style lang="scss">
@import "../../../styles/variables";
@import '../../../styles/methods';

    .file-attachment {
   &-logo {
     padding: rem(5px);
     color: $brand-danger;
     font-size: 2rem;

   }

   &-filename {
       padding: rem(5px) rem(10px);
     display: flex;
     flex-direction: column;
     align-items: flex-start;
   }

   &-wrapper {
     display: flex;
     flex-direction: row;
     padding: rem(9px) rem(10px);
     border: 1px solid $gray-lighter;
     width: rem(250px);
     margin: rem(10px) 0 rem(10px) 0;
     cursor: pointer;

   }

   &-size {
     display: inline-flex;

   }
 }

</style>
