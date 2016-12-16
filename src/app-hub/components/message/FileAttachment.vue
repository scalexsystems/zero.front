<template>
    <div>
        <div class='card file-attachment-wrapper'>
            <div class="card-block">
           <div class="file-attachment-logo">
               <i class="fa" :class="[`fa-file-${ext.icon}`]" :style="{ color: ext.color }"></i>
           </div>
            <div class="file-attachment-filename" @click="downloadFile">
                {{ attachment.filename }}
                <div class="file-attachment-size">
                    <small class='text-muted'> {{ attachment.size }} Kb </small>
                </div>
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
        const extMap = {
          pdf: {
            icon: 'pdf-o',
            color: 'red',
          },
          doc: {
            icon: 'word-o',
            color: 'blue',
          },
          docx: {
            icon: 'word-o',
            color: 'blue',
          },
          xls: {
            icon: 'excel-o',
            color: 'green',
          },
          xlsx: {
            icon: 'excel-o',
            color: 'green',
          },
          ppt: {
            icon: 'powerpoint-o',
            color: 'red',
          },

          def: {
            icon: 'o',
            color: 'gray',
          },
        };

        return extMap[this.attachment.extension] || extMap.def;
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
     padding: 0 rem(5px) 0 rem(5px);
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
       min-width: rem(300px);
       cursor: pointer;
       margin: 0;
   }

   &-size {
     display: inline-flex;

   }
 }

    .card-block {
      display: flex;
      padding: rem(12px);
    }

</style>
