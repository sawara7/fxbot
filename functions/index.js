const functions = require('firebase-functions');
const bb = require('./bitbank');

exports.bitbankEarlyMorningFunction = functions.pubsub.schedule("00 12 * * *").onRun((context) => {
    bb.DobitbankEarlyMorningFunction();
});
