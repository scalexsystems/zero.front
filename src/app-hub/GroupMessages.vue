<template>
<div>
  <message-box v-if="context"
               :title="context.name"
               :subtitle="context.bio"
               :photo="context.photo">
    <message-list :messages="context.messages" :loading="loading" :all-loaded="allLoaded"
                  @load-more="loadMore()" @seen="markMessagesSeen"></message-list>

    <message-editor slot="footer" ref="input" v-model="message" :disabled="disabled" @send="send"
                    @focused="markMessagesSeen"></message-editor>
  </message-box>

  <loading-placeholder v-else></loading-placeholder>
</div>
</template>

<script lang="babel">
import first from 'lodash/first';
import each from 'lodash/each';
import isNull from 'lodash/isNull';
import int from 'lodash/toInteger';
import { mapActions, mapGetters } from 'vuex';
import { MessageBox, MessageEditor, LoadingPlaceholder } from '../components';
import { GET_GROUP_MESSAGES, SEND_GROUP_MESSAGE_READ_RECEIPT, GET_GROUPS } from './vuex/action-types';
import { ADD_GROUP_MESSAGE } from './vuex/mutation-types';
import MessageList from './components/MessagePane.vue';

export default {
  name: 'Group',
  components: {
    MessageBox,
    MessageList,
    MessageEditor,
    LoadingPlaceholder,
  },
  computed: {
    context() {
      const route = this.$route;
      const groupMap = this.groupMap;
      const groups = this.groups;

      const id = int(route.params.group);
      const index = groupMap[id];
      const group = groups[index];

      return group;
    },
    groupMap() {
      return this.$store.state.hub.groupMap;
    },
    ...mapGetters({
      groups: 'hubGroups',
    }),
  },
  created() {
    this.findGroup();
  },
  data() {
    return {
      message: '',
      disabled: false,
      loading: false,
      allLoaded: false,
    };
  },
  methods: {
    send() {
      this.disabled = true;
      this.$http.post(`groups/${this.context.id}/messages`, { content: this.message })
              .then(response => response.json())
              .then((result) => {
                this.message = '';
                this.disabled = false;
                this.$store.commit(ADD_GROUP_MESSAGE, {
                  group: this.context.id,
                  messages: [result],
                  prepend: false,
                });
                this.$refs.input.resize();
                this.$refs.input.focus();
              })
              .catch(() => {
                this.disabled = false;
              });
    },
    findGroup() {
      const id = int(this.$route.params.group);

      if (!(id in this.groupMap)) {
        this.$debug('GETTING IT BITCH');
        this.getGroups({ q: id });
      }
    },
    loadMore() {
      this.loading = true;
      this.getMessages({ group: this.context.id, params: {} }).then((result) => {
        this.loading = false;

        if (result.data.length) {
          this.$nextTick(() => {
            const message = first(this.context.messages);

            if (message && isNull(message.read_at)) {
              this.loadMore();
            }
          });
        }
      });
    },
    markMessagesSeen() {
      window.setTimeout(() => {
        const messages = this.context.messages.filter(message => message.unread);
        each(messages, message => this.readMessage({ group: this.context.id, message }));
      }, 1000);
    },
    ...mapActions({
      getGroups: GET_GROUPS,
      readMessage: SEND_GROUP_MESSAGE_READ_RECEIPT,
      getMessages: GET_GROUP_MESSAGES,
    }),
  },
  watch: {
    $route() {
      this.findGroup();
    },
    context(group) {
      if (!group.messages.length) {
        this.loadMore();
      }
    },
  },
};
</script>


<style lang="scss">

</style>
