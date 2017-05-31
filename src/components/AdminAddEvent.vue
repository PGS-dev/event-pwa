<template>
  <event-form @submitted="onSubmit"></event-form>
</template>

<script>
  import { db } from '../firebase';
  import EventForm from './EventForm';

  export default {
    name: 'AdminAddEvent',
    components: {
      EventForm,
    },
    methods: {
      onSubmit(payload) {
        const newEventRef = db.ref(`events/${payload.id}`);
        newEventRef.set(payload)
          .then(() => {
            console.log('Event added');
          })
          .catch(() => {
            console.log('Error');
          });
        this.$router.push({ name: 'admin' });
      },
    },
  };

</script>
