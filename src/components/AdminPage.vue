<template>
  <div>
    <admin-breadcrumbs>
      <h3>Admin page</h3>
    </admin-breadcrumbs>
    <div class="r-container table-container mdl-shadow--2dp">
      <div class="table-responsive">
        <table class="mdl-data-table mdl-js-data-table">
          <thead>
            <tr>
              <th>Tytuł</th>
              <th>Uczestnicy<br>konkursu</th>
              <th>Na stronie<br>agenda</th>
              <th>Na stronie<br>konkurs</th>
              <th>Utworzono</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="event in events" :key="event.title">
              <td>{{ event.title }}</td>
              <td>{{ getParticipantsNumber(event.id) }}</td>
              <td>{{ getAgendaUsersCount(event) }}</td>
              <td>{{ getQuizUsersCount(event) }}</td>
              <td>{{ getDateString(event.createdAt) }}</td>
              <td>
                <div class="buttons-container">
                  <router-link
                    class="mdl-button mdl-js-button mdl-button--raised"
                    :to="{ name: 'adminEditEvent', params: { seoSlug: event.seoSlug }}"
                  >
                    Edytuj
                  </router-link>
                  <router-link
                    class="mdl-button mdl-js-button mdl-button--raised"
                    :to="{ name: 'adminQuestions', params: { seoSlug: event.seoSlug }}"
                  >
                    Konkurs
                  </router-link>
                  <button
                    class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent"
                    @click="openModal('notifyModal', event.title, event.id, event.seoSlug)"
                  >
                    <i class="material-icons">notifications</i>
                  </button>
                  <button
                    class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent"
                    @click="openModal('deleteModal', event.title, event.id, event.seoSlug)"
                  >
                    <i class="material-icons">delete</i>
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
                :to="{ name: 'adminAddEvent'}"
              >
                Dodaj wydarzenie
              </router-link>
            </td>
          </tr>
          </tfoot>
        </table>
      </div>
      
    </div>
    <delete-modal
      v-if="deleteModal"
      @close="closeModals"
      @delete="deleteFromDatabase(selectedEvent.key)"
    >
      <p slot="body">Na pewno chcesz usunąć wydarzenie "{{ selectedEvent.title }}"?</p>
    </delete-modal>
    <notify-modal
      v-if="notifyModal"
      @close="closeModals"
      @notify="notifyUsers"
    >
    </notify-modal>
  </div>

</template>

<script>
import filter from 'lodash/filter';
import size from 'lodash/size';
import { mapState } from 'vuex';
import axios from 'axios';
import { Buffer } from 'buffer';

import { actionTypes as eventAction } from '../store/modules/events';
import DeleteModal from './DeleteModal';
import NotifyModal from './NotifyModal';
import AdminBreadcrumbs from './AdminBreadcrumbs';

export default {
  name: 'AdminPage',
  components: {
    DeleteModal,
    NotifyModal,
    AdminBreadcrumbs,
  },
  data() {
    return {
      deleteModal: false,
      notifyModal: false,
      notification: '',
      selectedEvent: {},
    };
  },
  computed: mapState({
    events: state => state.events.events,
    participants: state => state.events.participants,
  }),
  created() {
    //  LOAD_EVENTS has to stay for now because admin page is only accessible
    //  through manually entering the url and that resets the store
    this.$store.dispatch(eventAction.LOAD_EVENTS);
    this.$store.dispatch(eventAction.LOAD_PARTICIPANTS);
  },
  methods: {
    getParticipantsNumber(key) {
      const activeQuestionId = this.getActiveQuestionId(key);
      if (activeQuestionId === '') {
        return 0;
      }
      return filter(this.participants, {
        eventKey: key,
        questionId: activeQuestionId,
      }).length;
    },
    getActiveQuestionId(eventId) {
      const eventObj = filter(this.events, { id: eventId })[0];
      const activeQuestionObj = filter(eventObj.questions, { active: true })[0];
      if (activeQuestionObj && activeQuestionObj.id) {
        return activeQuestionObj.id;
      }
      return '';
    },
    getAgendaUsersCount(event) {
      if (event.agendaUsers) {
        return size(event.agendaUsers);
      }
      return 0;
    },
    getQuizUsersCount(event) {
      if (event.quizUsers) {
        return size(event.quizUsers);
      }
      return 0;
    },
    getDateString(timestamp) {
      if (timestamp) {
        return new Date(timestamp).toLocaleString('en-GB', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: false,
        });
      }

      return 'old';
    },
    openModal(modal, title, id, seoSlug) {
      this[modal] = true;
      this.selectedEvent.title = title;
      this.selectedEvent.key = id;
      this.selectedEvent.seoSlug = seoSlug;
    },
    closeModals() {
      this.deleteModal = false;
      this.notifyModal = false;
      this.selectedEvent = {};
    },
    deleteFromDatabase(id) {
      this.closeModals();
      this.$store.dispatch(eventAction.DELETE_EVENT, id);
    },
    notifyUsers([notification, contest]) {
      const topic = this.selectedEvent.seoSlug;
      axios.get('/notification', {
        params: {
          to: `/topics/${topic}`,
          content: Buffer.from(notification).toString('base64'),
          action: `${window.location.origin}/event/${topic}/${
            contest === 'true' ? 'konkurs' : ''
          }`,
        },
      });
      this.closeModals();
    },
  },
};
</script>

<style scoped lang="scss">
@import '~@/assets/styles/vars';

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.table-container {
  margin: 0 auto 15px auto;
}

.mdl-data-table {
  width: 100%;

  td,
  th {
    text-align: right;
    white-space: normal;
  }

  th {
    line-height: 18px;
    height: auto;
    padding-top: 8px;
    padding-bottom: 8px;
    vertical-align: middle;
  }

  td:nth-of-type(1),
  th:nth-of-type(1) {
    text-align: left;
  }

  td:nth-of-type(2),
  th:nth-of-type(2),
  td:nth-of-type(3),
  th:nth-of-type(3),
  td:nth-of-type(4),
  th:nth-of-type(4),
  td:nth-of-type(5),
  th:nth-of-type(5) {
    text-align: center;
  }

  @media (max-width: map-get($breakpoints, 'sm')) {
    td,
    th {
      padding-top: 5px;
      padding-bottom: 5px;
    }
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

.mdl-button {
  margin: 0 2px;

  @media (max-width: map-get($breakpoints, 'md')) {
    height: 30px;
    line-height: 30px;
    min-width: 35px;
    font-size: 12px;
    padding-left: 8px;
    padding-right: 8px;
  }
}

.buttons-container {
  display: flex;
  justify-content: flex-end;
}
</style>
