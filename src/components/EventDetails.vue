<template>
  <div v-if="event">
    <h1>{{ event.title }}</h1>
    <form>
      <template v-for="field in event.fields">
        <template v-if="field.type === 'text'">
          <mdl-textfield :floating-label="field.label" :v-model="field.name"></mdl-textfield>
        </template>
        <template v-if="field.type === 'checkbox'">
          <mdl-checkbox :v-model="field.name">{{field.label}}</mdl-checkbox>
        </template>
      </template>
    </form>
  </div>
</template>

<script>
import find from 'lodash/find';
import { db } from '../firebase';

export default {
  name: 'EventDetails',
  data() {
    return {
      event: null,
    };
  },
  created() {
    const events = db.ref('events');
    const selectedSeoSlug = this.$route.params.seoSlug;
    const self = this;

    events.on('value', (snapshot) => {
      self.event = find(snapshot.val(), item => item.seoSlug === selectedSeoSlug);
    });
  },
};

</script>
