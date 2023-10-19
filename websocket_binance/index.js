const WebSocket = require("ws");

let ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
let ws2 = new WebSocket('wss://stream.binance.com:9443/ws/etheur@trade');

let lastPrice = null;

ws.on('message', (data) => {
    let stockObject = JSON.parse(data);
    lastPrice = parseFloat(stockObject.p).toFixed(2);
    console.log(lastPrice);
});

ws2.on('message', (data) => {
    let stockObject = JSON.parse(data);
    lastPrice = parseFloat(stockObject.p).toFixed(2);
    console.log(lastPrice)
});
