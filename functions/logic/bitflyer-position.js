let bitflyer = require("../api_wrapper/bitflyer")
let firebase = require("../api_wrapper/firebase")
let bitbank = require("../api_wrapper/bitbank")
const env    = require('../_env')

let bf = new bitflyer.Api({
    "endPoint"  : env.bitflyerURL,
    "key"       : env.apiKey,
    "secret"    : env.secret
});

const PAIR = 'FX_BTC_JPY';
const SIZE = 0.01;


let getCandlestickLastDay = async function(pair, type){
    let res = {};
    let dt = new Date();
    var y = dt.getFullYear();
    let result = await bitbank.getCandlestic(pair, type, y);
    if (result.data.candlestick){
        let ohlcv = result.data.candlestick[0].ohlcv.pop();
        res = {
            //始値, 高値, 安値, 終値, 出来高, UnixTimeのミリ秒
            "start" : Number(ohlcv[0]), 
            "high"  : Number(ohlcv[1]),
            "low"   : Number(ohlcv[2]),
            "end"   : Number(ohlcv[3]),
            "volume": Number(ohlcv[4]),
            "time"  : Number(ohlcv[5])
        };
    }
    return res;
}

let getCandlestickLastWeek = async function(pair, type){
    let res = {};
    let dt = new Date();
    var y = dt.getFullYear();
    let result = await bitbank.getCandlestic(pair, type, y);
    if (result.data.candlestick){
        let ohlcv = result.data.candlestick[0].ohlcv;
        res = {
            //始値, 高値, 安値, 終値, 出来高, UnixTimeのミリ秒
            "start":0,"high":0,"low":99999999,"end":0,"volume":0,"time":0            
        }
        for (let i=0; i<10; i++){
            let candle = ohlcv.pop();
            //始値, 高値, 安値, 終値, 出来高, UnixTimeのミリ秒
            res["start"] = i===6                            ? Number(candle[0]): res["start"], 
            res["high"]  = Number(candle[1]) > res["high"]  ? Number(candle[1]): res["high"],
            res["low"]   = Number(candle[2]) < res["low"]   ? Number(candle[2]): res["low"],
            res["end"]   = i===0                            ? Number(candle[3]): res["end"],
            res["volume"] += Number(candle[4]),
            res["time"]  = Number(candle[5])
        }
    }
    return res;
}

exports.doExecute = async() => {
    let collateral = await bf.getCollateral();
    let side = "BUY";
    let price = 0;
    if (collateral.open_position_pnl !== 0){
        return 'nothing'
    }

    let bftk = await bf.getTicker("FX_BTC_JPY");

    // get ticker
    let pair = "btc_jpy"
    let tk = await bitbank.getTicker(pair);
 
    // get candlestick
    let candle = await getCandlestickLastDay(pair, "4hour");
 
    let rate = Math.round( ((candle.high - tk.buy) / (candle.high - candle.low)) * 10)/10;
    if (rate > 1) { rate = 1}
    if (rate <= 0){ return "0"}
    console.log("== rate", rate);
    
    if (rate < 0.2){
        price = bftk.best_ask;
        side = "BUY";
    }else if (rate > 0.8){
        price = bftk.best_bid;
        side = "SELL";
    }else{
        return false;
    }

    await bf.sendIFDOCOOrder(PAIR, side, SIZE, price, 2000, 2000);
    return 'ok'
}
