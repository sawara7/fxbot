<template>
  <v-row
    justify="center"
  >
    <v-btn
      @click="login"
      class="mt-12"
    >
    {{ msg }}
    </v-btn>
  </v-row>
</template>

<script>
export default {
  name: 'googleLogin',
  data() {
    return {
      msg : 'Googleアカウントでログイン'
    }
  },
  methods: {
    login: function() {
      if (firebase) {
        firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider());
        this.msg='login';
      }else{
        this.msg='firebaseがない'
      }
    }
  },
  created: function() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$emit('onLogIn');
      }
    });
  }
}
</script>

<style lang="scss">
</style>