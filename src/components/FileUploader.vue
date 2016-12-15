<template>
  <div>
    <input type="file" ref="inputFile" hidden @change="onFileSelected">

    <slot name="progress">
      <popup :showTitle="false" v-if="uploading">
          <template slot="popup-body">
            <progress class="progress mb-0" :value="progress" max="100">
              <div class="progress">
                <span class="progress-bar" :style="{ width: progress + '%' }"></span>
                <span class="text-center"> Uploading </span>
              </div>
            </progress>
          </template>
      </popup>
    </slot>

      <slot name="postUpload">
          <popup :showTitle="false" v-if="showPopup" @popupClose="closePopup">
              <template slot="popup-body">
                  <div class="row">
                      <div class="">
                          <input-text title="Name of the File" required v-model="file.name" ></input-text>
                      </div>
                      <div class="">
                          <input-text title="Add a message (optional)" v-model="file.message"></input-text>
                      </div>
                  </div>
              </template>

              <template slot="popup-footer">
                  <a href='#' class="btn btn-primary" @click="closePopup"> Cancel </a>
                  <a href='#' class="btn btn-primary" @click="shareFileClick"> Share file </a>
             </template>
          </popup>
      </slot>

  </div>
</template>
<script type='babel'>
import Popup from './Popup.vue';


export default{
  props: {
    name: {
      type: String,
      default: 'file',
    },
    dest: {
      type: String,
      //required: true,
    },
    title: {
      type: String,
      default: 'Crop Photo',
    },
    subtitle: {
      type: String,
      default: ''
    },
  },
  components: { Popup },
  data() {
    return {
      uploading: false,
      progress: 0,
      error: null,
      showPopup: false,
      file: {
        name: null,
        message: '',
        src: '',
        id: 0,
      }
    };
  },
  created() {
     this.$on('triggerFileInput', () => {
     this.$refs.inputFile.click();
     })
  },
  computed: {
  },
  methods: {
    upload (payload) {
      // eslint-disable-no-undef
      const form = new FormData();
      form.append(this.name, payload);
      this.uploading = true;
      this.progress = 0;
      this.error = null;

      this.$http.post(this.dest, form, {
          progress: (event) => {
            this.showPopup = true;
            if (event.lengthComputable) {
              this.progress = event.loaded / event.total * 100;
            }
          },
        })
        .then((response) => {
          this.uploading = false;
          this.file.src = response.body.path;
          this.file.id = response.body.id;

        })
        .catch((response) => {
          this.uploading = false;

          if ('json' in response) {
            response.json().then((result) => {
              this.error = result.message || 'Upload failed.';
            }).catch((error) => {
              this.error = error;
            });
          } else {
            this.error = response;
          }
        });
    },
    onFileSelected (event) {
      const files = event.target.files;
      if (!files || !files[0]) return;
      this.file.name = files[0].name;

      return this.upload(files[0]);

    },
    shareFileClick(event) {
      if (!this.error) {
        this.$emit('groupFileShared', event, this.file)
        this.showPopup = false;
      }
    },
    closePopup() {
      this.showPopup = false;
    },
  },
};

</script>
<style lang="scss">
.progress {
    margin-top: 1rem;
    height: .25rem;
    z-index: 1;
}
</style>
