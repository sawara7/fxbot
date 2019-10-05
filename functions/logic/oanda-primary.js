
let oanda = require("../api_wrapper/oanda-promise/oanda-promise-extend")
let env   = require("../_env");

let ORDER_REQUEST = {
    'type'          : 'MARKET',
    'instrument'    : 'TRY_JPY',
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
    api.accountID = env.accountID_Primary;
    try {
        res = await api.postOrder(ORDER_REQUEST);
    }catch(e){
        console.log(e);
    }
    console.log(res);
}