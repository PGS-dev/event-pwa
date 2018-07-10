<template>
  <div>
    <template v-if="activeEventsCount > 0">
      <div class="card mdl-card mdl-shadow--2dp" v-for="event in events" v-if="event.active" v-bind:key="event.id">
        <div class="mdl-card__title" v-bind:style="{ backgroundImage: 'url(' + event.imageUrl + ')' }">
          <h2 class="mdl-card__title-text">{{ event.title }}</h2>
        </div>
        <div class="mdl-card__supporting-text" v-if="event.desc">
          {{ event.desc }}
        </div>
        <div class="mdl-card__actions mdl-card--border">
          <router-link :to="{ name: 'quiz', params: { seoSlug: event.seoSlug }}" v-if="event.open && event.questions"
                       class="mdl-button mdl-button--colored mdl-button--raised mdl-js-button mdl-js-ripple-effect button-konkurs">
            Konkurs
          </router-link>
          <router-link :to="{ name: 'agenda', params: { seoSlug: event.seoSlug }}" v-if="event.agenda"
                       class="mdl-button mdl-button--raised mdl-js-button mdl-js-ripple-effect">
            Agenda
          </router-link>
        </div>
      </div>
    </template>
    <template v-if="eventsFetched && activeEventsCount === 0">
      <div class="info">
        <i class="material-icons">info</i>
        <p>Już wkrótce kolejne wydarzenia. Zapraszamy później!</p>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { actionTypes as eventAction } from '../store/modules/events';

export default {
  name: 'EventsList',
  computed: mapState({
    events: state => state.events.events,
    eventsFetched: state => state.events.eventsFetched,
    activeEventsCount: state =>
      state.events.events.filter(e => e.active).length,
  }),
  created() {
    this.$store.dispatch(eventAction.LOAD_EVENTS);
  },
};
</script>

<style scoped lang="scss">
.card.mdl-card {
  width: auto;
  max-width: 512px;
  margin: 0 auto 15px auto;
}

.card > .mdl-card__title {
  color: #fff;
  height: 176px;
  background-position: center;
  background-size: cover;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to right, #160404 0%, #ff7626 100%);
    opacity: 0.7;
  }
}

.mdl-card__title-text {
  z-index: 1;
}

.card > .mdl-card__menu {
  color: #fff;
}

.card .button-konkurs {
  margin-right: 5px;
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
</style>
