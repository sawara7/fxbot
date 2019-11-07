/* eslint-disable no-await-in-loop */
let oanda = require("../api_wrapper/oanda")
let env   = require("../_env");

const ORDER_LIST = [
    {
    'id'            : env.accountID_aji,
    'trigger_minute':[3, 33],
    'instrument'    : 'USD_JPY',
    'units'         : 10,
    'rate'          : 0.0005
    },{
    'id'            : env.accountID_iwashi,
    'trigger_minute':[4, 34],
    'instrument'    : 'TRY_JPY',
    'units'         : 20,
    'rate'          : 0.0005
    },
    {
    'id'            : env.accountID_Primary,
    'trigger_minute':[5,35],
    'instrument'    : 'USD_JPY',
    'units'         : 10,
    'rate'          : 0.0007
    },
    {
    'id'            : env.accountID_saba,
    'trigger_minute':[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
    'instrument'    : 'USD_JPY',
    'units'         : 5,
    'rate'          : 0.0003
    },{
    'id'            : env.accountID_sawara,
    'trigger_minute':[7, 37],
    'instrument'    : 'ZAR_JPY',
    'units'         : 50,
    'rate'          : 0.0005
    },{
    'id'            : env.accountID_tara,
    'trigger_minute':[8, 38],
    'instrument'    : 'AUD_JPY',
    'units'         : 10,
    'rate'          : 0.0005
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
            if (rate > req.rate && account.account.marginCloseoutUnrealizedPL > 100){
                res = await api.closePosition(req.instrument);
                console.log(req.id, 'close');
                return res;
            }

            let price = await api.getPricing({'instruments':req.instrument});
            price = Number(price.prices[0].closeoutAsk);
            let candle = await api.getCandle(req.instrument, {
                // price	“M” (midpoint candles) “B” (bid candles) and “A” (ask candles).
                price : 'A', 
                // granularity	The granularity of the candlesticks to fetch [default=S5]
                granularity : 'D',
                // count The number of candlesticks to return in the response.
                // Count should not be specified if both the start and end parameters are provided,
                // as the time range combined with the granularity will determine the number of candlesticks to return. [default=500, maximum=5000]
                count : 30
                // from	query	DateTime	The start of the time range to fetch candlesticks for.
                // to	query	DateTime	The end of the time range to fetch candlesticks for.
                // smooth	query	boolean	A flag that controls whether the candlestick is “smoothed” or not. A smoothed candlestick uses the previous candle’s close price as its open price, while an un-smoothed candlestick uses the first price from its time range as its open price. [default=False]
                // includeFirst	query	boolean	A flag that controls whether the candlestick that is covered by the from time should be included in the results. This flag enables clients to use the timestamp of the last completed candlestick received to poll for future candlesticks but avoid receiving the previous candlestick repeatedly. [default=True]
                // dailyAlignment	query	integer	The hour of the day (in the specified timezone) to use for granularities that have daily alignments. [default=17, minimum=0, maximum=23]
                // alignmentTimezone	query	string	The timezone to use for the dailyAlignment parameter. Candlesticks with daily alignment will be aligned to the dailyAlignment hour within the alignmentTimezone. Note that the returned times will still be represented in UTC. [default=America/New_York]
                // weeklyAlignment
            });
            candle = candle.candles;
            let max = candle[0].ask.h;
            let min = candle[0].ask.l;
            for (let c of candle){
                if (c.ask.h > max){
                    max = c.ask.h;
                }
                if (c.ask.l < min){
                    min = c.ask.l;
                }
            }
            let range = max - min;
            let price_rating = (price - min) / range;
            let units = Math.floor(req.units * price_rating);
             
            if (req.trigger_minute.includes(current_minutes) && units > 0){
                params["instrument"] = req.instrument;
                params["units"] = units;
                res = await api.postOrder(params);
                console.log(req.id, price_rating, units, res);
            }
        }
    }catch(e){
        console.log(e);
    }
    console.log('end');
    return res;
}
