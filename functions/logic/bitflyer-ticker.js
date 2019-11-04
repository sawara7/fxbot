let bitflyer = require("../api_wrapper/bitflyer")
let firebase = require("../api_wrapper/firebase");
const env     = require('../_env');

let bf = new bitflyer.Api({
    "endPoint" : env.bitflyerURL,
    "key"      : env.apiKey,
    "secret"   : env.secret
});

const PAIR = 'FX_BTC_JPY';

exports.doExecute = async() => {
    let tk = await bf.getTicker(PAIR);
    let ltp = tk.ltp;
    let pre = await firebase.getData("/bot/bitflyer/ticker/fxbtcjpy");
    let average = 0;
    if (pre && pre > 1000){
        if (ltp && ltp > 1000){
            average = pre * 0.9 + ltp * 0.1;
        }else{
            average = pre;
        }
    }else{
        if (ltp && ltp > 1000){
            average = ltp;
        }else{
            return
        }
    }
    await firebase.setData("/bot/bitflyer/ticker/fxbtcjpy", ticker);
}
