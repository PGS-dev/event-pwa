<template>
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
        <tr v-for="event in filterNull(events)">
          <td>{{ event.title }}</td>
          <td>{{ event.participants }}</td>
          <td>
            <div class="buttons-container">
              <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
                Edytuj
              </button>
              <router-link
                class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
                :to="{ name: 'adminQuiz', params: { seoSlug: event.seoSlug }}"
              >
                Konkurs
              </router-link>
              <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
                Usuń
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import filter from 'lodash/filter';
  import { db } from '../firebase';

  export default {
    name: 'AdminPage',
    data() {
      return {
        events: [],
      };
    },
    created() {
      const self = this;
      const eventsRef = db.ref('events');
      eventsRef.on('value', (snapshot) => {
        const snapshotVal = snapshot.val();
        Object.keys(snapshotVal).forEach((key) => {
          const title = snapshotVal[key].title;
          const seoSlug = snapshotVal[key].seoSlug;
          self.eventCreator(key, title, seoSlug);
        });
      });
    },
    methods: {
      filterNull: collection => filter(collection, c => c),
      eventCreator(key, title, seoSlug) {
        const participantsRef = db.ref('participants').orderByChild('eventKey').equalTo(key);
        participantsRef.on('value', (snapshot) => {
          const snapshotVal = snapshot.val();
          const eventPayload = {
            title,
            participants: snapshotVal ? Object.keys(snapshotVal).length : 0,
            seoSlug,
          };
          this.events.push(eventPayload);
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
      padding-left: 0px;
      padding-right: 0px;
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
