<template>
  <div class="card file-attachment" role="button">
     <div class="file-attachment-logo">
         <i class="fa fa-fw" :class="[getClassFor(extension)]"></i>
     </div>
      <div class="file-attachment-meta">
          <div class="file-attachment-filename">{{ filename }}</div>
          <div class="text-danger">
            <i class="fa fa-fw fa-warning"></i> {{ attachment.message.join(' ') }} <a role="button">Click to Retry.</a>
          </div>
      </div>
  </div>
</template>
<script lang="babel">
export default{
  props: {
    attachment: {
      type: Object,
      required: true,
    },
  },
  computed: {
    extension() {
      const attachment = this.attachment;

      return attachment.payload.get(attachment.name).name.split('.').pop();
    },
    filename() {
      const attachment = this.attachment;

      return attachment.payload.get(attachment.name).name;
    },
  },
  methods: {
    getClassFor(ext) {
      switch (ext) {
        case 'webp':
        case 'tiff':
        case 'bmp':
        case 'svg':
        case 'jpeg':
        case 'jpg':
        case 'gif':
        case 'png': return 'fa-file-picture-o';
        case '7z':
        case 'gz':
        case 'tar':
        case 'rar':
        case 'zip': return 'fa-file-zip-o';
        case 'rtf':
        case 'odt':
        case 'pages':
        case 'doc':
        case 'docx': return 'fa-file-word-o';
        case 'ods':
        case 'numbers':
        case 'xls':
        case 'xlsx': return 'fa-file-excel-o';
        case 'odp':
        case 'keynote':
        case 'ppt':
        case 'pptx': return 'fa-file-powerpoint';
        case 'eps':
        case 'ps':
        case 'pdf': return 'fa-file-pdf-o';
        case 'txt': return 'fa-file-text-o';
        default: return 'fa-file-o';
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../../styles/variables";
@import '../../../styles/methods';

.file-attachment {
   padding: rem(12px) rem(12px);
   display: inline-flex;
   flex-direction: row;

   max-width: 280px;

   margin: .5rem .5rem .5rem 0;

   &-meta {
     overflow-x: hidden;
   }

   &-logo {
     font-size: 2rem;
     margin-right: .5rem;
   }

   &-filename {
     overflow-x: hidden;
     white-space: nowrap;
     text-overflow: ellipsis;
   }

   &-size {
     display: inline-flex;
   }
}

.fa-file-picture-o, .fa-file-word-o { color: blue; }
.fa-file-excel-o { color: green; }
.fa-file-powerpoint-o, .fa-file-pdf-o { color: red; }
.fa-file-text-o, .fa-file-o { color: gray; }
</style>
