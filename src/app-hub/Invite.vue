<template>
    <settings-box title="Invites">

        <template slot="header-image">
            <img src="../assets/settings/invites.svg">
        </template>

        <template slot="name">
            Send Invites
        </template>

        <template slot="description">
            Invite students, teachers and employees of the institute
        </template>

        <template slot="settings-body">
            <div class="container py-2">
                <div class="row my-2">
                    <div class="col-xs-12 col-lg-12">
                        <div class="fl fl-middle">
                            <hr class="fl-auto">
                            <small class="px-1 text-uppercase">
                                Invite Students
                            </small>
                            <hr class="fl-auto">
                        </div>


                        <div class="invite-input input-group input-group-lg">
                        <input class="form-control" type="text" v-model="students">
                    </div>

                <div class="row">
                  <div class="col-xs-12 col-lg-8 text-muted">
                     An invite will be sent to all students via this list

                  </div>
                  <div class="col-xs-12 col-lg-4 text-muted text-lg-right">
                  {{ invited.students }} invited
                  </div>
                </div>
                    <div class="invite-actions">
                        <div class="btn btn-default" role="button"> Cancel </div>
                        <div class="btn btn-primary" role="button" @click="sendStudentsInvite"> Send Invite  </div>
                    </div>
                  </div>
                </div>
                <div class="row my-2">
                    <div class="col-xs-12 col-lg-12">
                        <div class="fl fl-middle">
                            <hr class="fl-auto">
                            <small class="px-1 text-uppercase">
                                Invite Teachers
                            </small>
                            <hr class="fl-auto">
                        </div>

                        <div class="invite-input input-group input-group-lg">
                        <input class="form-control" type="text" v-model="teachers">
                    </div>

                <div class="row">
                  <div class="col-xs-12 col-lg-8 text-muted">
                     An invite will be sent to all teachers via this list

                  </div>
                  <div class="col-xs-12 col-lg-4 text-muted text-lg-right">
                  {{ invited.teachers }} invited
                  </div>
                </div>
                    <div class="invite-actions">
                        <div class="btn btn-default" role="button"> Cancel </div>
                        <div class="btn btn-primary" role="button" @click="sendTeachersInvite"> Send Invite  </div>
                    </div>
                  </div>
                </div>
                <div class="row my-2">
                    <div class="col-xs-12 col-lg-12">
                        <div class="fl fl-middle">
                            <hr class="fl-auto">
                            <small class="px-1 text-uppercase">
                                Invite Non-Teaching Employees
                            </small>
                            <hr class="fl-auto">
                        </div>

                        <div class="invite-input input-group input-group-lg">
                        <input class="form-control" type="text" v-model="employees">
                    </div>

                <div class="row">
                  <div class="col-xs-12 col-lg-8 text-muted">
                     An invite will be sent to all employees via this list

                  </div>
                  <div class="col-xs-12 col-lg-4 text-muted text-lg-right">
                  {{ invited.employees }} invited
                  </div>
                </div>
                    <div class="invite-actions">
                        <div class="btn btn-default" role="button"> Cancel </div>
                        <div class="btn btn-primary" role="button" @click="sendEmployeesInvite"> Send Invite  </div>
                    </div>
                  </div>
                </div>
            </div>
        </template>
    </settings-box>

</template>
<script lang="babel">
import SettingsBox from './SettingsBox.vue';

export default{
  created() {
  },
  data() {
    return {
      onAdd: false,
      loaded: false,
      students: '',
      teachers: '',
      employees: '',
      invited: {
        students: 0,
        teachers: 0,
        employees: 0,
      },
      errors: {},
    };
  },
  computed: {
  },
  methods: {
    sendStudentsInvite() {
      this.sendInvite('students');
    },

    sendTeachersInvite() {
      this.sendInvite('teachers');
    },

    sendEmployeesInvite() {
      this.sendInvite('employees');
    },

    sendInvite(type) {
      const emails = this[type];
      if (emails) {
        const entries = this.getArrayFromString(this[type]);
        this.$http.post(`people/${type}/invite`, { [type]: entries })
         .then(() => {
           this.invited[type] += entries.length;
           this[type] = '';
         });
      }
    },

    getArrayFromString(string) {
      return string.split(new RegExp([' ', '///,', ';'].join('|'), 'g')).filter(email => email !== '');
    },
  },
  components: { SettingsBox },
};
</script>
<style lang="scss" scoped>
@import '../styles/methods';
@import '../styles/variables';
.invite {
  &-input {
   padding: rem(20px) 0 rem(10px);
 }

  &-actions {
   padding: rem(20px) 0;
  }

}
.btn-default{
  border: solid 1px $gray;
}
.btn {
  margin: 0 rem(2px);
  width: rem(100px);
}

</style>
