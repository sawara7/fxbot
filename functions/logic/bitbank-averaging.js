let bitbank = require("../api_wrapper/bitbank");
let firebase = require("../api_wrapper/firebase");

const FIREBASAE_BOT_BITBANK = "/bot/bitbank/";
let getAsset = async function(pair) {
    let res = {};
    let asset_string = String(pair).match("^.*?_")[0];
    if (asset_string.length > 0){
        asset_string = asset_string.slice(0, asset_string.length - 1);
    }
    let assets = await bitbank.getAssets();
    for (let ass of assets.data.assets){
        if (ass.asset === asset_string){
            res = ass;
        }
    }
    return res;
}

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
        for (let i=0; i<7; i++){
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

exports.closePosition = async(pair, percent) => {
    // get ticker
    console.log("== start", pair, amount, percent);
    let tk = await bitbank.getTicker(pair);
    console.log("== getTicker");
    
    // get data
    let data = await firebase.getData(FIREBASAE_BOT_BITBANK + pair);
    console.log("== getData");
    if (data.price === 0){
        data.price = tk.buy;
    }

    // get asset
    let asset = await getAsset(pair);
    let free_amount = Math.floor(Number(asset.free_amount)*10000)/10000;
    console.log("== getAsset",pair,free_amount);
    
    // close
    if (free_amount > 0){
        console.log("== calc position", tk.sell , data.price * (1.0 + percent/100));
        if (tk.sell > data.price * (1.0 + percent/100)){
            console.log("== close_position");
            await bitbank.SellMarket(pair, free_amount);
            data = { "price":0 };
            await firebase.setData(FIREBASAE_BOT_BITBANK + pair, data);
            return "== end close position"
        }
    }else{
        data = { "price":0 };
        console.log("== price reset");
    }
    return 'ok'
}

exports.doExecute = async(pair, amount, percent) => {
    
    // get ticker
    console.log("== start", pair, amount, percent);
    let tk = await bitbank.getTicker(pair);
    console.log("== getTicker");

    // get data
    let data = await firebase.getData(FIREBASAE_BOT_BITBANK + pair);
    console.log("== getData");
    if (data.price === 0){
        data.price = tk.buy;
    }

    // get asset
    let asset = await getAsset(pair);
    let free_amount = Math.floor(Number(asset.free_amount)*10000)/10000;
    console.log("== getAsset",pair,free_amount);
    
    // close
    if (free_amount > 0){
        console.log("== calc position", tk.sell , data.price * (1.0 + percent/100));
        if (tk.sell > data.price * (1.0 + percent/100)){
            console.log("== close_position");
            await bitbank.SellMarket(pair, free_amount);
            data = { "price":0 };
            await firebase.setData(FIREBASAE_BOT_BITBANK + pair, data);
            return "== end close position"
        }
    }else{
        data = { "price":0 };
        console.log("== price reset");
    }

    // get candlestick
    let candle = await getCandlestickLastWeek(pair, "1day");
    console.log("== candlestick", candle);

    let rate = Math.round( ((candle.high - tk.buy) / (candle.high - candle.low)) * 10)/10;
    if (rate > 1) { rate = 1}
    if (rate <= 0){ return "0"}
    console.log("== rate", rate);
    
    // Buy
    amount = amount * rate;
    await bitbank.BuyMarket(pair, amount);
    console.log("== buy", amount);

    // set data
    data.price = (free_amount * data.price + tk.buy * amount) / (free_amount + amount);
    await firebase.setData(FIREBASAE_BOT_BITBANK + pair, data);
    console.log("== set data", data.price);

    return 'ok'
}
