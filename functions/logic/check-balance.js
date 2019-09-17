let bitbank  = require("../api_wrapper/bitbank");
let firebase = require("../api_wrapper/firebase");
let oanda    = require("../api_wrapper/oanda-promise/oanda-promise-extend");
let env      = require("../_env")

exports.doExecute = async() => {
    let date = new Date().getTime();
    let bitbank_balance = await bitbank.getAssets();
    let total_balance = bitbank_balance.data.assets[0].free_amount;
    await firebase.setData('/balance-history/' + "bitbank/primary/" + date.toString() + "/balance", total_balance);

    let api = new oanda.ExtendApi({
        'token'     : env.apiToken,
        'endPoint'  : env.uri
    });

    api.accountID = env.accountID_Primary;
    let oanda_balance = await api.getAccount();
    await firebase.setData('/balance-history/' + "oanda/primary/" + date.toString() + "/nav", oanda_balance.account.NAV);
    await firebase.setData('/balance-history/' + "oanda/primary/" + date.toString() + "/balance", oanda_balance.account.balance);

    api.accountID = env.accountID_iwashi;
    oanda_balance = await api.getAccount();
    await firebase.setData('/balance-history/' + "oanda/iwashi/" + date.toString() + "/nav", oanda_balance.account.NAV);
    await firebase.setData('/balance-history/' + "oanda/iwashi/" + date.toString() + "/balance", oanda_balance.account.balance);

    api.accountID = env.accountID_saba;
    oanda_balance = await api.getAccount();
    await firebase.setData('/balance-history/' + "oanda/saba/" + date.toString() + "/nav", oanda_balance.account.NAV);
    await firebase.setData('/balance-history/' + "oanda/saba/" + date.toString() + "/balance", oanda_balance.account.balance);

    api.accountID = env.accountID_tara;
    oanda_balance = await api.getAccount();
    await firebase.setData('/balance-history/' + "oanda/tara/" + date.toString() + "/nav", oanda_balance.account.NAV);
    await firebase.setData('/balance-history/' + "oanda/tara/" + date.toString() + "/balance", oanda_balance.account.balance);

    api.accountID = env.accountID_sawara;
    oanda_balance = await api.getAccount();
    await firebase.setData('/balance-history/' + "oanda/sawara/" + date.toString() + "/nav", oanda_balance.account.NAV);
    await firebase.setData('/balance-history/' + "oanda/sawara/" + date.toString() + "/balance", oanda_balance.account.balance);

    api.accountID = env.accountID_aji;
    oanda_balance = await api.getAccount();
    await firebase.setData('/balance-history/' + "oanda/aji/" + date.toString() + "/nav", oanda_balance.account.NAV);
    await firebase.setData('/balance-history/' + "oanda/aji/" + date.toString() + "/balance", oanda_balance.account.balance);
}
