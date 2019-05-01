const env = require('./_env.js');
const functions = require('firebase-functions');
const oanda = require("@oanda/v20/context");
const ct = new oanda.Context(env.uri, 443, true, '');
ct.setToken(env.apiToken);

exports.botFunction = functions.pubsub.schedule("every 1 minutes").onRun((context) => {
    ct.order.market(
        env.accountID_sub3,
        {
            'instrument': 'USD_JPY',
            'units': 1
        },
        (response) => {
            // Do Nothing
        }
    )

    ct.trade.list(
        env.accountID_sub3,
        {
            'state': 'OPEN',
            'instrument': 'USD_JPY',
            'count': 500
        },
        (response) => {
            if (response.statusCode !== '200') {
                return 'error';
            }
            list = response.body.trades;
            if (list.length === 500) {
                ct.trade.close(
                    env.accountID_sub3,
                    list[list.length-1].id,
                    {},
                    (response) => {
                        // Do Nothing
                    });
                }
        }
    )        
    return 'ok';
});

exports.getSwapPointOpenFunction = functions.pubsub.schedule('59 20 * * 1-5').onRun((context) => {
    ct.order.market(
        env.accountID_sub4,
        {
            'instrument': 'USD_JPY',
            'units': 1000
        },
        (response) => {
            // Do Nothing
        }
    )     
    return 'ok';
});

exports.getSwapPointCloseFunction = functions.pubsub.schedule('01 21 * * 1-5').onRun((context) => {
    ct.trade.list(
        env.accountID_sub4,
        {
            'state': 'OPEN',
            'instrument': 'USD_JPY'
        },
        (response) => {
            if (response.statusCode !== '200') {
                return 'error';
            }
            list = response.body.trades;
            for (let i in list) {
                ct.order.trailingStopLoss(
                    accountID4,
                    {
                        'tradeID': list[i].id,
                        'distance':  0.02
                    },
                    (response) => {
                        console.log('ok')
                    });
                }
            }
    ) 
    return 'ok';
});

