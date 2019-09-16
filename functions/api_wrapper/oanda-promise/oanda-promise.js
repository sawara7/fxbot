"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))((resolve, reject) => {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P( (resolve)=> { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

const http = require("http");
const https = require("https");
const axios = require("axios");
class Api {
    constructor(config, options) {
        this.accountID = config.accountID;
        this.token = config.token;
        this.endPoint = config.endPoint;
        this.keepAlive = config.keepAlive || false;
        this.timeout = config.timeout || 3000;
        if (options) {
            this.optionsCallback = options.optionsCallback;
            this.responseCallback = options.responseCallback;    
        }
    }
    get(path, params, headers) {
        // eslint-disable-next-line require-yield
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', path, params, {}, headers);
        });
    }
    post(path, data, headers) {
        // eslint-disable-next-line require-yield
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', path, {}, data, headers);
        });
    }
    request(method, path, params, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                method: method,
                baseURL: this.endPoint,
                url: path,
                timeout: this.timeout,
                httpAgent: new http.Agent({ keepAlive: this.keepAlive }),
                httpsAgent: new https.Agent({ keepAlive: this.keepAlive }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.token
                },
            };
            if (params && Object.keys(params).length > 0) {
                Object.assign(options, { params });
            }
            if (data && Object.keys(data).length > 0) {
                Object.assign(options, { data });
            }
            if (headers && Object.keys(headers).length > 0) {
                Object.assign(options, { headers });
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
    getPricing(params) {
        const path = '/v3/accounts/'.concat(this.accountID, '/pricing');
        return this.get(path, params);
    }
    getAccount() {
        const path = '/v3/accounts/' + this.accountID;
        return this.get(path);
    }
    postOrder(request) {
        const path = '/v3/accounts/'.concat(this.accountID, '/orders');
        return this.post(path, {'order': request});
    }
}
exports.Api = Api;
