<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col md="12" lg="10" xl="10">
        <v-layout wrap> 
          <v-flex 
                md12 lg4 xl4
                v-for="(account,i) of accounts" 
                :key="i"
                pa-2
                >
          <v-card elevation=1>
            <v-card-text>
              <p class="headline">{{account.exchange}}/{{account.account}}</p>
              <p class="display-1 text--primary float-left">&yen;{{account.nav}}</p>
              <p :class="{
                'headline': true,
                'float-right': true,
                'green--text': (account.percent >= 100),
                'red--text': (account.percent < 100)
                }">{{account.percent}}%</p>
            </v-card-text>
            <v-sparkline
              :value="account.history"
              :gradient="color"
              line-width=1
              auto-draw
            ></v-sparkline>
            <v-card-text>
              <div>{{account.date}}</div>
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
      color: ['#f72047', '#ffd200', '#1feaea'],
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
              let array = Object.keys(tmp[exchange][account]);
              let latest_key = Math.max.apply(null,array);
              value["balance"] = Math.round(tmp[exchange][account][latest_key].balance);
              value["nav"] = Math.round(tmp[exchange][account][latest_key].nav);
              value["percent"] = Math.round(value.nav/value.balance * 10000)/100; 
              let d = new Date(latest_key);
              value["date"] = d.getFullYear().toString() + "/" + (d.getMonth()+1).toString() + "/" + d.getDate().toString() + " " + d.getHours().toString() + ":00";
              value["history"] = [];
              for (let t of Object.keys(tmp[exchange][account])){
                let total = Number(tmp[exchange][account][t].nav);
                value["history"].push(total);
              }

              this.accounts.push(value);
            }
          }
        });
    
  },
  components: {
  }
};
</script>
