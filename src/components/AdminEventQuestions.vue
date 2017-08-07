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
              <th>Aktywne</th>
              <th class="mdl-data-table__cell--non-numeric">Pytanie</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="question in filterNull(event.questions)">
              <td>
                <mdl-checkbox
                  v-model="question.active"
                  @change.native="updateActiveQuestion(question.id, question.active)"
                >
                </mdl-checkbox>
              </td>
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
                    :to="{ name: 'adminEditQuestion', params: { questionId: question.id }}"
                  >
                    Edytuj
                  </router-link>
                  <button
                    class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent"
                    @click="openModal(question.question, question.id)"
                  >
                    Usuń
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot>
          <tr>
            <td colspan="3">
              <router-link
                class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
                :to="{ name: 'adminAddQuestion'}"
              >
                Dodaj pytanie
              </router-link>
            </td>
          </tr>
          </tfoot>
        </table>
      </div>
    </div>
    <delete-modal
      v-if="showModal"
      @close="closeModal"
      @delete="deleteFromDatabase(selectedQuestion.id)"
    >
      <p slot="body">Na pewno chcesz usunąć pytanie "{{ selectedQuestion.question }}"?</p>
    </delete-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import filter from 'lodash/filter';
import shuffle from 'lodash/shuffle';
import axios from 'axios';
import { actionTypes as eventAction } from '../store/modules/events';
import DeleteModal from './DeleteModal';

export default {
  name: 'AdminEventQuestions',
  components: {
    DeleteModal,
  },
  data() {
    return {
      showModal: false,
      selectedQuestion: {},
    };
  },
  computed: mapState({
    event: state => state.events.selectedEvent,
    participants: state => state.events.participants,
  }),
  created() {
    this.$store.dispatch(eventAction.GET_EVENT_DETAILS);
    this.$store.dispatch(eventAction.LOAD_PARTICIPANTS);
  },
  methods: {
    openModal(question, id) {
      this.showModal = true;
      this.selectedQuestion.question = question;
      this.selectedQuestion.id = id;
    },
    closeModal() {
      this.showModal = false;
      this.selectedQuestion = {};
    },
    filterNull: collection => filter(collection, c => c.question),

    draw(question, event) {
      const allCorrectAnswers = filter(this.participants, {
        questionId: question.id,
        eventKey: event.id,
        answer: question.correctAnswer,
      });
      if (allCorrectAnswers.length > 0) {
        const winner = shuffle(allCorrectAnswers)[0];
        const questionRef = `events/${event.id}/questions/${question.id}`;

        this.$store.dispatch(eventAction.UPDATE_QUESTION_WINNER, {
          questionRef,
          drawing: true,
          winner: null,
        });

        setTimeout(() => {
          const data = { questionRef, drawing: false, winner: winner.id };
          this.$store.dispatch(eventAction.UPDATE_QUESTION_WINNER, data);

          // send push notification
          if (winner.fcmToken) {
            axios({
              method: 'get',
              url: 'https://us-central1-pgs-events.cloudfunctions.net/sendPushNotification',
              params: {
                token: winner.fcmToken,
                reward: question.reward,
                action: `${window.location.origin}/event/${event.seoSlug}/konkurs`,
              },
            });
          }
        }, 5000);
      } else {
        this.$store.dispatch(eventAction.SHOW_POPUP_MESSAGE, {
          message: '0 poprawnych odpowiedzi',
        });
      }
    },

    updateActiveQuestion(id, isActive) {
      const data = { id, isActive };
      this.$store.dispatch(eventAction.UPDATE_ACTIVE_QUESTION, data);
    },
    deleteFromDatabase(id) {
      this.closeModal();
      this.$store.dispatch(eventAction.DELETE_QUESTION, id);
    },
  },
};

</script>

<style scoped lang="scss">
$tablet: 767px;
$mobile: 414px;

.mdl-checkbox {
  display: block;
  width: 20px;
  margin-left: auto;
  margin-right: auto;
}

.card.mdl-card {
  width: 100%;
  max-width: 800px;
  margin: 0 auto 15px auto;

  .mdl-card__supporting-text {
    width: 100%;
    box-sizing: border-box;

    @media(max-width: $mobile) {
      padding: 0;
    }
  }
}

.mdl-data-table {
  width: 100%;

  td,
  th {
    text-align: center;
    white-space: normal;
  }

  @media (max-width: $tablet) {
    td:last-of-type,
    th:last-of-type {
      padding-right: 12px;
      padding-left: 0;
    }

    td:nth-of-type(2),
    th:nth-of-type(2) {
      padding-left: 12px;
      padding-right: 12px;
    }

    td:first-of-type,
    th:first-of-type {
      padding-left: 12px;
      padding-right: 0;
    }
  }
}

.buttons-container {
  display: flex;
  justify-content: center;

  @media (max-width: $tablet) {
    flex-direction: column;
  }

  .mdl-button {
    margin: 2px;

    @media (max-width: $tablet) {
      min-width: 20vw;
      padding-left: 5px;
      padding-right: 5px;
    }
  }
}
</style>
