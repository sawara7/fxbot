/*

*/
const functions = require('firebase-functions');
const TRIGGER_TIME_OANDA_PRIMARY = "0 * * * *"
const TRIGGER_TIME_OANDA_IWASHI  = "30 * * * *"
const TRIGGER_TIME_OANDA_TARA    = "1 0,4,8,12,16,20 * * *"
const TRIGGER_TIME_OANDA_SABA    = "11 0,4,8,12,16,20 * * *"
const TRIGGER_TIME_OANDA_AJI     = "21 0,4,8,12,16,20 * * *"
const TRIGGER_TIME_OANDA_SAWARA  = "31 0,4,8,12,16,20 * * *"
const TRIGGER_TIME_EVERY_MINUTE  = "* * * * *"
const TRIGGER_TIME_BALANCE       = "1 * * * *"
const TRIGGER_TIME_BITFLYER_TICKER = "* * * * *"
const TRIGGER_TIME_BITFLYER_POSITION = "* * * * *"

// exports.oandaPrimaryFunction = functions.pubsub.schedule(TRIGGER_TIME_OANDA_PRIMARY).onRun((context) => {
//     let primary = require("./logic/oanda-primary");
//     primary.doExecute();
// });

// exports.oandaIwashiFunction = functions.pubsub.schedule(TRIGGER_TIME_OANDA_IWASHI).onRun((context) => {
//     let iwashi = require("./logic/oanda-iwashi");
//     iwashi.doExecute();
// });

// exports.oandaTaraFunction = functions.pubsub.schedule(TRIGGER_TIME_OANDA_TARA).onRun((context) => {
//     let tara = require("./logic/oanda-tara");
//     tara.doExecute();
// });

// exports.oandaSabaFunction = functions.pubsub.schedule(TRIGGER_TIME_OANDA_SABA).onRun((context) => {
//     let saba = require("./logic/oanda-saba");
//     saba.doExecute();
// });

// exports.oandaAjiFunction = functions.pubsub.schedule(TRIGGER_TIME_OANDA_AJI).onRun((context) => {
//     let aji = require("./logic/oanda-aji");
//     aji.doExecute();
// });

// exports.oandaSawaraFunction = functions.pubsub.schedule(TRIGGER_TIME_OANDA_SAWARA).onRun((context) => {
//     let sawara = require("./logic/oanda-sawara");
//     sawara.doExecute();
// });

exports.bitbankBTCFunction = functions.pubsub.schedule(TRIGGER_TIME_EVERY_MINUTE).onRun((context) => {
    (async () => {
        let bb = require("./logic/bitbank-averaging");
        await bb.doExecute('btc_jpy',  0.0001, 2); //0.0001
        await bb.doExecute('xrp_jpy',  0.1,    2); //0.0001
        await bb.doExecute('bcc_jpy',  0.001,  2); //0.0001
        await bb.doExecute('mona_jpy', 0.01,   2); //0.0001
        let balance = require("./logic/check-balance");
        await balance.doExecute();
    })();
});

// exports.bitflyerTickerFunction = functions.pubsub.schedule(TRIGGER_TIME_BITFLYER_TICKER).onRun((context) => {
//     let bf = require("./logic/bitflyer-ticker")
//     bf.doExecute();
// });

// exports.bitflyerPositionFunction = functions.pubsub.schedule(TRIGGER_TIME_BITFLYER_POSITION).onRun((context) => {
//     let bf = require("./logic/bitflyer-position")
//     bf.doExecute();
// });
