<template>
  <div>
    <div class="table-container">
      <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
        <thead>
          <tr>
            <th>Tytuł</th>
            <th>Uczestnicy</th>
            <th>Utworzono</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in events" :key="event.title">
            <td>{{ event.title }}</td>
            <td>{{ getParticipantsNumber(event.id) }}</td>
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
import { mapState } from 'vuex';
import axios from 'axios';
import { Buffer } from 'buffer';

import { actionTypes as eventAction } from '../store/modules/events';
import DeleteModal from './DeleteModal';
import NotifyModal from './NotifyModal';

export default {
  name: 'AdminPage',
  components: {
    DeleteModal,
    NotifyModal,
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
      return filter(this.participants, { eventKey: key }).length;
    },
    getDateString(timestamp) {
      return new Date(timestamp).toLocaleString('en-GB', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      });
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
$tablet: 767px;
$mobile: 414px;

.table-container {
  max-width: 100%;
  width: 1100px;
  margin: 0 auto 15px auto;
}

.mdl-data-table {
  width: 100%;

  td,
  th {
    text-align: right;
    white-space: normal;
  }

  td:nth-of-type(1),
  th:nth-of-type(1) {
    text-align: left;
  }

  td:nth-of-type(2),
  th:nth-of-type(2),
  td:nth-of-type(3),
  th:nth-of-type(3) {
    text-align: center;
    padding-left: 0;
    padding-right: 0;
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

.mdl-button {
  margin: 2px;

  @media (max-width: $tablet) {
    padding-left: 5px;
    padding-right: 5px;
  }
}

.buttons-container {
  display: flex;
  justify-content: flex-end;

  @media (max-width: $tablet) {
    flex-direction: column;
  }
}
</style>
