let sample = require("./logic/bitbank-averaging");

(async () => {
    setInterval(
        async () => {await sample.doExecute('btc_jpy', 0.0001, 1)},
        1000 * 20
    );
})();
