<template>
<activity-box title="Add new group" subtitle="Make group to coverse better." :enable-topbar="true" :show="true">
  <template slot="topbar">
  <a class="btn btn-primary" href="#" @click.prevent.stop="createGroup" ref="action">
    Create Group
  </a>
  </template>

  <div class="container py-1">
    <div class="my-2 text-xs-center">
    </div>
    <div class="row">
      <div class="col-xs-12 col-lg-8 offset-lg-2">
        <input-text title="Name of the group" required v-model="group.name" :feedback="errors.name"></input-text>
      </div>
      <div class="col-xs-6 col-lg-8 offset-lg-2">
        <input-radio title="Group Type" required v-model="group.type" :options="groupTypes"
                     :feedback="errors.type"></input-radio>
      </div>
      <div class="col-xs-6 col-lg-8 offset-lg-2">
        <input-textarea title="Description" v-model="group.description" :feedback="errors.description"></input-textarea>
      </div>
    </div>
  </div>
</activity-box>
</template>

<script lang="babel">
import Validator from 'Validator';

import { ActivityBox } from '../components';
import { isValidationException, normalizeValidationErrors as normalize } from '../util';

export default {
  name: 'GroupCreate',
  components: { ActivityBox },
  data() {
    return {
      group: {
        name: '',
        type: 'public',
        description: '',
      },
      errors: {},
    };
  },
  computed: {
    groupTypes() {
      return {
        public: 'Public',
        private: 'Private',
      };
    },
  },
  methods: {
    createGroup() {
      if (!this.validate()) {
        return;
      }

      this.$refs.action.classList.add('disabled');
      this.$http.post('groups', this.group)
              .then(response => response.json())
              .then((result) => {
                this.$refs.action.classList.remove('disabled');
                this.$router.push({ name: 'hub.group', params: { group: result.id } });

                return result;
              })
              .catch((response) => {
                this.$refs.action.classList.remove('disabled');
                if (isValidationException(response)) {
                  response.json().then(result => this.$set(this, 'errors', normalize(result.errors)));
                }

                return response;
              });
    },
    validate() {
      const v = Validator.make(this.group, {
        name: 'required|min:3|max:60',
        type: 'required',
        description: 'required',
      });

      if (v.fails()) {
        this.$set(this, 'errors', normalize(v.getErrors()));

        return false;
      }

      this.$set(this, 'errors', {});

      return true;
    },
  },
};
</script>

<style lang="scss">
</style>
