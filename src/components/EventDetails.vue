<template>
  <div v-if="event">
    <h1 class="heading">Rejestracja</h1>
    <h2 class="title">{{ event.title }}</h2>
    <form v-on:submit.prevent="onSubmit">
      <template v-for="field in sorted(event.fields)">
        <template v-if="field.type === 'text'">
          <mdl-textfield :floating-label="field.label" :v-model="field.name" :required="field.required"></mdl-textfield>
        </template>
        <template v-if="field.type === 'email'">
          <mdl-textfield :floating-label="field.label" :v-model="field.name" type="email" :required="field.required"></mdl-textfield>
        </template>
        <template v-if="field.type === 'checkbox' && !field.values">
          <mdl-checkbox :v-model="field.name" :value="false">{{field.label}}</mdl-checkbox>
        </template>
        <div class="multichoice" v-if="field.type === 'checkbox' && field.values">
          <label>{{field.label}}</label>
          <mdl-checkbox v-for="val in toArray(field.values)" :v-model="field.name" :value="false">{{val}}</mdl-checkbox>
        </div>
      </template>
      <mdl-button class="mdl-js-ripple-effect" colored raised>Zapisz się</mdl-button>
    </form>
  </div>
</template>

<script>
import find from 'lodash/find';
import sortBy from 'lodash/sortBy';
import { db } from '../firebase';

export default {
  name: 'EventDetails',
  data() {
    return {
      event: null,
    };
  },
  methods: {
    sorted(array) {
      return sortBy(array, 'index');
    },
    toArray(string) {
      return string.split(',');
    },
    onSubmit() {
      return true;
    },
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

<style scoped lang="scss">

  .heading {
    font-size: 20px;
    margin: 0;
    color: rgba(0,0,0,.26);
  }

  .title {
    font-size: 24px;
    line-height: 24px;
    margin: 0;
  }

  .multichoice {
    margin-bottom: 15px;

    label:first-child {
      display: block;
    }

    .mdl-checkbox {
      display: inline-block;
      width: auto;
      margin-right: 15px;
    }

    .mdl-checkbox__label {
      font-size: 14px;
    }
  }

</style>
