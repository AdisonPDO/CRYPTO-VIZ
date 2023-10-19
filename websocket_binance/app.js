const WebSocket = require("ws");
const Kafka = require("node-rdkafka");

// Créez des connexions WebSocket
const ws1 = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
const ws2 = new WebSocket('wss://stream.binance.com:9443/ws/etheur@trade');

// Configurez le producteur Kafka
const producer = new Kafka.Producer({
    'metadata.broker.list': 'kafka:9092', // Remplacez "kafka" par le nom de votre conteneur Kafka
    'dr_cb': true
});

// Gestionnaire d'événement pour gérer la confirmation de production du message
producer.on('delivery-report', function (err, report) {
    if (err) {
        console.error('Erreur de production : ' + err);
    } else {
        console.log('Message produit avec succès à la partition ' + report.partition);
    }
});

// Gestionnaire d'événement pour gérer la connexion réussie du producteur Kafka
producer.on('ready', function () {
    console.log('Producteur Kafka est prêt à produire des messages.');
});

// Gestionnaire d'événement pour gérer les erreurs de production
producer.on('event.error', function (err) {
    console.error('Erreur du producteur Kafka : ' + err);
});

// Connectez le producteur Kafka
producer.connect();

// Fonction pour traiter les messages reçus
function processMessage(data) {
    const stockObject = JSON.parse(data);
    let crypto = {
        "name": stockObject.s,
        "date": new Date(stockObject.E).toISOString(),
        "value": parseFloat(stockObject.p).toFixed(2)
    }

    // Envoyez la valeur lastPrice au topic Kafka
    producer.produce('datas_binance', null, Buffer.from(JSON.stringify({crypto})), null, Date.now());

}

// Gérez les messages reçus des connexions WebSocket
ws1.on('message', processMessage);
ws2.on('message', processMessage);
