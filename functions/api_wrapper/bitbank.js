const bitbank = require('node-bitbankcc');
const env     = require('../_env');

const conf_public = {
    'endPoint': env.URL_BB_PUBLIC,  // required
    'keepAlive': false,             // optional, default false
    'timeout': 3000,                // optional, default 3000
};

const conf_private = {
    'endPoint': env.URL_BB_PRIVATE, // required
    'apiKey': env.ACCOUNT_BB,		// required
    'apiSecret': env.APIKEY_BB,		// required
    'keepAlive': false,				// optional, default->false
    'timeout': 3000					// optional, default->3000
};

let publicApi =new bitbank.PublicApi(conf_public);
let privateApi = new bitbank.PrivateApi(conf_private);

let getTicker = async (pair) => { 
    let params = {'pair': pair};
    let res = await publicApi.getTicker(params) 
    return res.data;
};

let BuyMarket = async (pair, amount) => {
    let params = {
        'pair': pair,
        'amount': amount,
        'side': 'buy',
        'type': 'market'
    };
    let result = await privateApi.postOrder(params);
    return result.data;
};

let SellMarket = async (pair, amount) => {
    let params = {
        'pair': pair,
        'amount': amount,
        'side': 'sell',
        'type': 'market'
    };
    let result = await privateApi.postOrder(params);
    return result.data;
};

let getAssets = async() => {
    return await privateApi.getAssets();
}

exports.BuyMarket   = BuyMarket;
exports.SellMarket  = SellMarket;
exports.getTicker   = getTicker;
exports.getAssets   = getAssets;