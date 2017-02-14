var express = require('express');
const clientmqtt = require('../js/client');
var router = express.Router();





router.get('/getmqtt', function(req, res, next) {
   
     var mqttserv = clientmqtt.getMqtt();
      res.json(mqttserv);
});

router.post('/connect', function(req, res, next) {
    var body = req.body;
    var connect = body;
    console.log("CONECTADO : "+JSON.stringify(connect));
    clientmqtt.connect(connect, function(isconnect) {
        if (isconnect) {
            console.log("CONECTADO : "+connect.url);
            res.send(true);
        }
    })
});


router.post('/subscribe', function(req, res, next) {
    var body = req.body;
    var topic = body.topic;
    console.log("Subscribir : "+topic);
    clientmqtt.subscribe(topic, function(isconnect) {
        if (isconnect) {
            console.log("Inscrito : "+topic);
            res.send(true);
        }
    })
});


router.get('/getTopic', function(req, res, next) {
   
     var mqttserv = clientmqtt.getTopic();
      res.send(mqttserv);
});




/*router.get('/dispositivos', function(req, res, next) {


    res.send([dispositivo]);

});*/




/*io.on('connection', function(socket) {
console.log("SOCKET CONNECT");
    //socket.emit('message', dispositivo);
});*/







/*io.on('connection', function(socket) {
    socket.on('message', function(message) {
        console.log(message);
        // socket.emit('ditConsumer',message.value);
        // console.log('from console',message.value);
    });

    client.on('message', (topic, message) => {

        onMessage(message,socket );

    });
});*/




module.exports = router;
