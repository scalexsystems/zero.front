<template>
    <settings-box title="Semesters">

        <template slot="actions">
            <div role="button" class="btn btn-primary" @click="showAddSemester"> Add new semester </div>
        </template>


        <template slot="header-image">
            <img src="../assets/settings/semesters.svg">
        </template>

        <template slot="name">
            Semesters
        </template>

        <template slot="description">
            e.g. Odd/Even, Summer, Winter, etc
        </template>

        <template slot="settings-body">
            <modal name="Add new semesters" :show="onAdd">
                <div class="semester-modal-header">
                    <div class="header-wrapper">
                        <div class="semester-modal-title"> Add New Semester </div>
                    </div>
                </div>
                <div class="semester-modal-body">
                    <input-text title="Name of the discipline" required v-model="semester.name" :feedback="errors.name"></input-text>
                </div>


                <div class="card-footer bg-white pt-2 pb-1">
                    <a role="button" class="btn btn-secondary btn-cancel" tabindex @click="onCancel">Cancel</a>
                    <a role="button" class="btn btn-primary" tabindex @click="onSubmit">Save</a>
                </div>
            </modal>
            <div class="container py-2">
                <div class="row my-2">
                    <settings-card class="col-xs-12 col-lg-6" v-for="(semester, index) in semesters" :title="semester.name"
                                   :text="semester.short_name" @cardClicked="semesterClicked">
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
    if (this.semesters.length === 0) {
      this.getSemesters();
    }
  },
  data() {
    return {
      onAdd: false,
      loaded: false,
      semester: {
        name: '',
      },
      editReference: {
        id: false,
        index: false,
      },
      errors: {},
    };
  },
  computed: {
    ...mapGetters({
      semesters: getters.semesters,
    }),
  },
  components: { SettingsBox, Modal, SettingsCard },
  methods: {
    showAddSemester() {
      this.onAdd = true;
    },
    onCancel() {
      this.onAdd = false;
    },
    onSubmit() {
      const call = this.editReference.id ? 'updateSemester' : 'addNewSemester';
      this[call]();
      this.editReference = {
        id: false,
        index: false,
      };
    },
    addNewSemester() {
      this.$http.post('semesters', this.semester)
      .then(() => {
        this.onAdd = false;
        this.semesters.push(this.semester);
        this.addSemester(this.semester);
      })
      .catch(() => {});
    },
    updateSemester() {
      this.$http.put(`semesters/${this.editReference.id}`, this.semester)
      .then(() => {
        this.onAdd = false;
        this.semesters[this.editReference.index] = this.semester;
      });
    },
    semesterClicked(index) {
      const semester = this.semesters[index];
      this.editReference = {
        id: semester.id,
        index,
      };
      this.semester = semester;
      this.onAdd = true;
    },
    ...mapActions({
      getSemesters: actions.getSemesters,
      addSemester: actions.addSemester,
    }),
  },
};
</script>
<style lang="scss" scoped>
    @import '../styles/variables';
    @import '../styles/methods';
    .semester-modal-body {
        color: white;
    }
    .semester-modal-title {
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
