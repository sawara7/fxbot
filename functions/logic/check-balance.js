/* eslint-disable promise/catch-or-return */
let bitbank  = require("../api_wrapper/bitbank");
let firebase = require("../api_wrapper/firebase");
let oanda    = require("../api_wrapper/oanda-promise/oanda-promise-extend");
let env      = require("../_env")

exports.doExecute = async() => {
    let date = new Date().getTime();
    let bitbank_balance = await bitbank.getAssets();
    let total_balance = 0;
    await Promise.all(
        bitbank_balance.data.assets.map(
            async asset => {
                if (asset.asset === "jpy"){
                    total_balance += Number(asset.free_amount);
                }else if(asset.onhand_amount > 0){
                    let ticker = await bitbank.getTicker(asset.asset + "_jpy");
                    total_balance += Number(asset.onhand_amount) * Number(ticker.buy);
                }
            }
        )
    )
    await firebase.setData('/balance-history/' + "bitbank/primary/" + date.toString() + "/nav", total_balance);
    await firebase.setData('/balance-history/' + "bitbank/primary/" + date.toString() + "/balance", total_balance);

    let api = new oanda.ExtendApi({
        'token'     : env.apiToken,
        'endPoint'  : env.uri
    });

    let list = Object.keys(env.accountIDList);
    Promise.all(
        list.map(async key => {
            api.accountID = env.accountIDList[key];
            let oanda_balance = await api.getAccount();
            await firebase.setData('/balance-history/' + "oanda/" + key + "/" + date.toString() + "/nav", oanda_balance.account.NAV);
            await firebase.setData('/balance-history/' + "oanda/" + key + "/" + date.toString() + "/balance", oanda_balance.account.balance);
        })
    )
    console.log("ok")
}