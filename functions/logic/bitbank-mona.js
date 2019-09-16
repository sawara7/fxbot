let bitbank = require("../api_wrapper/bitbank")

const PAIR   = 'mona_jpy';
const AMOUNT = 0.005;

exports.doExecute = async() => {
    await bitbank.BuyMarket(PAIR, AMOUNT);
}
