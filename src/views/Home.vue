<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col md="12" lg="10" xl="10">
        <v-layout wrap> 
          <v-flex 
                md12 lg4 xl4
                v-for="(account,i) of accounts" 
                :key="i"
                class = "pa-2"
                >
            <v-card elevation=1>
              <v-card-title class="font-weight-Bold">
                <p :class="{
                    'myclass1' : true,
                    'display-4': $vuetify.breakpoint.smAndDown,
                    'display-2': $vuetify.breakpoint.mdOnly,
                    'headline': $vuetify.breakpoint.lgAndUp
                    }">{{account.exchange + "/" + account.account}}</p>
              </v-card-title>
              <v-card-img></v-card-img>
              <v-card-text class="font-weight-light">
                <p :class="{
                  'myclass1' : true,
                  'display-2': $vuetify.breakpoint.smAndDown,
                  'headline': $vuetify.breakpoint.mdOnly,
                  'title': $vuetify.breakpoint.lgAndUp
                  }">
                  {{ account.total }} yen <br>
                  {{ account.date }}    
                </p>
              </v-card-text>
          </v-card>
        </v-flex>
        </v-layout>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      accounts :[]
    }
  },
  created: function() {
    firebase
        .database()
        .ref("balance-history/")
        .on("value", (result) => {
          let tmp = result.val();
          for (let exchange in tmp){
            for (let account in tmp[exchange]){
              let value = {};
              value["exchange"] = exchange;
              value["account"]  = account;
              let latest_key = Math.max(Object.keys(tmp[exchange][account]));
              value["total"] = Math.round(tmp[exchange][account][latest_key].total);
              value["date"] = new Date(latest_key).toString();
              this.accounts.push(value);
            }
          }
        });
    
  },
  components: {
  }
};
</script>
