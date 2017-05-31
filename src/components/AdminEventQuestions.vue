<template>
  <div>
    <div class="card mdl-card mdl-shadow--2dp">
      <div class="mdl-card__title">
        <h2 class="mdl-card__title-text">{{ event.title }}</h2>
      </div>
      <div class="mdl-card__supporting-text">
        <table class="mdl-data-table mdl-js-data-table">
          <thead>
            <tr>
              <th class="mdl-data-table__cell--non-numeric">Pytanie</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="question in filterNull(event.questions)">
              <td class="mdl-data-table__cell--non-numeric">{{ question.question }}</td>
              <td>
                <div class="buttons-container">
                  <button
                    v-on:click="draw(question, event)"
                    :disabled="question.drawing"
                    class="mdl-button mdl-js-button mdl-button--raised"
                  >
                    Losuj
                  </button>
                  <router-link
                    class="mdl-button mdl-js-button mdl-button--raised"
                    :to="{ name: 'adminEdit', params: { seoSlug: event.seoSlug }}"
                  >
                    Edytuj
                  </router-link>
                  <button
                    class="mdl-button mdl-js-button mdl-button--raised"
                  >
                    Usuń
                  </button>
                  <mdl-checkbox
                    v-model="question.active"
                    @change.native="updateDatabase(question.id, question.active)"
                  >
                    Aktywne
                  </mdl-checkbox>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import filter from 'lodash/filter';
  import shuffle from 'lodash/shuffle';
  import { db } from '../firebase';
  import { actionTypes as eventAction } from '../store/modules/events';


  export default {
    name: 'AdminEventQuestions',
    computed: mapState({
      event: state => state.events.selectedEvent,
    }),
    created() {
      this.$store.dispatch(eventAction.GET_EVENT_DETAILS);
    },
    methods: {
//      -----------------
//      NOT CHANGED YET \/
//      -----------------
      filterNull: collection => filter(collection, c => c.question),
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
//      -----------------
//      NOT CHANGED YET ^
//      -----------------
      updateDatabase(id, active) {
        const payload = {
          active,
        };
        const updatedRef = db.ref(`events/${this.event.id}/questions/${id}`);
        updatedRef.update(payload)
          .then(() => {
            console.log('Question edited');
          })
          .catch(() => {
            console.log('Error');
          });
      },
    },
  };

</script>

<style scoped lang="scss">

  $mobile: 380px;

  .card.mdl-card {
    width: auto;
    max-width: 512px;
    margin: 0 auto 15px auto;
  }

  .mdl-card__supporting-text {
    width: 100%;
    box-sizing: border-box;

    @media(max-width: $mobile) {
      padding: 0;
    }
  }

  .mdl-data-table {
    width: 100%;
    white-space: normal;

    td, th {
      text-align: center;
      white-space: normal;
    }

    @media (max-width: $mobile) {
      td:last-of-type,
      th:last-of-type {
        padding-right: 12px;
      }

      td:first-of-type,
      th:first-of-type {
        padding-left: 12px;
      }
    }
  }

</style>
