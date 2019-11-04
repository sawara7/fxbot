"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))((resolve, reject) => {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P( (resolve)=> { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

const http  = require("http");
const https = require("https");
const axios = require("axios");
const crypto = require('crypto');

class Api {
    constructor(config, options) {
        this.key = config.key;
        this.secret = config.secret;
        this.endPoint = config.endPoint;
        this.keepAlive = config.keepAlive || false;
        this.timeout = config.timeout || 10000;
        if (options) {
            this.optionsCallback = options.optionsCallback;
            this.responseCallback = options.responseCallback;    
        }
    }
    get(path, params) {
        // eslint-disable-next-line require-yield
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', path, params, {});
        });
    }
    post(path, body) {
        // eslint-disable-next-line require-yield
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', path, {}, body);
        });
    }
    request(method, path, params, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let timestamp = Date.now().toString();
            let text = timestamp + method + path;
            if (data && Object.keys(data).length > 0){ 
                text += JSON.stringify(data);
            }
            let sign = crypto.createHmac('sha256', this.secret).update(text).digest('hex');
            const options = {
                method: method,
                baseURL: this.endPoint,
                url: path,
                timeout: this.timeout,
                httpsAgent: new https.Agent({ keepAlive: this.keepAlive }),
                headers: {
                    'ACCESS-KEY': this.key,
                    'ACCESS-TIMESTAMP': timestamp,
                    'ACCESS-SIGN': sign,
                    'Content-Type': 'application/json'
                }
            };
            if (params && Object.keys(params).length > 0) {
                Object.assign(options, { params });
            }
            if (data && Object.keys(data).length > 0) {
                Object.assign(options, { data });
            }
            if (this.optionsCallback) {
                yield this.optionsCallback(options);
            }
            return axios.default
                .request(options)
                .then((res) => {
                if ([200, 201].indexOf(res.status) >=0 ) {
                    if (this.responseCallback) {
                        this.responseCallback(res.data);
                    }
                    return res.data;
                }
                else {
                    throw new Error(res.data);
                }
            });
        });
    }
    getTicker(code) {
        const path = '/v1/ticker';
        let params = {
            product_code:code
        };
        return this.get(path, params);
    }
    getCollateral() {
        const path = '/v1/me/getcollateral';
        // {
        //     "collateral": 100000,
        //     "open_position_pnl": -715,
        //     "require_collateral": 19857,
        //     "keep_rate": 5.000
        //   }
        return this.get(path, {});
    }
    sendChildOrder(params) {
        const path = '/v1/me/sendchildorder';
        let body = {
            "product_code": params.code,
            "child_order_type": params.type,
            "side": params.side,
            "size": params.size,
            // "minute_to_expire": 10000,
            // "time_in_force": "GTC"
        }
        return this.post(path, body);
    }
    sendIFDOCOOrder(code, side, size,price, range_upper, range_lower) {
        const path = "/v1/me/sendparentorder";
        let opposite_side = side==="BUY" ? "SELL" : "BUY"
        let body = {
            "order_method": "IFD",
            "minute_to_expire": 10000,
            "time_in_force": "GTC",
            "parameters": [{
              "product_code":code,
              "condition_type": "MARKET",
              "side": side,
              "size": size
            },
            {
              "product_code":code,
              "condition_type": "LIMIT",
              "side": opposite_side,
              "price": side==="BUY" ? price + range_upper : price - range_upper,
              "size": size
            }]
          }
        return this.post(path, body);
    }

}
exports.Api = Api;
