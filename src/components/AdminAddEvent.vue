<template>
  <event-form @submitted="onSubmit"></event-form>
</template>

<script>
import EventForm from './EventForm';
import { actionTypes as eventAction } from '../store/modules/events';

export default {
  name: 'AdminAddEvent',
  components: {
    EventForm,
  },
  methods: {
    onSubmit(payload) {
      this.$store.dispatch(eventAction.SAVE_EVENT, payload);
      this.$router.push({ name: 'admin' });
    },
  },
};

</script>
