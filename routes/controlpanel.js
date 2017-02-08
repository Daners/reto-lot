var express = require('express');
var router = express.Router();




/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

/*router.post('/', function(req, res, next) {
    var body = req.body;

    dispositivo = body;
    dispositivo.status = "Conectado";
    var device = new dispositivos(dispositivo);
    console.log(device);
    device.save(function(err, device) {
        if (err) return console.error(err);
    });
    res.send(200);
});*/




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
