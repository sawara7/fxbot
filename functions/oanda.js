const env = require('./_env.js');
const oanda = require("@oanda/v20/context");
const ct = new oanda.Context(env.uri, 443, true, '');
ct.setToken(env.apiToken);

const TARGET_INSTRUMENT = 'USD_JPY';
const TARGET_UNIT = 1;
const MAX_TRADE_COUNT = 500;

const ORDER_REQUEST_1 = {
    'instrument': TARGET_INSTRUMENT,
    'units': TARGET_UNIT
};

const TRADE_REQUEST = {
    'state': 'OPEN',
    'instrument': TARGET_INSTRUMENT,
    'count': MAX_TRADE_COUNT
};

let DoOrderMarket = async (id, orderRequest)=>{
    let result;
    ct.order.market(
        id,
        {
            'instrument': 'USD_JPY',
            'units': 10
        },
        (response) => {
            result = response;
        }
    )

    // await (async () => {
    //     while (true) {
    //         if (result !== undefined) {
    //             return;
    //         }
    //     }
    // })

    return result;
};

let GetTrades = async (id, tradeRequest) => {
    let result;
    ct.trade.list(
        id,
        tradeRequest,
        (response) => {
            result = response.body.trades;
        });

    // await (async () => {
    //     while (true) {
    //         if (result !== undefined) {
    //             return;
    //         }
    //     }
    // })
    
    return result;
};

let DoTradesLoop = async (id, tradeRequest, tradeHundler) => {
    let list = await GetTrades(id, tradeRequest);
    for (let i in list) {
        tradeHundler(list[i]);
    }
    return true;
};

let CloseOldestPosition = async (id, tradeRequest) => {
    let list = await GetTrades(id, tradeRequest);
    if (list.length === MAX_TRADE_COUNT) {
        ct.trade.close(
            id,
            list[list.length-1].id,
            {},
            (response) => {
                // Do Nothing
            });
    }
    return true; // TODO: return response.
};
