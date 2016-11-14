<template>
<div>
  <message-box v-if="context"
               :title="context.name"
               :subtitle="context.bio"
               :photo="context.photo">
    <message-list :messages="context.messages" :loading="loading" :all-loaded="allLoaded"
                  @load-more="loadMore" @seen="markMessagesSeen"></message-list>

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
import { GET_USER_MESSAGES, SEND_USER_MESSAGE_READ_RECEIPT, GET_USERS } from './vuex/action-types';
import { ADD_USER_MESSAGE } from './vuex/mutation-types';
import MessageList from './components/MessagePane.vue';

export default {
  name: 'UserMessages',
  components: {
    MessageBox,
    MessageList,
    MessageEditor,
    LoadingPlaceholder,
  },
  computed: {
    context() {
      const route = this.$route;
      const userMap = this.userMap;
      const users = this.users;

      const id = int(route.params.user);
      const index = userMap[id];
      const user = users[index];

      if (!user) window.setTimeout(() => this.findUser(), 0);

      return user;
    },
    userMap() {
      return this.$store.state.hub.userMap;
    },
    ...mapGetters({ users: 'hubUsers' }),
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
      this.$http.post(`me/messages/users/${this.context.id}`, { content: this.message })
              .then(response => response.json())
              .then((result) => {
                this.$store.commit(ADD_USER_MESSAGE, {
                  user: this.context.id,
                  messages: [result],
                  prepend: false,
                });
                this.$refs.input.resize();
                this.$refs.input.focus();
              })
              .catch(response => response);
      this.message = '';
    },
    loadMore(loader) {
      this.getMessages({ user: this.context.id, params: {} })
              .then((response) => {
                if ('ok' in response) throw response;

                return response;
              })
              .then((result) => {
                if (result.data.length) {
                  const message = first(this.context.messages);

                  if (message && isNull(message.read_at)) {
                    this.loadMore(loader);
                    return;
                  }
                }

                const paginator = result._meta.pagination;

                if (paginator.current_page < paginator.total_pages) {
                  loader.done();
                } else {
                  loader.end();
                }
              })
              .catch(() => loader.error());
    },
    markMessagesSeen() {
      window.setTimeout(() => {
        const messages = this.context.messages.filter(message => message.unread);
        each(messages, message => this.readMessage({ user: this.context.id, message }));
      }, 1000);
    },
    findUser() {
      if (!(this.$route.params.user in this.userMap)) {
        this.getUsers({ id: this.$route.params.user, ignore: true });
      }
    },
    ...mapActions({
      getUsers: GET_USERS,
      readMessage: SEND_USER_MESSAGE_READ_RECEIPT,
      getMessages: GET_USER_MESSAGES,
    }),
  },
  watch: {
    $route: 'findUser',
  },
};
</script>


<style lang="scss">

</style>
