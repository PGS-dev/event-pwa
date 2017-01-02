<template>
  <div id="app">
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
      <header class="mdl-layout__header">
        <div class="mdl-layout__header-row">
          <router-link :to="{ name: 'events' }" class="logo"></router-link>
          <!-- Title -->
          <span class="mdl-layout-title">Wydarzenia</span>
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
    </div>
  </div>
</template>

<script>

export default {
  name: 'app',
};

</script>

<style lang="scss">

@import 'styles';

</style>
