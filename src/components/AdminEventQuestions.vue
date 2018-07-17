<template>
  <div>
    <admin-breadcrumbs>
      <h3><router-link to="/admin" replace>Admin page</router-link> > Questions</h3>
    </admin-breadcrumbs>
    <div class="r-container">
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
              <tr v-if="filterNull(event.questions).length === 0"><td colspan="3">Brak pytań konkursowych</td></tr>
              <tr v-for="question in filterNull(event.questions)" v-bind:key="question.id">
                <td>
                  <mdl-checkbox
                    v-model="question.active"
                    @change.native="updateActiveQuestion(question.id, question.active, event)"
                  >
                  </mdl-checkbox>
                </td>
                <td class="mdl-data-table__cell--non-numeric">{{ question.question }}</td>
                <td>
                  <div class="buttons-container">
                    <button
                      v-on:click="draw(question, event)"
                      :disabled="question.drawing || !question.active"
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
import { Buffer } from 'buffer';
import { actionTypes as eventAction } from '../store/modules/events';
import DeleteModal from './DeleteModal';
import AdminBreadcrumbs from './AdminBreadcrumbs';

export default {
  name: 'AdminEventQuestions',
  components: {
    DeleteModal,
    AdminBreadcrumbs,
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
            axios.get('/notification', {
              params: {
                to: winner.fcmToken,
                content: Buffer.from(
                  `Gratulacje! Twoją wygraną jest: ${question.reward}`,
                ).toString('base64'),
                action: `${window.location.origin}/event/${
                  event.seoSlug
                }/konkurs`,
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

    updateActiveQuestion(id, isActive, event) {
      const data = { id, isActive };
      this.$store.dispatch(eventAction.UPDATE_ACTIVE_QUESTION, data);
      if (isActive) {
        axios.get('/notification', {
          params: {
            to: `/topics/${event.seoSlug}`,
            content: Buffer.from('Uwaga! Pytanie jest aktywne!').toString(
              'base64',
            ),
            action: `${window.location.origin}/event/${event.seoSlug}/konkurs`,
          },
        });
      }
    },

    deleteFromDatabase(id) {
      this.closeModal();
      this.$store.dispatch(eventAction.DELETE_QUESTION, id);
    },
  },
};
</script>

<style scoped lang="scss">
@import '~@/assets/styles/vars';

.mdl-checkbox {
  display: block;
  width: 20px;
  margin-left: auto;
  margin-right: auto;
}

.card.mdl-card {
  width: 100%;
  margin: 0 auto 15px auto;

  .mdl-card__supporting-text {
    width: 100%;
    box-sizing: border-box;

    @media (max-width: map-get($breakpoints, 'sm')) {
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

  @media (max-width: map-get($breakpoints, 'md')) {
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

  @media (max-width: map-get($breakpoints, 'md')) {
    flex-direction: column;
  }

  .mdl-button {
    margin: 2px;

    @media (max-width: map-get($breakpoints, 'md')) {
      height: 30px;
      line-height: 30px;
      min-width: 35px;
      font-size: 12px;
      padding-left: 5px;
      padding-right: 5px;
    }
  }
}
</style>
