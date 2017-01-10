<template>
<settings-box title="Departments">

    <template slot="actions">
        <div role="button" class="btn btn-primary" @click="addDepartment"> Add new department </div>
    </template>

      <template slot="header-image">
            <img src="../assets/settings/departments.svg">
      </template>

      <template slot="name">
          Academic and Administrative Departments
       </template>

       <template slot="description">
           Academic Departments: e.g. Computer Science, Mechanical, Electronics etc. <br>
           Administrative Departments: e.g. Finance, Academic, Maintenance, HR, security etc.
        </template>

    <template slot="settings-body">
        <modal name="Add new department" :show="onAdd">
                <div class="header-wrapper">
                  <div class="department-modal-title"> Add New Department </div>
            </div>
            <div class="department-modal-body">
                <input-text title="Name of the department" required v-model="department.name" :feedback="errors.name"></input-text>
                <input-text title="Department acronym" v-model="department.acronym" :feedback="errors.acronym"></input-text>
                <input-text title="Head of Department" v-model="department.hod" :feedback="errors.hod"></input-text>

                <input-radio title="Department Type" required v-model="department.type" :options="departmentTypes"
                             :feedback="errors.type"></input-radio>

                <div class="card-footer pt-2 pb-1">
                <a role="button" class="btn btn-secondary btn-cancel" tabindex @click="onCancel">Cancel</a>
                <a role="button" class="btn btn-primary" tabindex @click="onSubmit">Save</a>
                </div>
            </div>
        </modal>
        <div class="container py-2">
              <div class="row my-2">
                <settings-card class="col-xs-12 col-lg-6" v-for="(department, index) in departments" :title="department.name"
                       :text="getText(department)" :additional="true">
                  <template slot="additional-text">
                    {{ department.stats.student || 0 }} students,
                    {{ department.stats.teachers || 0 }} teachers,
                    {{ department.stats.employees || 0 }} staff
                  </template>
                </settings-card>
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
      departments: {},
      departmentTypes: {
        academic: 'academic',
      },
      header: {
        name: 'Academic and Administrative Departments',
        description: '',
      },

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
      return `HOD: ${hod}`;
    },

    ...mapActions({
      getDepartments: actions.getDepartments,
    }),
  },
};
</script>
<style lang="scss" scoped>
  @import '../styles/variables';
  @import '../styles/methods';

  .form-control-label {
    color: white;

  }

  .c-indicator {
    color: inherit;
  }

  .department-modal-title {
   font-size: 1.28571rem;
   padding: rem(20px) 0;
   color: $brand-primary;
   width: rem(550px);
   margin: 0;
  }

  .card-footer {
    background-color: inherit;
  }
</style>
