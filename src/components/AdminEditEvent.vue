<template>
  <event-form :event="event" @submitted="onSubmit"></event-form>
</template>

<script>
  import { mapState } from 'vuex';
  import { db } from '../firebase';
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
        const updatedRef = db.ref(`events/${this.event.id}`);
        updatedRef.update(payload)
          .then(() => {
            console.log('Event edited');
          })
          .catch(() => {
            console.log('Error');
          });
        this.$router.push({ name: 'admin' });
      },
    },
  };

</script>

