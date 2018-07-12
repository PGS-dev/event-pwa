<template>
  <div>
    <admin-breadcrumbs>
        <h3><router-link to="/admin" replace>Admin page</router-link> > Add Question</h3>
    </admin-breadcrumbs>
    <question-form
      :edit="false"
      @submitted="onSubmit"
    >
    </question-form>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { actionTypes as eventAction } from '../store/modules/events';
import QuestionForm from './QuestionForm';
import AdminBreadcrumbs from './AdminBreadcrumbs';

export default {
  name: 'AdminEditQuestion',
  components: {
    QuestionForm,
    AdminBreadcrumbs,
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
