<template>
  <div id="app">
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
      <header class="mdl-layout__header">
        <div class="mdl-layout__header-row">
          <router-link :to="{ name: 'events' }" class="logo"></router-link>
          <!-- Title -->
          <span class="mdl-layout-title">Wydarzenia <strong>NEW!</strong></span>
        </div>
      </header>
      <div class="offline-message">
        Brak połączenia z internetem
      </div>
      <main class="mdl-layout__content">
        <div class="page-content">
          <transition name="fade" mode="out-in">
            <router-view class="view"></router-view>
          </transition>
        </div>
      </main>
      <PopupMessage></PopupMessage>
    </div>
  </div>
</template>

<script>
import PopupMessage from './components/PopupMessage';
import { messaging } from './firebase';
import { actionTypes as eventAction } from './store/modules/events';

export default {
  name: 'app',
  components: {
    PopupMessage,
  },
  data() {
    return {
      message: '',
    };
  },
  beforeCreate() {
    // Check if the user is offline.
    if (!navigator.onLine) {
      document.body.classList.add('offline');
    }
    window.addEventListener('online', () => {
      document.body.classList.remove('offline');
    }, false);
    window.addEventListener('offline', () => {
      document.body.classList.add('offline');
    }, false);
  },
  created() {
    messaging.onMessage((payload) => {
      this.$store.dispatch(eventAction.SHOW_POPUP_MESSAGE, {
        message: payload.notification.body,
      });
    });
  },
};

</script>

<style lang="scss" src="./styles.scss"></style>
