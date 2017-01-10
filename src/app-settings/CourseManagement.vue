<template>
  <settings-box title="Course Manager/Administrator">

        <template slot="actions">
            <div role="button" class="btn btn-primary" @click="onCancel"> Cancel </div>
            <div role="button" class="btn btn-primary" @click="onSave"> Save </div>
        </template>


      <template slot="header-image">
          <img src="../assets/settings/course-admin.svg">
      </template>

      <template slot="name">
          Course Manager / Administrator
      </template>

      <template slot="description">
          He/she is responsible to add courses and assign teachers/coordinator to respective courses
      </template>
        <template slot="settings-body">

            <div class="col-xs-12 col-lg-8 offset-lg-2">
                <div class="input-group input-group-lg">
                    <span class="input-group-addon"><i class="fa fa-search"></i></span>
                    <input class="form-control" type="search" v-model="q" @keyup="search">
                </div>
            </div>

            <div class="col-xs-12 col-lg-8 offset-lg-2">
                <div class="row">
                    <div class="col-xs-12 col-lg-6" v-for="(member, index) of members">
                        <item-card :item="member"
                                   @open="openMemberProfile(member, index)"></item-card>
                    </div>
                </div>
            </div>

        </template>



    </settings-box>

</template>
<script lang="babel">
import { mapActions, mapGetters } from 'vuex';
import SettingsBox from './SettingsBox.vue';
import SettingsCard from './SettingsCard.vue';
import Modal from '../components/Modal.vue';
import { actions, getters } from '../vuex/meta';

export default{
  created() {
    if (this.employees.length === 0) {
      this.getEmployees();
    }
  },
  data() {
    return {
      loaded: false,
      employees: {},
      errors: {},
    };
  },
  computed: {
    ...mapGetters({
      employees: getters.employees,
    }),
  },
  components: { SettingsBox, Modal, SettingsCard },
  methods: {
    onCancel() {
      this.onAdd = false;
    },
    onSave() {},
    ...mapActions({
      getEmployees: actions.getEmployees,
    }),
  },
};
</script>
<style lang="scss">
    body{
    }
</style>
