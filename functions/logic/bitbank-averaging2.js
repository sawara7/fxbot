let bitbank = require("../api_wrapper/bitbank");
let firebase = require("../api_wrapper/firebase");

const FIREBASAE_BOT_BITBANK = "/bot/bitbank/";

exports.doExecute = async(pair, amount, rate) => {
    // Get previous data
    let data = await firebase.getData(FIREBASAE_BOT_BITBANK + pair);
    let total_amount        = ("total_amount" in data) ? data.total_amount :0;
    let position_price      = ("position_price" in data) ? data.position_price :0;
    let position_sell_price = ("position_sell_price" in data) ? data.position_sell_price :0;
    let order_id_sell       = ("order_id_sell" in data) ? data.order_id_sell :0;
    let order_id_buy        = ("order_id_buy" in data) ? data.order_id_buy :0;
    let total_profit        = ("total_profit" in data) ? data.total_profit :0;

    // Check order result (buy)
    let buy_order;
    let buy_amount = 0;
    let buy_price = 0;
    let remaining_amount_buy = 0;
    if (order_id_buy !== 0){
        buy_order = await bitbank.getOrder(pair, order_id_buy);
        buy_amount = buy_order.executed_amount;
        buy_price = buy_order.average_price;
        remaining_amount_buy = buy_order.remaining_amount;
        if (remaining_amount_buy > 0){
            await bitbank.cancelOrder(pair, order_id_buy);
        }
        order_id_buy = 0;
    }

    // Check order result (sell)
    let sell_order;
    let sell_amount = 0;
    let sell_price = 0;
    let remaining_amount_sell = 0;
    if (order_id_sell !== 0){
        sell_order = await bitbank.getOrder(pair, order_id_sell);
        sell_amount = sell_order.executed_amount;
        sell_price = sell_order.average_price;
        remaining_amount_sell = sell_order.remaining_amount;
        if (remaining_amount_sell > 0){
            await bitbank.cancelOrder(pair, order_id_sell);
        }
        order_id_sell = 0;
    }

    // update
    position_price = (position_price * (total_amount - sell_amount) + buy_price * buy_amount) / (total_amount + buy_amount - sell_amount);
    total_amount = total_amount + buy_amount - sell_amount;

    if (sell_order){
        total_profit += (sell_price - position_sell_price) * sell_amount;
    }

    if (total_amount < 0.0001){
        position_price = 0;
    }
    
    // Get Ticker
    let tk = await bitbank.getTicker(pair);
    let tk_buy = tk.buy;
    let tk_sell = tk.sell;

    // Buy
    if ((position_price > tk_buy) || order_id_buy === 0){
        let x = (tk_buy - position_price) / tk_buy
        sigmoid_rate = 0
        if (-1 <= x && x < 0){
            x = (x * -1 - 0.5) / 0.5 * 2;
            sigmoid_rate = 1 / (1 + Math.exp(-x));
        }
        else if (x === 1) {
            sigmoid_rate = 1
        }
        let tmp_amount = Math.round((amount * sigmoid_rate + remaining_amount_buy)*100)/100
        if (tmp_amount > 0) {
            let buy_res = await bitbank.BuyLimit(pair,tk_buy,tmp_amount);
            order_id_buy = buy_res.order_id;
        }     
    }

    // Sell
    if (total_amount > 0 && position_price > 0){
        let tmp_price = Math.round(position_price * (1 + rate) * 100) / 100;
        let sell_res = await bitbank.SellLimit(pair, tmp_price, total_amount);
        position_sell_price = position_price;
        order_id_sell = sell_res.order_id;
    }

    // Set Data
    let update_data = {
        'total_amount' : total_amount,
        'position_price' : position_price,
        'position_sell_price' : position_sell_price,
        'order_id_sell' : order_id_sell,
        'order_id_buy' : order_id_buy,
        'total_profit' : total_profit
    }
    await firebase.setData(FIREBASAE_BOT_BITBANK + pair, update_data);
    console.log(update_data);
    
    return 'ok'
}