<template>
<div class="group-messages-wrapper">
  <message-box v-if="context"
               :title="context.name"
               subtitle="Click here to open group information"
               :photo="context.photo"
               type="group"
               @openSubtitle="openTitle"
               @openPhoto="openTitle"
               @openTitle="openTitle">
    <message-list :messages="context.messages"
                  @load-more="getOlderMessages"
                  @seen="markMessagesSeen" ref="messages"></message-list>

    <message-editor slot="footer" ref="input" v-model="message" :dest="`groups/${context.id}/attachment`"
      @send="send" @focused="markMessagesSeen">
    </message-editor>
  </message-box>

  <loading-placeholder v-else></loading-placeholder>
</div>
</template>

<script lang="babel">
import groupHelper from './mixins/group';

export default {
  name: 'Course',
  methods: {
    openTitle() {
      this.$router.push({ name: 'acad.course-preview' });
    },
  },
  mixins: [groupHelper],
  computed: {
    groupId() {
      return int(this.$route.params.group);
    },
  },
};
</script>
