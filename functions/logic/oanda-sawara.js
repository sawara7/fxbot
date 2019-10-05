let oanda = require("../api_wrapper/oanda-promise/oanda-promise-extend")
let env   = require("../_env");

const ORDER_REQUEST = {
    'type'          : 'MARKET',
    'instrument'    : 'ZAR_JPY',
    'units'         : 300,
    'timeInForce'   : 'FOK',
    'positionFill'  : 'DEFAULT'
};

let api = new oanda.ExtendApi({
    'token'     : env.apiToken,
    'endPoint'  : env.uri
});

exports.doExecute = async() => {
    let res;
    api.accountID = env.accountID_sawara;
    try {
        res = await api.postOrder(ORDER_REQUEST);
    }catch(e){
        console.log(e);
    }
    console.log(res);
}
