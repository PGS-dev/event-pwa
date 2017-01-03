<template>
  <div>
    <div class="card mdl-card mdl-shadow--2dp" v-for="event in events">
      <div class="mdl-card__title" v-bind:style="{ backgroundImage: 'url(' + event.imageUrl + ')' }">
        <h2 class="mdl-card__title-text">{{ event.title }}</h2>
      </div>
      <div class="mdl-card__supporting-text">
        {{ event.desc }}
      </div>
      <div class="mdl-card__actions mdl-card--border" v-if="event.open">
        <router-link :to="{ name: 'event', params: { seoSlug: event.seoSlug }}" class="mdl-button mdl-button--colored mdl-button--raised mdl-js-button mdl-js-ripple-effect">
          Zapisz się
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../firebase';

export default{
  name: 'EventsList',
  data() {
    return {
      events: [],
    };
  },
  created() {
    const eventsRef = db.ref('events');
    const self = this;

    if (navigator.onLine) {
      eventsRef.on('value', (snapshot) => {
        self.events = snapshot.val();
      });
    }
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
    background: linear-gradient(to right, #160404 0%,#ff7626 100%);
    opacity: 0.7;
  }
}
.mdl-card__title-text {
  z-index: 1;
}
.card > .mdl-card__menu {
  color: #fff;
}
</style>
