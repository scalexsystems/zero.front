<template>
<div>
  <message-box v-if="context"
               :title="context.name"
               subtitle="Click here to open group information"
               :photo="context.photo"
               type="group"
               @openSubtitle="openTitle"
               @openPhoto="openTitle"
               @openTitle="openTitle">
    <message-list :messages="context.messages"
                  @load-more="loadMore"
                  @seen="markMessagesSeen"></message-list>

    <message-editor slot="footer" ref="input" v-model="message" :dest="`groups/${context.id}/attachment`"
      @send="send" @focused="markMessagesSeen">
    </message-editor>
  </message-box>

  <loading-placeholder v-else></loading-placeholder>
</div>
</template>

<script lang="babel">
import last from 'lodash/last';
import each from 'lodash/each';
import int from 'lodash/toInteger';
import { mapActions, mapGetters } from 'vuex';

import { httpThen } from '../util';
import { MessageBox, MessageEditor, LoadingPlaceholder, FileUploader } from '../components';
import { getters, actions } from './vuex/meta';
import MessageList from './components/MessagePane.vue';

export default {
  name: 'Group',
  components: {
    MessageBox,
    MessageList,
    MessageEditor,
    LoadingPlaceholder,
    FileUploader,
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
    ...mapGetters({
      groups: getters.groups,
      groupMap: getters.groupMap,
    }),
  },
  created() {
    this.findGroup();
  },
  data() {
    return {
      message: '',
    };
  },
  methods: {
    send(content, attachments = [], errors = []) {
      this.sendMessage({ groupId: this.context.id, content, errors, params: { attachments } });
      this.message = '';
      const key = `group.${this.context.id}.message`;
      if (key in window.localStorage) {
        window.localStorage.removeItem(key);
      }
      this.$refs.input.resize();
      this.$refs.input.focus();
    },
    openTitle() {
      this.$router.push({ name: 'hub.group-preview' });
    },
    findGroup() {
      const id = int(this.$route.params.group);

      if (!(id in this.groupMap)) {
        this.getGroups({ q: id });
      }
    },
    loadMore(loader) {
      if (!this.context) {
        loader.done();
        return;
      }
      this.getMessages({ groupId: this.context.id })
              .then(httpThen)
              .then((result) => {
                const paginator = result._meta.pagination;

                if (paginator.current_page < paginator.total_pages) {
                  const message = last(result.data);

                  if (message && message.unread === true) {
                    this.loadMore(loader);
                    return;
                  }
                }

                if (paginator.current_page < paginator.total_pages) {
                  loader.done();
                } else {
                  loader.end();
                }
              })
              .catch(response => response);
    },
    markMessagesSeen(payload = null) {
      const groupId = this.context.id;
      if (payload !== null) {
        this.readMessage({ groupId, message: payload });
        return;
      }

      const messages = this.context.messages.filter(message => message.unread);
      each(messages, message => this.readMessage({ groupId, message }));
    },
    ...mapActions({
      getGroups: actions.getGroups,
      getMessages: actions.getMessagesFromGroup,
      readMessage: actions.sendMessageReadReceiptForGroup,
      sendMessage: actions.sendMessageToGroup,
    }),
  },
  watch: {
    $route(to, from) {
      if (this.message.trim().length) {
        const key = `group.${from.params.group}.message`;

        window.localStorage.setItem(key, this.message);
      }

      const key = `group.${to.params.group}.message`;

      this.message = window.localStorage.getItem(key) || '';

      return this.findGroup();
    },
  },
  beforeRouteEnter(to, from, next) {
    const key = `group.${to.params.group}.message`;

    if (key in window.localStorage) {
      next(vm => vm.$set(vm, 'message', window.localStorage.getItem(key)));
    } else {
      next(vm => vm.$set(vm, 'message', ''));
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.message.trim().length) {
      const key = `group.${this.context.id}.message`;

      window.localStorage.setItem(key, this.message);
    }

    next();
  },
};
</script>
