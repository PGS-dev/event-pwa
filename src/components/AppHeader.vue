<template>
    <header class="mdl-layout__header">
        <div class="mdl-layout__header-row">
          <router-link :to="{ name: 'events' }" class="logo"></router-link>
          <!-- Title -->
          <span class="mdl-layout-title">Wydarzenia</span>
        </div>
      </header>
</template>

<script>
export default {
  name: 'AppHeader',
};
</script>

<style lang="scss" scoped>
.logo {
  background: url('../assets/logo.svg') no-repeat;
  background-size: contain;
  display: inline-block;
  width: 100px;
  height: 50px;
  margin-right: 15px;
}
</style>
