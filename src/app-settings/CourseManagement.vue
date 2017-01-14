<template>
  <settings-box title="Course Manager/Administrator">

        <template slot="actions">
            <div role="button" class="btn btn-default" @click="onCancel"> Cancel </div>
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

            <div class="col-xs-12 col-lg-8 offset-lg-2 search-wrapper">
                <div class="input-group input-group-lg">
                    <input-search class="form-control teacher-search" title="" v-model="query" v-bind="{suggestions}" @suggest="onSuggest"
                                  @select="onSelect"></input-search>
                </div>

            <div class="manager-list">
                <div class="row">
                    <div class="col-xs-12 col-lg-6" v-for="(manager, index) of managers">
                        <item-card :item="manager"
                                   @open="openMemberProfile(manager, index)">
                            <div class="person-card-bio" v-if="!manager.bio"> Profile not updated </div>
                        </item-card>
                    </div>
                </div>
            </div>
            </div>

        </template>



    </settings-box>

</template>
<script lang="babel">
import { mapActions, mapGetters } from 'vuex';
import { throttle, difference } from 'lodash';
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
      suggestions: getters.teachers,
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
    onSelect(person) {
      if (this.managers.indexOf(person.id) < 0) {
        this.addedManagers.push(person);
        this.managers.push(person);
      }
    },
    onSave() {
      const managers = this.addedManagers;
      if (managers.length) {
        this.$http.post('people/roles/course-manager', { managers })
        .then(() => {
          this.addedManagers = [];
        });
      }
    },
    onCancel() {
      if (this.addedManagers.length > this.managers.length) {
        this.managers = difference(this.addedManagers, this.managers);
        this.addedManagers = [];
      }
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

.person-card-bio {
    flex: 1;
    font-size: 0.85714rem;
    color: $gray;
}

.teacher-search {
   border: 0;
   padding: 0;
}

.search-wrapper {
   padding: 0;
}

</style>
