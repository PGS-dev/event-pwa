<template>
  <div v-if="event">
    <div class="header">
      <h1 class="heading">Rejestracja</h1>
      <h2 class="title">{{ event.title }}</h2>
    </div>
    <div class="success" v-if="successMessage">{{successMessage}}</div>
    <div class="error" v-if="errorMessage">{{errorMessage}}</div>
    <form v-on:submit.prevent="onSubmit" v-if="!formSent">
      <template v-for="field in sorted(event.fields)">
        <template v-if="field.type === 'text'">
          <mdl-textfield :floating-label="field.label" v-model="form[field.name]" :required="field.required"></mdl-textfield>
        </template>
        <template v-if="field.type === 'email'">
          <mdl-textfield :floating-label="field.label" v-model="form[field.name]" type="email" :required="field.required"></mdl-textfield>
        </template>
        <template v-if="field.type === 'checkbox' && !field.values">
          <mdl-checkbox v-model="form[field.name]" :value="false">{{field.label}}</mdl-checkbox>
        </template>
        <div class="multichoice" v-if="field.type === 'checkbox' && field.values">
          <label>{{field.label}}</label>
          <mdl-checkbox v-for="(val, n) in toArray(field.values)" :val="val" :id="indexId(n)" type="checkbox" v-model="form[field.name]">{{val}}</mdl-checkbox>
        </div>
      </template>
      <mdl-button class="mdl-js-ripple-effect submit-btn" colored raised>Zapisz się</mdl-button>
    </form>
  </div>
</template>

<script>
import sortBy from 'lodash/sortBy';
import { db } from '../firebase';

export default {
  name: 'EventDetailsForm',
  data() {
    return {
      event: null,
      errorMessage: null,
      successMessage: null,
      formSent: false,
      form: {
        interests: [], // TODO how to make multiple checkbox work without this default value
      },
    };
  },
  methods: {
    sorted(array) {
      return sortBy(array, 'index');
    },
    toArray(string) {
      return string.split(',');
    },
    indexId(num) {
      return `id-${num.toString()}`;
    },
    onSubmit() {
      const self = this;

      db.ref('attendees').push(this.form, (error) => {
        if (error) {
          self.errorMessage = error.code;
          return;
        }

        self.successMessage = 'Dziękujemy za rejestrację!';
        self.formSent = true;
      });
    },
  },
  created() {
    const selectedSeoSlug = this.$route.params.seoSlug;
    const self = this;
    const eventRef = db.ref('events').orderByChild('seoSlug').equalTo(selectedSeoSlug);

    eventRef.on('child_added', (snapshot) => {
      self.event = snapshot.val();
      self.form.eventKey = snapshot.key;
      self.form.eventName = self.event.title;
    });
  },
};

</script>

<style scoped lang="scss">

  .header {
    background-color: #f9f9f9;
    margin: -15px -15px 0 -15px;
    padding: 15px;
    border-bottom: 1px solid #dcdcdc;
  }

  .heading {
    font-size: 20px;
    margin: 0;
    color: rgba(0, 0, 0, .26);
  }

  .title {
    font-size: 24px;
    line-height: 24px;
    margin: 0;
  }

  .submit-btn {
    margin-top: 15px;
    display: block;
    width: 100%;
  }

  .success, .error {
    margin-top: 15px;
    border-radius: 3px;
    padding: 15px;
    color: white;
  }

  .success {
    background-color: forestgreen;
  }

  .error {
    background-color: #ff5722;
  }

</style>
