<template>
  <div class="card-form mdl-card mdl-shadow--2dp">
    <form v-on:submit.prevent="onSubmit">
      <mdl-textfield floating-label="Email" v-model="authData.email" required></mdl-textfield>
      <mdl-textfield type="password" floating-label="Hasło" v-model="authData.password" required></mdl-textfield>
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
      firebase
        .auth()
        .signInWithEmailAndPassword(this.authData.email, this.authData.password)
        .then(() => {
          this.$router.push({ name: 'admin' });
        });
    },
  },
};
</script>

<style scoped lang="scss">
.card-form {
  max-width: 100%;
  margin: 20px auto;
  padding: 20px;
}
</style>
