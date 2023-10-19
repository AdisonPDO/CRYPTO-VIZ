let ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade')
let ws2 = new WebSocket('wss://stream.binance.com:9443/ws/etheur@trade')


let stockPriceElement = document.getElementById('stock-price')
let stockPriceElement2 = document.getElementById('stock-price2')
let value = document.getElementById('value')
let value2 = document.getElementById('value2')
let date = document.getElementById('timestamp')
let date2 = document.getElementById('timestamp2')

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