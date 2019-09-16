/*

*/
const functions = require('firebase-functions');
const TRIGGER_TIME_OANDA_PRIMARY = "0 * * * 1,2,3,4,5,6"
const TRIGGER_TIME_OANDA_IWASHI  = "30 * * * 1,2,3,4,5,6"
const TRIGGER_TIME_OANDA_TARA    = "1 1 * * 1,2,3,4,5,6"
const TRIGGER_TIME_OANDA_SABA    = "1 2 * * 1,2,3,4,5,6"
const TRIGGER_TIME_OANDA_AJI     = "1 3 * * 1,2,3,4,5,6"
const TRIGGER_TIME_OANDA_SAWARA  = "1 4 * * 1,2,3,4,5,6"
const TRIGGER_TIME_BITBANK_MONA  = "* * * * *"
const TRIGGER_TIME_BALANCE       = "1 * * * *"

exports.oandaPrimaryFunction = functions.pubsub.schedule(TRIGGER_TIME_OANDA_PRIMARY).onRun((context) => {
    let primary = reqeuire("./logic/oanda-primary");
    primary.doExecute();
});

exports.oandaIwashiFunction = functions.pubsub.schedule(TRIGGER_TIME_OANDA_IWASHI).onRun((context) => {
    let iwashi = reqeuire("./logic/oanda-iwashi");
    iwashi.doExecute();
});

exports.oandaTaraFunction = functions.pubsub.schedule(TRIGGER_TIME_OANDA_TARA).onRun((context) => {
    let tara = reqeuire("./logic/oanda-tara");
    tara.doExecute();
});

exports.oandaSabaFunction = functions.pubsub.schedule(TRIGGER_TIME_OANDA_SABA).onRun((context) => {
    let saba = reqeuire("./logic/oanda-saba");
    saba.doExecute();
});

exports.oandaAjiFunction = functions.pubsub.schedule(TRIGGER_TIME_OANDA_AJI).onRun((context) => {
    let aji = reqeuire("./logic/oanda-aji");
    aji.doExecute();
});

exports.oandaSawaraFunction = functions.pubsub.schedule(TRIGGER_TIME_OANDA_SAWARA).onRun((context) => {
    let sawara = reqeuire("./logic/oanda-sawara");
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
