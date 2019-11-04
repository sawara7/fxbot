/* eslint-disable no-await-in-loop */
let oanda = require("../api_wrapper/oanda")
let env   = require("../_env");

const ORDER_LIST = [
    {
    'id'            : env.accountID_aji,
    'trigger_minute':[3, 33],
    'instrument'    : 'USD_JPY',
    'units'         : 5,
    'rate'          : 0.01
    },{
    'id'            : env.accountID_iwashi,
    'trigger_minute':[4, 34],
    'instrument'    : 'TRY_JPY',
    'units'         : 10,
    'rate'          : 0.01
    },
    // },{
    // 'id'            : env.accountID_Primary,
    // 'trigger_minute':[5,35],
    // 'instrument'    : 'TRY_JPY',
    // 'units'         : 5,
    // 'rate'          : 0.005
    // },{
    {
    'id'            : env.accountID_saba,
    'trigger_minute':[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
    'instrument'    : 'USD_JPY',
    'units'         : 10,
    'rate'          : 0.005
    },{
    'id'            : env.accountID_sawara,
    'trigger_minute':[7, 37],
    'instrument'    : 'ZAR_JPY',
    'units'         : 30,
    'rate'          : 0.01
    },{
    'id'            : env.accountID_tara,
    'trigger_minute':[8, 38],
    'instrument'    : 'AUD_JPY',
    'units'         : 5,
    'rate'          : 0.01
    }]

let api = new oanda.Api({
    'token'     : env.apiToken,
    'endPoint'  : env.uri
});

exports.doExecute = async() => {
    let res;
    let date = new Date();
    let current_minutes = date.getMinutes();
    
    let params= {
        'type'          : 'MARKET',
        'timeInForce'   : 'FOK',
        'positionFill'  : 'DEFAULT'
    };

    try {
        for (let req of ORDER_LIST){
            api.accountID = req.id;
            let account = await api.getAccount();
            let rate = account.account.marginCloseoutUnrealizedPL / account.account.marginCloseoutPositionValue;
            if (rate > req.rate){
                res = await api.postClose(req.instrument);
                console.log(req.id, 'close');
                return res;
            }

            if (req.trigger_minute.includes(current_minutes)){
                params["instrument"] = req.instrument;
                params["units"] = req.units;
                res = await api.postOrder(params);
                console.log(req.id, res);
            }
        }
    }catch(e){
        console.log(e);
    }
    return res;
}
