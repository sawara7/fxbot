let bitflyer = require("../api_wrapper/bitflyer")
let firebase = require("../api_wrapper/firebase")
const env     = require('../_env')

let bf = new bitflyer.Api({
    "endPoint" : env.bitflyerURL,
    "key" : env.apiKey,
    "secret" : env.secret
});

const PAIR = 'FX_BTC_JPY';
const SIZE = 0.01;

exports.doExecute = async() => {
    let collateral = await bf.getCollateral();
    let side = "BUY";
    let price = 0;
    if (collateral.open_position_pnl !== 0){
        return 'nothing'
    }

    let bot_parameter = await firebase.getData("/bot/bitflyer/");
    let range = Math.round(bot_parameter.execution.std);
    let minmax = bot_parameter.execution.minmax;
    let tk = await bf.getTicker("FX_BTC_JPY");

    if (range < 500){
        return 'nothing'
    }

    console.log(minmax, range);
    if (minmax.max_time < 1000 *10 && minmax.min_time > 1000 * 60 * 3){
        side = "SELL"
        price = tk.best_bid;
    }else if(minmax.min_time < 1000 * 10 && minmax.max_time > 1000 * 60 * 3){
        side = "BUY"
        price = tk.best_ask;
    }else{
        return "nothing"
    }

    await bf.sendIFDOCOOrder(PAIR, side, SIZE, price, range, range);
    return 'ok'
}
