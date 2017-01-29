<template>
  <div v-if="event">
    <div class="header">
      <h1 class="heading">{{ event.title }}</h1>
      <h2 class="title">Konkurs</h2>
    </div>
    <div class="success" v-if="successMessage">{{successMessage}}</div>
    <div class="error" v-if="errorMessage">{{errorMessage}}</div>

    <template v-if="activeQuestion">
      <h2 class="question" v-if="!formSent">{{activeQuestion.question}}</h2>

      <form v-on:submit.prevent="onSubmit" v-if="!formSent">
        <mdl-radio v-model="form.answer" v-for="option in activeQuestion.answers" class="answer mdl-js-ripple-effect" :val="option.id">{{option.answer}}</mdl-radio>
        <mdl-button class="mdl-js-ripple-effect submit-btn" colored raised>Wyślij</mdl-button>
      </form>
    </template>

    <template v-if="!activeQuestion">
      <div class="info">
        <i class="material-icons">info</i>
        <p>Wkrótce pojawi się tutaj pytanie konkursowe!</p>
      </div>
    </template>
  </div>
</template>

<script>
import find from 'lodash/find';
import { db } from '../firebase';

export default {
  name: 'EventQuiz',
  data() {
    return {
      event: null,
      errorMessage: null,
      successMessage: null,
      formSent: false,
      form: {
        answer: '',
      },
    };
  },
  computed: {
    activeQuestion() {
      return find(this.event.questions, { active: true });
    },
  },
  methods: {
    onSubmit() {
      const self = this;
      const data = { ...this.form, questionId: this.activeQuestion.id };

      db.ref('attendees').push(data, (error) => {
        if (error) {
          self.errorMessage = error.code;
          return;
        }

        self.successMessage = 'Dziękujemy za udział w konkursie!';
        self.formSent = true;
      });
    },
  },
  created() {
    const selectedSeoSlug = this.$route.params.seoSlug;
    const self = this;
    const eventRef = db.ref('events').orderByChild('seoSlug').equalTo(selectedSeoSlug);

    eventRef.on('child_added', (snapshot) => {
      self.form.eventKey = snapshot.key;
    });

    eventRef.on('value', (snapshot) => {
      self.event = find(snapshot.val(), e => e);
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

  .info {
    padding-top: 15px;
    text-align: center;

    i {
      font-size: 40px;
    }

    p {
      font-size: 20px;
    }
  }

  .question {
    font-size: 24px;
    margin: 10px 0;
  }

  .answer {
    display: block;
    height: auto;
    padding-bottom: 10px;
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
