let oanda = require("../api_wrapper/oanda-promise/oanda-promise-extend")
let env   = require("../_env");

const ORDER_REQUEST = {
    'type'          : 'MARKET',
    'instrument'    : 'AUD_JPY',
    'units'         : 10,
    'timeInForce'   : 'FOK',
    'positionFill'  : 'DEFAULT'
};

let api = new oanda.ExtendApi({
    'token'     : env.apiToken,
    'endPoint'  : env.uri
});

exports.doExecute = async() => {
    let res;
    api.accountID = env.accountID_tara;
    try {
        res = await api.postOrder(ORDER_REQUEST);
    }catch(e){
        console.log(e);
    }
    console.log(res);
}
