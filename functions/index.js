const functions = require('firebase-functions');
const bb        = require('./bitbank');
const oanda     = require('./oanda');
const env       = require('./_env.js');

exports.oandaFunction = functions.pubsub.schedule("59 13 * * *").onRun((context) => {
    oanda.OrderMarketAM6();
});

exports.oandaFunction2 = functions.pubsub.schedule("59 * * * *").onRun((context) => {
    oanda.ConstantOrder(env.accountID_sub5,"TRY_JPY", 20, 0.01);
});

exports.bitbankFunction = functions.pubsub.schedule("* * * * *").onRun((context) => {
    bb.DobitbankFunction();
});
