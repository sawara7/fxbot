const functions = require('firebase-functions');
const bb = require('./bitbank');
const oanda = require('./oanda');

exports.bitbankEarlyMorningFunction = functions.pubsub.schedule("00 12 * * *").onRun((context) => {
    bb.DobitbankEarlyMorningFunction();
});

exports.oandaFunction = functions.pubsub.schedule("59 13 * * *").onRun((context) => {
    oanda.OrderMarket();
});