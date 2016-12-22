<template>
    <settings-box title="Disciplines">

        <template slot="actions">
            <div role="button" class="btn btn-primary" @click="addDiscipline"> Add new disciplines </div>
        </template>


        <template slot="settings-body">

            <modal name="Add new disciplines" :show="onAdd">
                <input-text title="Name of the discipline" required v-model="discipline.name" :feedback="errors.name"></input-text>
                <input-text title="Discipline Acronym" v-model="discipline.acronym" :feedback="errors.acronym"></input-text>

                <div class="card-footer bg-white pt-2 pb-1">
                    <a role="button" class="btn btn-secondary btn-cancel" tabindex @click="onCancel">Cancel</a>
                    <a role="button" class="btn btn-primary" tabindex @click="onSubmit">Save</a>
                </div>
            </modal>

            <settings-card v-for="(discipline, index) in disciplines" :title="discipline.name"
                           :text="discipline.acronym" :additional="true">
            </settings-card>
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
    if (this.disciplines.length === 0) {
      this.getDisciplines();
    }
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
    ...mapGetters({
      disciplines: getters.disciplines,
    }),
  },
  components: { SettingsBox, Modal, SettingsCard },
  methods: {
    addDiscipline() {
      this.onAdd = true;
    },
    onCancel() {
      this.onAdd = false;
    },
    onSubmit() {
      this.$http.post('disciplines', this.department)
        .then(response => response.json())
        .then(() => {})
        .catch(() => {});
    },
    ...mapActions({
      getDisciplines: actions.getDisciplines,
    }),
  },
};
</script>
<style lang="scss">
    body{
    }
</style>
