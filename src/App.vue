<template>
  <v-app>
    <vHome v-if="isAdmin"/>
    <vLogin v-if="!isAdmin"/>
    <vFooter/>
  </v-app>
</template>

<script>
import vMenu   from './components/Menu'
import vFooter from './components/Footer'
import vHome   from './views/Home';
import vLogin  from './views/Login';

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
    vMenu,
    vFooter,
    vHome,
    vLogin
  },
};
</script>
