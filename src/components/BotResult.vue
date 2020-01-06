<template>
  <div>
    <div 
    v-for="(element) in disp_elements">
      {{element.disp_name}} : {{element.value}}
    </div>
    <div 
    v-for="(value, name) in results">
      <div>{{name}}</div>
      <div>利益： {{ value.profit }} </div>
      <div>売り回数： {{ value.sell_count }} </div>
    </div>
  </div>
</template>

<script>
const BOT_DATA_PATH = "bot/bitbank_averaging_std/mona_jpy/"

export default {
  data() {
    return {
      bot_name : BOT_DATA_PATH,
      bot_data : undefined,
      results  : {},
      disp_elements :[
        {
         "name": "name",
         "disp_name": "BOT名",
         "value" : "不明"
         },
        {
         "name": "last_update",
         "disp_name": "最終更新",
         "value" : "不明"
         },
        {
         "name": "total_amount",
         "disp_name": "最終ポジション量",
         "value" : "不明"
         },
        {
         "name": "position_sell_limit_price",
         "disp_name": "売り指値",
         "value" : 0
         },
        {
         "name": "ticker_buy",
         "disp_name": "BID",
         "value" : 0
         },
        {
         "name": "ticker_sell",
         "disp_name": "ASK",
         "value" : 0
         },
        {
         "name": "total_profit",
         "disp_name": "最終利益",
         "value" : 0
         },
      ]
    }
  },
  created: function() {
    firebase
        .database()
        .ref(BOT_DATA_PATH)
        .on("value", (result) => {
          this.bot_data = result.val();
          for (let n of this.disp_elements){
            n.value = this.bot_data[n.name];
            if (n.name === "total_profit") {
              n.value = Math.round(n.value) + "円"
            }
            if (n.name === "total_amount") {
              n.value = Math.round(n.value * 100) /100
            }
          }
          if ('results' in this.bot_data){
            this.results = this.bot_data.results;
            for (let key in this.results){
              this.results[key].profit = Math.round(this.results[key].profit) + "円"
            }
          }
        });    
  }
};
</script>
