const functions = require('firebase-functions');
const bb = require('./bitbank');
const oanda = require('./oanda');

exports.bitbankAM4Function = functions.pubsub.schedule("00 12 * * *").onRun((context) => {
    bb.DobitbankAM4Function();
});

<<<<<<< HEAD
exports.bitbankAM7Function = functions.pubsub.schedule("00 15 * * *").onRun((context) => {
    bb.DobitbankAM7Function();
});

=======
>>>>>>> 276f4a428e1c7a0ecca41af3308c30bdec16c767
exports.oandaFunction = functions.pubsub.schedule("59 13 * * *").onRun((context) => {
    oanda.OrderMarket();
});