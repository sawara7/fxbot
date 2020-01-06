let sample = require("./logic/bitbank-averaging2");
(async () => {
    setInterval(
        ()=>{
            sample.doExecute('xrp_jpy', 6, 0.0021);
        },1000*60
    )
    
})();
