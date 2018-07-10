<template>
  <question-form
    :edit="false"
    @submitted="onSubmit"
  >
  </question-form>
</template>

<script>
import { mapState } from 'vuex';
import { actionTypes as eventAction } from '../store/modules/events';
import QuestionForm from './QuestionForm';

export default {
  name: 'AdminEditQuestion',
  components: {
    QuestionForm,
  },
  computed: mapState({
    event: state => state.events.selectedEvent,
  }),
  created() {
    this.$store.dispatch(eventAction.GET_EVENT_DETAILS);
  },
  methods: {
    onSubmit(payload) {
      this.$store.dispatch(eventAction.SAVE_QUESTION, payload);
      this.$router.push({ name: 'adminQuestions' });
    },
  },
};
</script>
