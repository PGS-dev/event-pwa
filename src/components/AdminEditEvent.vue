<template>
  <div>
    <admin-breadcrumbs>
      <h3><router-link to="/admin" replace>Admin page</router-link> > Edit Event</h3>
    </admin-breadcrumbs>
    <event-form
      v-if="event.title"
      :event="event"
      @submitted="onSubmit"
    >
    </event-form>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { actionTypes as eventAction } from '../store/modules/events';
import EventForm from './EventForm';
import AdminBreadcrumbs from './AdminBreadcrumbs';

export default {
  name: 'AdminEditEvent',
  components: {
    EventForm,
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
      this.$store.dispatch(eventAction.EDIT_EVENT, payload);
      this.$router.push({ name: 'admin' });
    },
  },
};
</script>
