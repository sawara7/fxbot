let bitflyer = require("../api_wrapper/bitflyer")
let firebase = require("../api_wrapper/firebase")
const env     = require('../_env')

let bf = new bitflyer.Api({
    "endPoint" : env.bitflyerURL,
    "key" : env.apiKey,
    "secret" : env.secret
});

 let params = {
    "code":'FX_BTC_JPY',
    "type":'MARKET',
    "size": 0.01
 }

exports.doExecute = async() => {
    let collateral = await bf.getCollateral();
    let tk = await bf.getTicker(params.code);
    let current_ltp = tk.ltp;
    let average_ltp = await firebase.getData("/bot/bitflyer/ticker/fxbtcjpy");
    let position_side = await firebase.getData("/bot/bitflyer/position/fxbtcjpy");
    if (collateral.open_position_pnl === 0){
        if (current_ltp > average_ltp){
            params["side"] = "BUY";
        }else{
            params["side"] = "SELL";
        }
    }else if(collateral.open_position_pnl > 30){
        if (position_side === "BUY"){
            params["side"] = "SELL";
        }
        if (position_side === "SELL"){
            params["side"] = "BUY";
        }
    }else{
        return 'nothing'
    }
    await bf.sendChildOrder(params);
    await firebase.setData("/bot/bitflyer/position/fxbtcjpy", params.side);
    return 'ok'
}
