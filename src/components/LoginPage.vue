<template>
  <div>
    <form v-on:submit.prevent="onSubmit">
      <div class="mdl-textfield mdl-js-textfield">
        <input class="mdl-textfield__input" type="email" id="email" v-model="authData.email">
        <label class="mdl-textfield__label" for="email">Email</label>
      </div>
      <div class="mdl-textfield mdl-js-textfield">
        <input class="mdl-textfield__input" type="password" id="password" v-model="authData.password">
        <label class="mdl-textfield__label" for="password">Hasło</label>
      </div>
      <button type="submit" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
        Zaloguj
      </button>
    </form>
  </div>
</template>

<script>
  import firebase from '../firebase';

  export default {
    name: 'LoginPage',
    data() {
      return {
        authData: {
          email: null,
          password: null,
        },
      };
    },
    methods: {
      onSubmit() {
        firebase.auth().signInWithEmailAndPassword(this.authData.email, this.authData.password)
          .then(
            () => {
              this.$router.push({ name: 'admin' });
            },
          );
      },
    },
  };

</script>

<style lang="scss">

</style>
