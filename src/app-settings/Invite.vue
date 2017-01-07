<template>
    <settings-box title="Invites">
        <template slot="settings-body">
            <div class="container py-2">
                <div class="row my-2">
                    <div class="col-xs-12 col-lg-12">
                        <div class="text-xs-center"> INVITE STUDENTS </div>

                        <div class="invite-input input-group input-group-lg">
                        <span class="input-group-addon"><i class="fa fa-search"></i></span>
                        <input class="form-control" type="search" v-model="q" @keyup="search">
                    </div>

                <div class="row">
                  <div class="col-xs-12 col-lg-8 text-muted">
                     An invite will be sent to all students via this list

                  </div>
                  <div class="col-xs-12 col-lg-4 text-muted text-lg-right">
                  invited
                  </div>
                </div>
                    <div class="institute-details-actions ">
                        <div class="btn btn-default" role="button"> Cancel </div>
                        <div class="btn btn-primary" role="button" @click="saveInstitute"> Send Invite  </div>
                    </div>
                  </div>
                </div>
                <div class="row my-2">
                    <div class="col-xs-12 col-lg-12">
                        <div class="text-xs-center"> INVITE TEACHERS </div>

                        <div class="invite-input input-group input-group-lg">
                        <span class="input-group-addon"><i class="fa fa-search"></i></span>
                        <input class="form-control" type="search" v-model="q" @keyup="search">
                    </div>

                <div class="row">
                  <div class="col-xs-12 col-lg-8 text-muted">
                     An invite will be sent to all teachers via this list

                  </div>
                  <div class="col-xs-12 col-lg-4 text-muted text-lg-right">
                  invited
                  </div>
                </div>
                    <div class="institute-details-actions ">
                        <div class="btn btn-default" role="button"> Cancel </div>
                        <div class="btn btn-primary" role="button" @click="saveInstitute"> Send Invite  </div>
                    </div>
                  </div>
                </div>
                <div class="row my-2">
                    <div class="col-xs-12 col-lg-12">
                        <div class="text-xs-center"> INVITE NON-TEACHING EMPLOYEES </div>

                        <div class="invite-input input-group input-group-lg">
                        <span class="input-group-addon"><i class="fa fa-search"></i></span>
                        <input class="form-control" type="search" v-model="q" @keyup="search">
                    </div>

                <div class="row">
                  <div class="col-xs-12 col-lg-8 text-muted">
                     An invite will be sent to all employees via this list

                  </div>
                  <div class="col-xs-12 col-lg-4 text-muted text-lg-right">
                  invited
                  </div>
                </div>
                    <div class="institute-details-actions ">
                        <div class="btn btn-default" role="button"> Cancel </div>
                        <div class="btn btn-primary" role="button" @click="saveInstitute"> Send Invite  </div>
                    </div>
                  </div>
                </div>
            </div>
        </template>
    </settings-box>

</template>
<script lang="babel">
import SettingsBox from './SettingsBox.vue';
import SettingsCard from './SettingsCard.vue';

export default{
  created() {
  },
  data() {
    return {
      onAdd: false,
      loaded: false,
      discipline: {
        name: '',
        acronym: '',
      },
      errors: {},
    };
  },
  computed: {
  },
  components: { SettingsBox, SettingsCard },
};
</script>
<style lang="scss" scoped>
@import '../styles/methods';
.invite {
  &-input {
   padding: rem(20px) 0 rem(10px);
 }
}

</style>
