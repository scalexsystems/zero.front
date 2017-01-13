<template>
  <settings-box title="Course Manager/Administrator">

        <template slot="actions">
            <div role="button" class="btn btn-default" @click=""> Cancel </div>
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
                    <input-search class="form-control" title="" v-model="query" v-bind="{suggestions}" @suggest="onSuggest"
                                  @select="onSelect"></input-search>
                </div>
            </div>

            <div class="col-xs-12 col-lg-8 offset-lg-2 manager-list">
                <div class="row">
                    <div class="col-xs-12 col-lg-6" v-for="(manager, index) of managers">
                        <item-card :item="manager"
                                   @open="openMemberProfile(manager, index)"></item-card>
                    </div>
                </div>
            </div>

        </template>



    </settings-box>

</template>
<script lang="babel">
import { mapActions, mapGetters } from 'vuex';
import throttle from 'lodash/throttle';
import SettingsBox from './SettingsBox.vue';
import SettingsCard from './SettingsCard.vue';
import Modal from '../components/Modal.vue';
import { actions, getters } from '../vuex/meta';
import { PersonCard as ItemCard } from '../components';

export default{
  created() {
    if (this.managers.length === 0) {
      this.getManagers();
    }
  },
  data() {
    return {
      loaded: false,
      errors: {},
      managers: [],
      query: '',
      addedManagers: [],
    };
  },
  computed: {
    suggestions() {
      return [
        ...this.teachers,
        ...this.employees,
      ];
    },
    ...mapGetters({
      teachers: getters.teachers,
      employees: getters.employees,
    }),
  },
  components: { SettingsBox, Modal, SettingsCard, ItemCard },
  methods: {
    getManagers() {
      this.$http.get('people/roles/course-manager')
        .then((response) => {
          this.managers = response.body.data;
        });
    },
    onSuggest: throttle(function onSuggest({ value, start, end }) {
      start();
      this.getTeachers({ q: value }).then(end);
    }, 400),
    search() {},
    ...mapActions({
      getTeachers: actions.getTeachers,
    }),
    onSelect(teacher) {
      if (this.addedManagers.indexOf(teacher.id) < 0) {
        this.addedManagers.push(teacher);
        this.managers.push(teacher);
      }
    },
    onSave() {
      const managers = this.addedManagers;
      this.$http.post('people/roles/course-manager', { managers })
        .then(() => {
        });
    },
    ...mapActions({
      addManager: actions.addManager,
    }),
  },
};
</script>
<style lang="scss" scoped>
@import '../styles/variables';
@import '../styles/methods';
.btn-default{
  border: solid 1px $gray;
  }
.btn {
  margin: 0 rem(10px);
  width: rem(80px);
}

.manager-list {
  padding: rem(20px) 0;
}

</style>
