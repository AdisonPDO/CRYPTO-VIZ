const WebSocket = require("ws");

let ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
let ws2 = new WebSocket('wss://stream.binance.com:9443/ws/etheur@trade');

let websocket = new WebSocket('wss://wbs.mexc.com/ws')

let stockPriceElement = document.getElementById('stock-price')
let stockPriceElement2 = document.getElementById('stock-price2')
let stockPriceElement3 = document.getElementById('stock-price3')
let value = document.getElementById('value')
let value2 = document.getElementById('value2')
let value3 = document.getElementById('value3')
let date = document.getElementById('timestamp')
let date2 = document.getElementById('timestamp2')
let date3 = document.getElementById('timestamp3')

let lastPrice = null;

ws.onmessage = (event) => {
    let stockObject = JSON.parse(event.data);
    let price = parseFloat(stockObject.p).toFixed(2);
    value.innerText = (stockObject.s)
    stockPriceElement.innerText = price
    stockPriceElement.style.color = !lastPrice || lastPrice === price ? 'black' : price > lastPrice ? 'green' : 'red';
    date.innerText = (stockObject.E)
    lastPrice = price;
}

ws2.onmessage = (event) => {
    let stockObject = JSON.parse(event.data);
    let price = parseFloat(stockObject.p).toFixed(2);
    value2.innerText = (stockObject.s)
    stockPriceElement2.innerText = price
    stockPriceElement2.style.color = !lastPrice || lastPrice === price ? 'black' : price < lastPrice ? 'green' : 'red';
    date2.innerText = (stockObject.E)
    lastPrice = price;
}

websocket.onopen = function (event) {
    console.log('Connected to server')
    websocket.send(JSON.stringify({
        "id": 1,
        "method":"SUBSCRIPTION",
        "params":["spot@public.deals.v3.api@BTCUSDT"]
    }))
}

websocket.onmessage = (event) => {
    let stockObject = JSON.parse(event.data);
    console.log(stockObject?.d?.deals[0]?.p);
}

websocket.onmessage = (event) => {
    let stockObject = JSON.parse(event.data);
    let price = parseFloat(stockObject?.d?.deals[0]?.p).toFixed(2);
    value3.innerText = (stockObject.s)
    stockPriceElement3.innerText = price
    stockPriceElement3.style.color = !lastPrice || lastPrice === price ? 'black' : price > lastPrice ? 'green' : 'red';
    date3.innerText = (stockObject.t)
    lastPrice = price;
}