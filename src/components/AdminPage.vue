<template>
  <div>
    <div class="table-container">
      <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
        <thead>
          <tr>
            <th>Tytuł</th>
            <th>Uczestnicy</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in events">
            <td>{{ event.title }}</td>
            <td>{{ getParticipantsNumber(event.id) }}</td>
            <td>
              <div class="buttons-container">
                <router-link
                  class="mdl-button mdl-js-button mdl-button--raised"
                  :to="{ name: 'adminEdit', params: { seoSlug: event.seoSlug }}"
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
                  class="mdl-button mdl-js-button mdl-button--raised"
                  @click="openModal(event.title, event.id)"
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
      v-if="showModal"
      @close="closeModal"
      @delete="deleteFromDatabase('events', selectedEvent.key)"
    >
      <p slot="body">Na pewno chcesz usunąć wydarzenie "{{ selectedEvent.title }}"?</p>
    </delete-modal>
  </div>
</template>

<script>
  import filter from 'lodash/filter';
  import { mapState } from 'vuex';
  import { actionTypes as eventAction } from '../store/modules/events';
  import { db } from '../firebase';
  import DeleteModal from './DeleteModal';

  export default {
    name: 'AdminPage',
    components: {
      DeleteModal,
    },
    data() {
      return {
        showModal: false,
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
      openModal(title, id) {
        this.showModal = true;
        this.selectedEvent.title = title;
        this.selectedEvent.key = id;
      },
      closeModal() {
        this.showModal = false;
        this.selectedEvent = {};
      },
      deleteFromDatabase(ref1, ref2) {
        this.closeModal();
        db.ref(`${ref1}/${ref2}`).remove()
          .then(() => {
            console.log('Event removed');
          })
          .catch(() => {
            console.log('Error');
          });
      },
    },
  };

</script>

<style scoped lang="scss">

  $tablet: 767px;
  $mobile: 380px;

  .table-container {
    max-width: 512px;
    margin: 0 auto 15px auto;
  }

  .mdl-data-table {
    width: 100%;

    td, th {
      text-align: center;
      white-space: normal;
    }

    td:nth-of-type(2),
    th:nth-of-type(2) {
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

    @media (max-width: $tablet) {
      flex-direction: column;
    }
  }

</style>
