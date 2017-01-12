<template>
<settings-box title="Departments">

    <template slot="actions">
        <div role="button" class="btn btn-primary" @click="showAddDepartment"> Add new department </div>
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
                <input-text title="Department acronym" v-model="department.short_form" :feedback="errors.short_form"></input-text>
                <input-text title="Head of Department" v-model="department.hod" :feedback="errors.hod"></input-text>

                <input-radio title="Department Type" required v-model="department.academic"  :options="departmentTypes"
                             :feedback="errors.academic"></input-radio>

                <div class="card-footer pt-2 pb-1">
                <a role="button" class="btn btn-secondary btn-cancel" tabindex @click="onCancel">Cancel</a>
                <a role="button" class="btn btn-primary" tabindex @click="onSubmit">Save</a>
                </div>
            </div>
        </modal>
        <div class="container py-2">
            <div class="text-xs-center"> ACADEMIC DEPARTMENTS </div>
            <div class="row my-2">
                <settings-card class="col-xs-12 col-lg-6" v-for="(department, index) in academic" :title="department.name"
                       :text="getText(department)" :additional="true" @cardClicked="departmentClicked" context="academic">
                  <template slot="additional-text">
                    {{ department.stats.student || 0 }} students,
                    {{ department.stats.teachers || 0 }} teachers,
                    {{ department.stats.employees || 0 }} staff
                  </template>
                </settings-card>
              </div>
            <div class="text-xs-center"> NON-ACADEMIC DEPARTMENTS </div>
            <div class="row my-2">
                <settings-card class="col-xs-12 col-lg-6" v-for="(department, index) in nonAcademic" :title="department.name"
                       :text="getText(department)" :additional="true" @cardClicked="departmentClicked" context="nonAcademic">
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
    if (Object.keys(this.departmentsByType).length === 0) {
      this.getDepartments();
    }
  },
  data() {
    return {
      onAdd: false,
      loaded: false,
      department: {
        name: '',
        short_form: ' ',
        hod: ' ',
        academic: '',
      },
      editReference: {
        id: false,
        index: false,
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
    academic() {
      return this.departmentsByType.academic;
    },

    nonAcademic() {
      return this.departmentsByType.nonAcademic;
    },
    ...mapGetters({
      departmentsByType: getters.departmentsByType,
    }),
  },
  components: { SettingsBox, Modal, SettingsCard },
  methods: {
    showAddDepartment() {
      this.onAdd = true;
    },
    onCancel() {
      this.onAdd = false;
    },
    onSubmit() {
      const type = this.department.academic;
      this.department.academic = type === 'academic';
      const call = this.editReference.id ? 'updateDepartment' : 'addNewDepartment';
      this[call](type);
    },
    addNewDepartment(type) {
      this.$http.post('departments', this.department)
      .then(() => {
        this.onAdd = false;
        this.departmentsByType[type].push(this.department);
        this.addDepartment(this.department);
      })
       .catch(() => {});
    },
    updateDepartment(type) {
      this.$http.put(`departments/${this.editReference.id}`, this.department)
        .then(() => {
          this.onAdd = false;
          this.departmentsByType[type][this.editReference.index] = this.department;
        });
    },
    getText(department) {
      const hod = department.head.length ? department.head.name : 'Not assigned';
      return `HOD: ${hod}`;
    },
    departmentClicked(index, context) {
      const department = this.departmentsByType[context][index];
      this.editReference = {
        id: department.id,
        index,
      };
      this.department = department;
      this.onAdd = true;
    },

    ...mapActions({
      getDepartments: actions.getDepartments,
      addDepartment: actions.addDepartment,
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

  .department-modal-body {
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
