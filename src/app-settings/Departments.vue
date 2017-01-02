<template>
<settings-box title="Departments">

    <template slot="actions">
        <div role="button" class="btn btn-primary" @click="addDepartment"> Add new department </div>
    </template>


    <template slot="settings-body">

        <modal name="Add new department" :show="onAdd">
            <input-text title="Name of the department" required v-model="department.name" :feedback="errors.name"></input-text>
            <input-text title="Department acronym" v-model="department.acronym" :feedback="errors.acronym"></input-text>
            <input-text title="Head of Department" v-model="department.hod" :feedback="errors.hod"></input-text>

            <label> Department Type </label>
            <input type="radio" name="type" id="type-academic" class="form-control" value="academic" v-model="department.type"> Academic
            <input type="radio" name="type" id="type-non-academic" class="form-control" value="academic" v-model="department.type"> Non-Academic/Administrative

            <div class="card-footer bg-white pt-2 pb-1">
            <a role="button" class="btn btn-secondary btn-cancel" tabindex @click="onCancel">Cancel</a>
            <a role="button" class="btn btn-primary" tabindex @click="onSubmit">Save</a>
            </div>
        </modal>
        <div class="container py-2">
          <div class="row">
            <div class="col-xs-12 col-lg-8 offset-lg-2 text-xs-center">
              <div class="row my-2">
                <div class="col-xs-12 col-lg-6 settings-items">
                <settings-card v-for="(department, index) in departments" :title="department.name"
                       :text="getText(department)" :additional="true">
                  <template slot="additional-text">
                    {{ department.stats.student || 0 }} students,
                    {{ department.stats.teachers || 0 }} teachers,
                    {{ department.stats.employees || 0 }} staff
                  </template>
                </settings-card>
            </div>
          </div>
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
    if (this.departments.length === 0) {
      this.getDepartments();
    }
  },
  data() {
    return {
      onAdd: false,
      loaded: false,
      department: {
        name: '',
        acronym: '',
        hod: '',
      },
      errors: {},
    };
  },
  computed: {
    departmentTypes() {
      return {
        academic: 'Academic',
        nonAcademic: 'Non-Academic/Administrative',
      };
    },
    ...mapGetters({
      departments: getters.departments,
    }),
  },
  components: { SettingsBox, Modal, SettingsCard },
  methods: {
    addDepartment() {
      this.onAdd = true;
    },
    onCancel() {
      this.onAdd = false;
    },
    onSubmit() {
      this.$http.post('departments', this.department)
          .then(response => response.json())
          .then(() => {})
          .catch(() => {});
    },
    getText(department) {
      const hod = department.head.length ? department.head.name : 'Not assigned';
      return `HOD: + ${hod}`;
    },


    ...mapActions({
      getDepartments: actions.getDepartments,
    }),
  },
};
</script>
<style lang="scss">
    body{
    }
</style>
