<template>
  <event-form
    v-if="event.title"
    :event="event"
    @submitted="onSubmit"
  >
  </event-form>
</template>

<script>
import { mapState } from 'vuex';
import { actionTypes as eventAction } from '../store/modules/events';
import EventForm from './EventForm';

export default {
  name: 'AdminEditEvent',
  components: {
    EventForm,
  },
  computed: mapState({
    event: state => state.events.selectedEvent,
  }),
  created() {
    this.$store.dispatch(eventAction.GET_EVENT_DETAILS);
  },
  methods: {
    onSubmit(payload) {
      this.$store.dispatch(eventAction.EDIT_EVENT, payload);
      this.$router.push({ name: 'admin' });
    },
  },
};
</script>
