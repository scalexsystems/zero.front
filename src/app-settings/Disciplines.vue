<template>
    <settings-box title="Disciplines">

        <template slot="actions">
            <div role="button" class="btn btn-primary" @click="addDiscipline"> Add new disciplines </div>
        </template>


        <template slot="header-image">
            <img src="../assets/settings/discipline.svg">
        </template>

        <template slot="name">
            Semesters
        </template>

        <template slot="description">
            e.g. B.Tech, M.Tech, MBA, B.E, M.E, etc
        </template>

        <template slot="settings-body">
            <modal name="Add new disciplines" :show="onAdd">
                <div class="discipline-modal-header">
                    <div class="header-wrapper">
                        <div class="discipline-modal-title"> Add New Discipline </div>
                    </div>
                </div>
                <div class="discipline-modal-body">
                    <input-text title="Name of the discipline" required v-model="discipline.name" :feedback="errors.name"></input-text>
                    <input-text title="Discipline Acronym" v-model="discipline.acronym" :feedback="errors.acronym"></input-text>
                </div>


                <div class="card-footer bg-white pt-2 pb-1">
                    <a role="button" class="btn btn-secondary btn-cancel" tabindex @click="onCancel">Cancel</a>
                    <a role="button" class="btn btn-primary" tabindex @click="onSubmit">Save</a>
                </div>
            </modal>
            <div class="container py-2">
                <div class="row my-2">
                    <settings-card class="col-xs-12 col-lg-6" v-for="(discipline, index) in disciplines" :title="discipline.name"
                                   :text="discipline.acronym">
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
<style lang="scss" scoped>
@import '../styles/variables';
@import '../styles/methods';
.discipline-modal-body {
        color: white;
}
.discipline-modal-title {
    font-size: 1.28571rem;
    padding: rem(20px) 0;
    color: $brand-primary;
    width: rem(550px);
    margin: 0;
}
.card-footer {
    background-color: inherit;
    padding: 0
}
</style>
