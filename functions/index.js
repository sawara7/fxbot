const functions = require('firebase-functions');
const bb = require('./bitbank');
const oanda = require('./oanda');

exports.oandaFunction = functions.pubsub.schedule("59 13 * * *").onRun((context) => {
    oanda.OrderMarket();
});