# fxbot on firebase  
Googleのgoogle function on firebaseで  
fx取引関連のルーチンワークを自動化する(botといえばbot？)  
Linuxのcronを使えばいいんだけど、サーバー管理が面倒なのでfirebaseとした。  

## functions
1. bitbankAM4Function
主に日本で取引されている通貨は、朝4時が最も取引量が少ない。  
チャートを眺めた限りだと、その後は値上がりする可能性が高い。  
（取引が活発になるので、変動が起きる。）  
なので、AM4:00に買って、AM7:00に売る戦法  

2. bitbankAM7Function
4:00にopenしたポジションをcloseする。  
手動でcloseしてもいいが煩雑なのでこちらも自動化する。  
7:00にした理由は特にない。  
ただ、11:00以降に急変動があるので、なるべく早めに手放す。  

3. oandaFunction
ドルコスト平均法で含み損を抑えつつ、スワップポイントでこつこつ貯める。  
※固定unitで買っているので、厳密にはドルコスト平均法ではない。  
一日一回、10unit、ZAR/JPYを買っている。  