const bitbank = require('node-bitbankcc');
const env = require('./_env');

const conf_public = {
    'endPoint': env.URL_BB_PUBLIC,    // required
    'keepAlive': false,               // optional, default false
    'timeout': 3000,                  // optional, default 3000
};

const conf_private = {
    'endPoint': env.URL_BB_PRIVATE,  	// required
    'apiKey': env.ACCOUNT_BB,		    // required
    'apiSecret': env.APIKEY_BB,		// required
    'keepAlive': false,				// optional, default->false
    'timeout': 3000					// optional, default->3000
};

const publicApi =new bitbank.PublicApi(conf_public);
const privateApi = new bitbank.PrivateApi(conf_private);

const Ticker = async (pair) => { 
    const params = {'pair': pair};
    const res = await publicApi.getTicker(params);
    console.log(res.data);
};

const BuyMarket = async (pair, amount) => {
    const params = {
        'pair': pair,
        'amount': amount,
        'side': 'buy',
        'type': 'market'
    };
    const result = await privateApi.postOrder(params);
    console.log(result.data);
};

const SellMarket = async (pair, amount) => {
    const params = {
        'pair': pair,
        'amount': amount,
        'side': 'sell',
        'type': 'market'
    };
    const result = await privateApi.postOrder(params);
    console.log(result.data);
};

exports.DobitbankAM4Function = async() => {
    await BuyMarket('mona_jpy', 500);
    return 'ok';
}

exports.DobitbankAM7Function = async() => {
    await SellMarket('mona_jpy', 500);
    return 'ok';
}
