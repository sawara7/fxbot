/*

*/
const functions = require('firebase-functions');
const TRIGGER_TIME_OANDA_PRIMARY = "0 * * * *"
const TRIGGER_TIME_OANDA_IWASHI  = "30 * * * *"
const TRIGGER_TIME_OANDA_TARA    = "1 0,4,8,12,16,20 * * *"
const TRIGGER_TIME_OANDA_SABA    = "11 0,4,8,12,16,20 * * *"
const TRIGGER_TIME_OANDA_AJI     = "21 0,4,8,12,16,20 * * *"
const TRIGGER_TIME_OANDA_SAWARA  = "31 0,4,8,12,16,20 * * *"
const TRIGGER_TIME_BITBANK_MONA  = "* * * * *"
const TRIGGER_TIME_BALANCE       = "1 * * * *"
const TRIGGER_TIME_BITFLYER_TICKER = "* * * * *"
const TRIGGER_TIME_BITFLYER_POSITION = "* * * * *"

exports.oandaPrimaryFunction = functions.pubsub.schedule(TRIGGER_TIME_OANDA_PRIMARY).onRun((context) => {
    let primary = require("./logic/oanda-primary");
    primary.doExecute();
});

exports.oandaIwashiFunction = functions.pubsub.schedule(TRIGGER_TIME_OANDA_IWASHI).onRun((context) => {
    let iwashi = require("./logic/oanda-iwashi");
    iwashi.doExecute();
});

exports.oandaTaraFunction = functions.pubsub.schedule(TRIGGER_TIME_OANDA_TARA).onRun((context) => {
    let tara = require("./logic/oanda-tara");
    tara.doExecute();
});

exports.oandaSabaFunction = functions.pubsub.schedule(TRIGGER_TIME_OANDA_SABA).onRun((context) => {
    let saba = require("./logic/oanda-saba");
    saba.doExecute();
});

exports.oandaAjiFunction = functions.pubsub.schedule(TRIGGER_TIME_OANDA_AJI).onRun((context) => {
    let aji = require("./logic/oanda-aji");
    aji.doExecute();
});

exports.oandaSawaraFunction = functions.pubsub.schedule(TRIGGER_TIME_OANDA_SAWARA).onRun((context) => {
    let sawara = require("./logic/oanda-sawara");
    sawara.doExecute();
});

exports.bitbankMonaFunction = functions.pubsub.schedule(TRIGGER_TIME_BITBANK_MONA).onRun((context) => {
    let mona = require("./logic/bitbank-mona")
    mona.doExecute();
});

exports.checkBalanceFunction = functions.pubsub.schedule(TRIGGER_TIME_BALANCE).onRun((context) => {
    let balance = require("./logic/check-balance")
    balance.doExecute();
});

exports.bitflyerTickerFunction = functions.pubsub.schedule(TRIGGER_TIME_BITFLYER_TICKER).onRun((context) => {
    let bf = require("./logic/bitflyer-ticker")
    bf.doExecute();
});

exports.bitflyerPositionFunction = functions.pubsub.schedule(TRIGGER_TIME_BITFLYER_POSITION).onRun((context) => {
    let bf = require("./logic/bitflyer-btcjphy")
    bf.doExecute();
});
