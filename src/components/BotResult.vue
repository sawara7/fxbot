<template>
  <div>
    <div> {{ bot_name }} </div>
    <div 
    v-for="(element) in disp_elements">
      {{element.disp_name}} : {{element.value}}
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
      disp_elements :[
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
        });    
  }
};
</script>
