const env = require('./_env.js');
const oanda = require("@oanda/v20/context");
const ct = new oanda.Context(env.uri, 443, true, '');
const util = require('./utils');
ct.setToken(env.apiToken);

const TARGET_INSTRUMENT1 = 'ZAR_JPY';
const TARGET_UNIT1 = 2000;
const TARGET_INSTRUMENT2 = 'USD_JPY';
const TARGET_UNIT2 = 200;
const MAX_TRADE_COUNT = 500;

const ORDER_REQUEST_1 = {
    'instrument': TARGET_INSTRUMENT1,
    'units': TARGET_UNIT1
};

const ORDER_REQUEST_2 = {
    'instrument': TARGET_INSTRUMENT2,
    'units': TARGET_UNIT2
};

// const TRADE_REQUEST = {
//     'state': 'OPEN',
//     'instrument': TARGET_INSTRUMENT,
//     'count': MAX_TRADE_COUNT
// };

let pricing;

const GetPricing = async(id, instruments) =>{
    ct.pricing.get(
        id,
        {
            'instruments' : instruments
        },
        (response) => {
            pricing = response.body.prices;
        }
    )
};
exports.GetPricing = GetPricing;

const DoOrderMarket = async (id, orderRequest)=>{
    ct.order.market(
        id,
        {
            'instrument': orderRequest.instrument,
            'units': orderRequest.units
        },
        (response) => {
            console.log(response.body)
        }
    )
    return 'ok';
};

const DoOrderMarket2 = async (id, orderRequest)=>{
    ct.order.market(
        id,
        {
            'instrument': orderRequest.instrument,
            'units': orderRequest.units,
            'takeProfitOnFill': orderRequest.takeProfitOnFill,
            'stopLossOnFill': orderRequest.stopLossOnFill,
            'trailingStopLossOnFill': orderRequest.trailingStopLossOnFill
        },
        (response) => {
            console.log(response.body)
        }
    )
    return 'ok';
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

const OrderMarketAM6 = async() => {
    let result;
    result = await DoOrderMarket(env.accountID_sub1, ORDER_REQUEST_1 );
    console.log(result);
    result = await DoOrderMarket(env.accountID_sub2, ORDER_REQUEST_2 );
    console.log(result);
}
exports.OrderMarketAM6 = OrderMarketAM6;

const ConstantOrder = async(id, instrument, amount, profit) => {
    GetPricing(id, instrument);
    await util.sleep(10000);
    let price_sell;
    for (let p of pricing){
        if (p.instrument === instrument){
            price_sell = Number(p.bids[0].price) * (1 + profit);
            price_sell = Math.ceil(price_sell * 1000) / 1000;
        }
    }
    let OrderRequest = {
        'instrument': instrument,
        'units': amount,
        'takeProfitOnFill': {
            'price': String(price_sell)
        }
    };
    let result;
    result = await DoOrderMarket2(id, OrderRequest);
    console.log(result);
}
exports.ConstantOrder = ConstantOrder;
