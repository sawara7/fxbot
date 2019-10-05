let bitbank = require("../api_wrapper/bitbank");
let firebase = require("../api_wrapper/firebase");

const FIREBASAE_BOT_BITBANK = "/bot/bitbank/";
let getAsset = async function(pair) {
    let res;
    let asset_string = String(pair).match("^.*?_")[0];
    if (asset_string.length > 0){
        asset_string = asset_string.slice(0, asset_string.length - 1);
    }
    let assets = await bitbank.getAssets();
    for (let ass of assets.data.assets){
        if (ass.asset === asset_string){
            return ass;
        }
    }
    return res;
}

exports.doExecute = async(pair, amount, percent) => {
    let tk = await bitbank.getTicker(pair);
    let data = await firebase.getData(FIREBASAE_BOT_BITBANK + pair);
    let asset = await getAsset(pair);
    let free_amount = Math.floor(Number(asset.free_amount)*(10^4))/(10^4);
    console.log(pair,free_amount);
    if (data){
        if (tk.sell > data.price * (1.0 + percent/100)){
            console.log(pair, "close_position");
            await bitbank.SellMarket(pair, free_amount);
            data = { "price":0 };
            await firebase.setData(FIREBASAE_BOT_BITBANK + pair, data);
            return 'ok'
        }
    }else{
        data = { "price":0 };
    }
    await bitbank.BuyMarket(pair, amount);
    data.price = ((free_amount * data.price) + tk.buy * amount)/(free_amount+amount);
    await firebase.setData(FIREBASAE_BOT_BITBANK + pair, data);
    return 'ok'
}
