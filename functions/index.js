/*

*/

const functions = require('firebase-functions');
const TRIGGER_TIME_EVERY_MINUTE  = "* * * * *"

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

const runtimeOpts = {
    timeoutSeconds: 300,
    memory: '1GB'
  }
  
// exports.oandaFunction = functions.pubsub.schedule(TRIGGER_TIME_EVERY_MINUTE).onRun((context) => {
//     let oanda = require("./logic/oanda-averaging");
//     oanda.doExecute();
//     return {};
// });

// exports.bitbankFunction = functions.pubsub.schedule(TRIGGER_TIME_EVERY_MINUTE).onRun((context) => {
//     let d = new Date();
//     let minute = d.getMinutes();
//     (async () => {
//         let time = new Date().getTime();
//         let bb = require("./logic/bitbank-averaging");
//         await bb.doExecute('mona_jpy', 0.2000, 1); //0.0001 120 1.20yen/min
//         await bb.doExecute('bcc_jpy',  0.0020, 1); //0.0001 23700 23.7yen/min
//         console.log("=== end function. it took ", new Date().getTime() - time);
//     })();
//     return {};
// });

// exports.bitbankFunction2 = functions.pubsub.schedule(TRIGGER_TIME_EVERY_MINUTE).onRun((context) => {
//     let d = new Date();
//     let minute = d.getMinutes();
//     (async () => {
//         let time = new Date().getTime();
//         let bb = require("./logic/bitbank-averaging");
//         await sleep(5000);
//         await bb.doExecute('xrp_jpy',  1.5000, 2); //0.0001 27
//         if (minute === 1 || minute === 21 || minute === 41 ){
//             await bb.doExecute('btc_jpy',  0.0010, 1); //0.0001 900000
//         }
//         console.log("=== end function. it took ", new Date().getTime() - time);
//     })();
//     return {};
// });

// exports.bitbankFunction3 = functions.pubsub.schedule(TRIGGER_TIME_EVERY_MINUTE).onRun((context) => {
//     let d = new Date();
//     let minute = d.getMinutes();
//     (async () => {
//         let time = new Date().getTime();
//         let bb = require("./logic/bitbank-averaging");
//         await sleep(10000);
//         await bb.doExecute('eth_btc',  0.0010, 1);
//         await bb.doExecute('ltc_btc',  0.0010, 1);
//         console.log("=== end function. it took ", new Date().getTime() - time);
//     })();
//     return {};
// });

// exports.bitFlyerFunction = functions.pubsub.schedule(TRIGGER_TIME_EVERY_MINUTE).onRun((context) => {
//     let bf = require("./logic/bitflyer-position")
//     bf.doExecute();
//     return {};
// });
