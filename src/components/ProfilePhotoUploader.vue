<template>
  <div class="profile-photo-uploader" @click="$refs.file.click()">
    <img class="preview" v-bind="{ src }">
    <input type="file" ref="file" hidden v-model="file">

    <div class="backdrop" v-if="cropping">
      <activity-box v-bind="{ title, subtitle }">
        <img id="profile-photo-uploader-cropper" :src="image">

        <div class="text-xs-center">
          <button type="button" class="btn btn-primary" @click="cropAndUpload">Crop</button>
        </div>
      </activity-box>
    </div>

    <div class="overlay" v-else>
      <slot>
        <div class="upload-trigger">
          <div>
            <i class="fa fa-arrow-circle-up fa-2x mt-2 mb-1"></i>
          </div>

          <span>Click to Upload</span>
        </div>
      </slot>
    </div>
  </div>
</template>

<script type='babel'>
import Crop from 'vanilla-image-cropper';

export default{
  props: {
    src: {
      type: String,
    },
    key: {
      type: String,
      default: 'photo',
    },
    dest: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: 'Crop Photo',
    },
    subtitle: {
      type: String,
      default: ''
    },
    crop: {
      type: Boolean,
      default: true,
    },
    options: {
      type: Object,
      default () {
        return {
          fixed_size: true,
          mode: 'square',
        };
      },
    },
  },
  data() {
    return {
      cropping: false,
      file: null,
      context: null,
    };
  },
  methods: {
    cropAndUpload () {
      if (!this.context) return;

      const dataString = this.context.crop();
    },
    upload (payload) {
      const form = new FormData();

      form.append(this.key, payload);

      this.$http.post(this.dest, form)
        .then((response) => {
          this.$emit('uploaded', response.header('Location'), response);
        })
        .catch(response => response);
    },
  },
  watchers: {
    file (file) {
      const selected = this.$refs.file.files;

      if (!selected || !selected[0]) return;

      if (this.crop) {
        return this.upload(selected[0]);
      }

      const ext = file.substring(file.lastIndexOf('.') + 1).toLowerCase();

      if (['png', 'gif', 'jpg', 'jpeg'].indexOf(ext) < 0) return;

      const FD = new FileReader();

      FD.onload((event) => {
        this.context = new Crop('#profile-photo-uploader-cropper', event.target.result, this.options);
      });

      FD.readAsDataURL(selected[0]);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.profile-photo-uploader {
  display: inline-flex;
  position: relative;
  cursor: pointer;
  .overlay {
    opacity: 0;
    background: $gray-lighter;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    transition: opacity .3s;
  }

  &:hover {
    .overlay {
      opacity: 0.34;
    }
  }
}

.upload-trigger {
  display: flex;
  height: 100%;
  flex-direction: column;;

  align-items: center;
  justify-content: center;
}

.preview {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
