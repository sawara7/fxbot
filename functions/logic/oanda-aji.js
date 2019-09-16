let oanda = require("../api_wrapper/oanda-promise/oanda-promise-extend")
let env   = require("../_env");

const ORDER_REQUEST = {
    'type'          : 'MARKET',
    'instrument'    : 'USD_JPY',
    'units'         : 200,
    'timeInForce'   : 'FOK',
    'positionFill'  : 'DEFAULT'
};

let api = new oanda.ExtendApi({
    'token'     : env.apiToken,
    'endPoint'  : env.uri
});

exports.doExecute = async() => {
    api.accountID = env.accountID_aji;
    let res;
    try {
        res = await api.postOrder(ORDER_REQUEST);
    }catch(e){
        console.log(e);
    }
    console.log(res);
}
