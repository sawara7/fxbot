<template>
  <v-app>
    <header> My FX Portfolio</header>
    <v-content>
      <Home v-if="isAdmin"/>
      <Login  v-if="!isAdmin"/>
    </v-content>
  </v-app>
</template>

<script>
import Home from './views/Home';
import Login from './views/Login';

export default {
  name: 'fxApp',
  data() {
      return {
        isAdmin : false,
        id : ""
      };
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user){
        let aRef = firebase.database().ref('admin-uid/' + user.uid);
        aRef.on("value", (value) => {
          if(value.val()==true){
            this.id = user.uid;
            this.isAdmin=true;
            }});
      }
    });
  },
  components: {
    Home,
    Login
  },
};
</script>
