let oanda = require("./oanda-promise");

class ExtendApi extends oanda.Api {
    // doOrderMarket = async(id, instrument, unit, takeProfitOnFill, stopLossOnFill, trailingStopLossOnFill) => {
    //     if (id) {this.accountID = id}
    //     let body = {
    //         'type'      : 'market',
    //         'instrument': instrument,
    //         'units'     : unit
    //     }
    //     if (takeProfitOnFill){
    //         body['takeProfitOnFill'] = takeProfitOnFill;
    //     }
    //     if (stopLossOnFill){
    //         body['stopLossOnFill'] = stopLossOnFill;
    //     }
    //     if (trailingStopLossOnFill){
    //         body['trailingStopLossOnFill'] = trailingStopLossOnFill;
    //     }
    //     return await this.postOrder(body);
    // }
}
exports.ExtendApi = ExtendApi;