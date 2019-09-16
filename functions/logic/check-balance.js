let bitbank  = require("../api_wrapper/bitbank");
let firebase = require("../api_wrapper/firebase");
let oanda    = require("../api_wrapper/oanda-promise/oanda-promise-extend");
let env      = require("../_env")

exports.doExecute = async() => {
    let balance = {
        'bitbank-primary':0,
        'oanda-primary'  :0,
        'oanda-iwashi'   :0,
        'oanda-sawara'   :0,
        'oanda-saba'     :0,
        'oanda-tara'     :0,
        'oanda-aji'      :0
    }

    let bitbank_balance = await bitbank.getAssets();
    balance["bitbank-primary"] = bitbank_balance.data.assets[0].free_amount;

    let api = new oanda.ExtendApi({
        'token'     : env.apiToken,
        'endPoint'  : env.uri
    });
    
    api.accountID = env.accountID_Primary;
    let oanda_balance = await api.getAccount();
    balance["oanda-primary"] = oanda_balance.account.balance;

    api.accountID = env.accountID_iwashi;
    oanda_balance = await api.getAccount();
    balance["oanda-iwashi"] = oanda_balance.account.balance;

    api.accountID = env.accountID_saba;
    oanda_balance = await api.getAccount();
    balance["oanda-saba"] = oanda_balance.account.balance;

    api.accountID = env.accountID_tara;
    oanda_balance = await api.getAccount();
    balance["oanda-tara"] = oanda_balance.account.balance;

    api.accountID = env.accountID_sawara;
    oanda_balance = await api.getAccount();
    balance["oanda-sawara"] = oanda_balance.account.balance;

    api.accountID = env.accountID_aji;
    oanda_balance = await api.getAccount();
    balance["oanda-aji"] = oanda_balance.account.balance;

    let date = new Date().getTime();
    await firebase.setData('/balance-history/' + date.toString(), balance);
}
