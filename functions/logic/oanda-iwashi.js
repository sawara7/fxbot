
let oanda = require("../api_wrapper/oanda-promise/oanda-promise-extend")
let env   = require("../_env");

let ORDER_REQUEST = {
    'type'          : 'MARKET',
    'instrument'    : 'TRY_JPY',
    'units'         : 15,
    'timeInForce'   : 'FOK',
    'positionFill'  : 'DEFAULT'
};

let api = new oanda.ExtendApi({
    'token'     : env.apiToken,
    'endPoint'  : env.uri
});

exports.doExecute = async() => {
    let res;
    api.accountID = env.accountID_iwashi;
    let price = await api.getPricing({'instruments':'TRY_JPY'});
    let price_sell;
    for (let p of price.prices){
        if (p.instrument === 'TRY_JPY'){
            price_sell = Number(p.bids[0].price) * (1 + 1);
            price_sell = Math.ceil(price_sell * 1000) / 1000;
        }
    }    
    try {
        ORDER_REQUEST['takeProfitOnFill'] = {
            'price': String(price_sell)
        }
        res = await api.postOrder(ORDER_REQUEST);
    }catch(e){
        console.log(e);
    }
    console.log(res);
}