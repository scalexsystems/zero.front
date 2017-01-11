<template>
<settings-box title="Institute Details">

    <template slot="settings-body">
        <div class="container py-1">
           <div class="text-xs-center">
             <photo-holder class="group-preview-photo round" name="file"
                      :dest="`school/logo`"
                      @uploaded="logoUpdated">
            <img :src="institute.photo" class="group-preview-photo">
            </photo-holder>
            </div>

            <div class="row">
                <div class="col-xs-12 col-lg-8 offset-lg-2">
                    <input-text title="Name of the institute" required v-model="institute.name" :feedback="errors.name"></input-text>
                </div>
                <div class="col-xs-12 col-lg-4 offset-lg-2">
                    <input-text title="Institute Username" required v-model="institute.username" :feedback="errors.username"></input-text>
                </div>
                <div class="col-xs-12 col-lg-4">
                    <input-text title="Institute Email" required v-model="institute.email" :feedback="errors.email"></input-text>
                </div>
                <div class="col-xs-12 col-lg-4 offset-lg-2">
                    <input-text title="University" required v-model="institute.university" :feedback="errors.university"></input-text>
                </div>
                <div class="col-xs-12 col-lg-4">
                    <input-text title="Institute Type" required v-model="institute.institute_type" :feedback="errors.institute_type"></input-text>
                </div>
                <div class="institute-details-actions col-xs-12 col-lg-4 offset-lg-2">
                    <div class="btn btn-default" role="button"> Cancel </div>
                    <div class="btn btn-primary" role="button" @click="saveInstitute"> Save </div>
                </div>
            </div>

            <div class="row">
                <div class="col-xs-12 col-lg-8 offset-lg-2">
                    <input-text title="Address Line 1" required v-model="contact.address_line1" :feedback="errors.address_line1"></input-text>
                </div>
                <div class="col-xs-12 col-lg-4 offset-lg-2">
                    <input-text title="Address Line 2" required v-model="contact.address_line2" :feedback="errors.address_line2"></input-text>
                </div>
                <div class="col-xs-12 col-lg-4">
                    <input-text title="Landmark" v-model="contact.landmark" :feedback="errors.landmark"></input-text>
                </div>
                <div class="col-xs-12 col-lg-4 offset-lg-2">
                    <input-text title="City" required v-model="contact.city" :feedback="errors.city"></input-text>
                </div>
                <div class="col-xs-12 col-lg-4">
                    <input-text title="PIN Code" required v-model="contact.pin_code" :feedback="errors.pin_code"></input-text>
                </div>
                <div class="col-xs-12 col-lg-4 offset-lg-2">
                    <input-text title="Website" v-model="contact.website" :feedback="errors.website"></input-text>
                </div>
                <div class="col-xs-12 col-lg-4">
                    <input-text title="Fax Number" required v-model="contact.fax" :feedback="errors.fax"></input-text>
                </div>
                <div class="institute-details-actions col-xs-12 col-lg-4 offset-lg-2">
                    <div class="btn btn-default" role="button"> Cancel </div>
                    <div class="btn btn-primary" role="button" @click="saveContact"> Save </div>
                </div>
            </div>
        </div>
    </template>
</settings-box>

</template>
<script lang="babel">
import pick from 'lodash/pick';
import SettingsBox from './SettingsBox.vue';
import PhotoHolder from '../components/ProfilePhotoUploader.vue';

export default{
  created() {
    this.$http.get('school')
      .then(response => response.json())
      .then((response) => {
        this.institute = pick(response, Object.keys(this.institute));
        this.contact = pick(response.address, Object.keys(this.contact));
        this.contact.city = response.address.city.name;
        this.contact.website = response.website;
        this.contact.fax = response.fax;
      });
  },
  data() {
    return {
      loaded: false,
      institute: {
        name: '',
        username: '',
        email: '',
        university: '',
        institute_type: '',
        logo: '',
      },
      contact: {
        address_line1: '',
        address_line2: '',
        landmark: '',
        city: '',
        pin_code: '',
        website: '',
        fax: '',
      },
      errors: {},
      logo_id: undefined,
    };
  },
  computed: {
  },
  components: { SettingsBox, PhotoHolder },
  methods: {
    saveInstitute() {
      this.$http.put('school', { ...this.institute })
        .then(() => {
        });
    },
    saveContact() {
      this.$http.put('school', { ...this.contact })
        .then(() => {
        });
    },
    logoUpdated(src, response) {
      this.institute.push({ logo_id: response.body.id });
    },
  },
};
</script>
<style lang="scss">
@import "../styles/methods";
    .institute-details {
  &-actions {
    padding: rem(20px) 0;
  }
}
</style>
