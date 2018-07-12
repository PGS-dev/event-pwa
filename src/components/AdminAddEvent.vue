<template>
  <div>
    <admin-breadcrumbs>
      <h3><router-link to="/admin" replace>Admin page</router-link> > Add Event</h3>
    </admin-breadcrumbs>
    <event-form @submitted="onSubmit"></event-form>
  </div> 
</template>

<script>
import EventForm from './EventForm';
import AdminBreadcrumbs from './AdminBreadcrumbs';
import { actionTypes as eventAction } from '../store/modules/events';

export default {
  name: 'AdminAddEvent',
  components: {
    EventForm,
    AdminBreadcrumbs,
  },
  methods: {
    onSubmit(payload) {
      this.$store.dispatch(eventAction.SAVE_EVENT, payload);
      this.$router.push({ name: 'admin' });
    },
  },
};
</script>
