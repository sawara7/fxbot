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

    let tk = await bf.getTicker(PAIR);
    let current_ltp = tk.ltp;
    let average_ltp = await firebase.getData("/bot/bitflyer/ticker/fxbtcjpy");
    if (current_ltp > average_ltp){
        side = "BUY";
        price = tk.best_ask;
    }else{
        side = "SELL";
        price = tk.best_bid;
    }

    await bf.sendIFDOCOOrder(PAIR, side, SIZE, price, 1000, 5000);
    return 'ok'
}
