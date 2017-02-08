<template>
  <div>
    <div class="card mdl-card mdl-shadow--2dp" v-for="event in filterNull(events)">
      <div class="mdl-card__title">
        <h2 class="mdl-card__title-text">{{ event.title }}</h2>
      </div>
      <div class="mdl-card__supporting-text">
        <table class="mdl-data-table mdl-js-data-table">
          <thead>
            <tr>
              <th class="mdl-data-table__cell--non-numeric">Pytanie</th>
              <th>Akcja</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="question in filterNull(event.questions)">
              <td class="mdl-data-table__cell--non-numeric">{{ question.question}}</td>
              <td>
                <button v-on:click="draw(question, event)" :disabled="question.drawing" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
                Losuj
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import filter from 'lodash/filter';
  import shuffle from 'lodash/shuffle';
  import { db } from '../firebase';

  export default{
    name: 'AdminPage',
    firebase: {
      events: db.ref('events'),
      participants: db.ref('participants'),
    },
    methods: {
      filterNull: collection => filter(collection, c => c),
      draw(question, event) {
        const allCorrectAnswers = filter(this.participants, {
          questionId: question.id,
          eventKey: event['.key'],
          answer: question.correctAnswer,
        });
        const winner = shuffle(allCorrectAnswers)[0];
        const questionRef = `events/${event['.key']}/questions/${question.id}`;
        db.ref(questionRef).update({
          drawing: true,
        });

        setTimeout(() => {
          db.ref(questionRef).update({
            drawing: false,
            winner: winner['.key'],
          });
        }, 5000);
      },
    },
  };

</script>

<style scoped lang="scss">
  .card.mdl-card {
    width: auto;
    max-width: 512px;
    margin: 0 auto 15px auto;
  }

  .mdl-data-table {
    width: 100%;
  }
</style>
