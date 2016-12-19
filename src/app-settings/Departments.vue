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
    </template>



</settings-box>

</template>
<script lang="babel">
import SettingsBox from './SettingsBox.vue';
import Modal from '../components/Modal.vue';

export default{
  data() {
    return {
      onAdd: false,
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
  },
  components: { SettingsBox, Modal },
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
  },
};
</script>
<style lang="scss">
    body{
    }
</style>
