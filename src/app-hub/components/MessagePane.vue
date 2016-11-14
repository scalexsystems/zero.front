<template>
<div class="message-list-container" @click.prevent.stop="$emit('seen')">
  <div class="message-list-load-more text-xs-center" v-if="!hideLoadButton">
    <a href="#" class="btn btn-secondary" @click.prevent.stop="loadMore"
       :disabled="loading">
      <i class="fa fa-fw fa-spin fa-circle-o-notch" v-if="loading"></i> load more </a>
  </div>

  <!--<infinite-loading :on-infinite="loadMore" ref="infinite" :distance="0"></infinite-loading>-->

  <div v-if="messages.length" v-for="(message, index) of messages" key="id" class="message-list-item">
    <date-separator v-if="isDateChangingAt(message, index)" :date="message.received_at"
                    :unread="message.id === unread.id" :count="unread.count"></date-separator>
    <template v-else>
    <new-separator v-if="message.id === unread.id" :count="unread.count"></new-separator>
    </template>
    <div :is="decorator(message, index)" :message="message"></div>
  </div>
</div>
</template>

<script lang="babel">
import moment from 'moment';
import last from 'lodash/last';
import first from 'lodash/first';
import InfiniteLoading from 'vue-infinite-loading';

import Message from './message/Message.vue';
import ContinuedMessage from './message/ContinuedMessage.vue';
import DateSeparator from './separator/DateSeparator.vue';
import NewSeparator from './separator/NewSeparator.vue';

export default {
  props: {
    messages: {
      required: true,
    },
  },
  components: { Message, ContinuedMessage, DateSeparator, NewSeparator, InfiniteLoading },
  computed: {
    unread() {
      const messages = this.messages;
      const firstUnread = first(messages.filter(message => message.unread));

      if (firstUnread) {
        return { id: firstUnread.id, count: messages.length - messages.indexOf(firstUnread) };
      }

      return { id: undefined, count: 0 };
    },
  },
  created() {
    this.loadMore();
  },
  data() {
    return {
      loading: false,
      skipScroll: false,
      hideLoadButton: false,
    };
  },
  methods: {
    decorator(message, index) {
      let type = 'message';

      if (message._type === 'image') {
        type = message._type;
      }

      if (index < 1 || this.isDateChangingAt(message, index) || message.id === this.unread.id) {
        return type;
      }

      const prevMessage = this.messages[index - 1];

      if (message.sender.id === prevMessage.sender.id
              && moment(message.received_at).diff(moment(prevMessage.received_at), 'minutes') < 2) {
        return `continued-${type}`;
      }

      return type;
    },
    isDateChangingAt(message, index) {
      if (index === 0) return true;

      const prevMessage = this.messages[index - 1];

      return !moment(message.received_at).isSame(moment(prevMessage.received_at), 'day');
    },
    loadMore() {
      this.skipScroll = true;
      this.loading = true;

      const done = () => {
        this.loading = false;
//        this.$refs.infinite.$emit('$InfiniteLoading:loaded');
      };
      const end = () => {
        this.hideLoadButton = true;
//        this.$refs.infinite.$emit('$InfiniteLoading:complete');
      };

      this.$emit('load-more', { done, end, error: end });
    },
  },
  watch: {
    messages() {
      const skip = this.skipScroll;
      this.skipScroll = true;

      if (skip !== true) {
        this.$nextTick(() => last(this.$el.children).scrollIntoView(true));
      }
    },
  },
};
</script>


<style lang="scss">
.message-list-container {
  padding: 1rem 1.714rem;
  flex: 1;
  min-height: calc(100% - 5rem);

  justify-content: flex-end;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap-reverse;
}
</style>
