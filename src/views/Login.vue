<template>
  <v-content>
    <div></div>
    <myLogin v-on:onLogIn="onLoginProc"/>
  </v-content>
</template>

<script>
  import myLogin from "../components/GoogleLogin";

  export default{
    data() {
        return {
          isLogin : false,
          userData: null
        };
    },
    methods: {
      onLoginProc: function(){
        this.$router.push('/');
      }
    },
    components: {
      myLogin  : myLogin
      }
    };
</script>
