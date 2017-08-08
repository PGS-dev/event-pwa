<template>
  <form class="input-container mdl-shadow--3dp" v-on:submit.prevent="onSubmit">
    <mdl-textfield floating-label="Pytanie" v-model="question.question" required></mdl-textfield>
    <mdl-textfield floating-label="Nagroda" v-model="question.reward" required></mdl-textfield>
    <mdl-checkbox v-model="question.active">Aktywne</mdl-checkbox>
    <div class="answer-container" v-for="(answer, index) in newAnswers" v-bind:key="answer.id">
      <mdl-radio v-model="correctAnswer" :val="answer.id"></mdl-radio>
      <mdl-textfield floating-label="Odpowiedź" v-model="answer.answer" required></mdl-textfield>
      <button
        class="mdl-button mdl-js-button mdl-button--mini-fab"
        @click.prevent="removeAnswerField(index)"
      >
        <i class="material-icons">clear</i>
      </button>
    </div>
    <div class="footer">
      <button
        class="mdl-button mdl-js-button mdl-button--mini-fab"
        @click.prevent="addAnswerField"
      >
        <i class="material-icons">add_box</i>
        Dodaj odpowiedź
      </button>
      <mdl-button class="mdl-js-ripple-effect submit-btn" colored raised :disabled="newAnswers.length == 0">Zapisz</mdl-button>
    </div>
  </form>
</template>

<script>

  export default {
    name: 'QuestionForm',
    data() {
      return {
        newAnswers: [
          {
            answer: '',
            id: 1,
          },
        ],
        correctAnswer: 1,
      };
    },
    created() {
      if (this.edit) {
        this.newAnswers = this.question.answers;
        this.correctAnswer = this.question.correctAnswer;
      }
    },
    props: {
      edit: {},
      question: {
        default() {
          return {
            question: '',
            active: false,
            reward: '',
            answers: {},
            correctAnswer: '',
            id: '',
          };
        },
      },
    },
    methods: {
      onSubmit() {
        const thisQuestion = this.question;
        const formPayload = {
          question: thisQuestion.question,
          active: thisQuestion.active,
          reward: thisQuestion.reward,
          correctAnswer: this.correctAnswer,
          answers: this.newAnswers,
        };
        this.$emit('submitted', formPayload);
      },
      addAnswerField() {
        const id = this.newAnswers.length + 1;
        const newAnswer = {
          answer: '',
          id,
        };
        this.newAnswers.push(newAnswer);
      },
      removeAnswerField(id) {
        this.newAnswers.splice(id, 1);
        const tasksAmount = this.newAnswers.length;
        for (let i = id; i < tasksAmount; i += 1) {
          this.newAnswers[i].id -= 1;
        }
      },
    },
  };

</script>

<style scoped lang="scss">

  .input-container {
    padding: 10px;
    background: #f9f9f9;
    max-width: 800px;
    margin: 0 auto 0 auto;

    .mdl-textfield {
      width: 800px;
      display: inline-block;
    }
  }

  .answer-container {
    display: flex;
    align-items: center;

    .mdl-checkbox {
      max-width: 60px;
    }

    .mdl-button {
      min-width: 30px;
      padding-left: 0;
      padding-right: 0;
    }
  }

  .footer {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
  }

</style>
