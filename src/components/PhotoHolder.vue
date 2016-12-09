<template>
  <div>
     <img class="group-preview-photo my-2" v-bind="{ src }" @mouseover="setUploadHover(true)"
        ref='groupPhoto' @mouseout="setUploadHover(false)">
      <div v-show='showHover' class="group-preview-overlay-container">
         <a href='#' @click='openFile'>
           <i class="group-preview-upload-icon fa fa-arrow-circle-up"></i>
           <input ref='inputFile' type='file' id='file-input' @change="$emit('upload')" hidden>
           <strong> Click to Upload </strong>
          </a>
      </div>
   </div>
</template>

<script type='babel'>
export default{
  data() {
  return {
    file: this.$refs.inputFile.files[0],
  }
  },
  components:{},
  props: {
    src: {
      type: String
    },
  },
  methods: {
    openFile() {
      return this.$refs.inputFile.click();
    },
    showHover() {
      return this.uploadHover;
    },
    setUploadHover(mode) {
      this.uploadHover = mode;
    },

    fileUploaded() {
      return this.$refs.inputFile.files[0];
    }

   }
}
</script>

<style>
    body{
    }
</style>