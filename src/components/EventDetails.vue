<template>
  <div v-if="event">
    <div class="header">
      <h1 class="heading">Agenda</h1>
      <h2 class="title">{{ event.title }}</h2>
    </div>
    <div class="agenda" v-html="compiledMarkdown"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import marked from 'marked';
import axios from 'axios';

import { actionTypes as eventAction } from '../store/modules/events';
import { actionTypes as userActions } from '../store/modules/user';

export default {
  name: 'EventDetails',
  computed: mapState({
    event: state => state.events.selectedEvent,
    token: state => state.user.token,
    assignedTopics: state => state.user.assignedTopics,
    compiledMarkdown: state =>
      state.events.selectedEvent.agenda
        ? marked(state.events.selectedEvent.agenda, {
            gfm: true,
            tables: true,
            breaks: true,
          })
        : '',
  }),
  methods: {
    assignTopic(token) {
      const topic = this.$route.params.seoSlug;
      if (this.assignedTopics.indexOf(topic) === -1) {
        axios.get('/topicAssignment', {
          params: {
            token,
            topic,
          },
        });
        this.$store.dispatch(userActions.TOPIC_ASSIGNED, topic);
      }
    },
  },
  watch: {
    token(token) {
      this.assignTopic(token);
    },
  },
  created() {
    if (this.token && typeof this.token === 'string') {
      this.assignTopic(this.token);
    }
    this.$store.dispatch(eventAction.GET_EVENT_DETAILS);
  },
};
</script>

<style lang="scss">
.header {
  background-color: #f9f9f9;
  margin: -15px -15px 0 -15px;
  padding: 15px;
  border-bottom: 1px solid #dcdcdc;
}

.heading {
  font-size: 20px;
  margin: 0;
  color: rgba(0, 0, 0, 0.26);
}

.title {
  font-size: 24px;
  line-height: 24px;
  margin: 0;
}

.agenda {
  ul {
    list-style-type: none;
    margin: 0;
    padding: 20px 0 0 0;
    font-size: 16px;

    li {
      border-bottom: 1px solid #dcdcdc;
      padding: 8px 0;

      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>
