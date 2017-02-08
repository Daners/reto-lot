const mqtt = require('mqtt');
const sendm = require('../js/sendmail');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://adm:adm@ds159747.mlab.com:59747/express-todo');
var sio = require('socket.io');
var io = null;

var url = 'mqtt://broker.mqttdashboard.com';
var options = {
    port: 1883,
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8)
   // username: "reto",
    //password: "reto",
};
const client = mqtt.connect(url, options);




var dispositivoSchema = mongoose.Schema({
    "Lugar": String,
    "Dispositivo": String,
    "Sensor": String,
    "Valor": Array,
    "Unidad": String,
    "status": String
});

var dispositivos = mongoose.model('dispositivos', dispositivoSchema);

var dispositivo = {
    "Lugar": "-",
    "Dispositivo": "-",
    "Sensor": "-",
    "Valor": 0,
    "Unidad": "-",
    "status": "Desconectado"

};
var device;

client.on('connect', () => {
    client.subscribe('outTopic/Test/Test2');
 console.log("conect MQTT");
});

var onMessage = function(message,socket) {
    dispositivo = JSON.parse(message);
    dispositivo.status = "Conectado";
    var device = new dispositivos(dispositivo);
    device.save(function(err, device) {
        if (err) return console.error(err);
    });
    
    socket.emit('message', dispositivo);
     //sendm.sendEmail(dispositivo);

}

exports.io = function () {
  return io;
};

exports.initialize = function(server) {
  io = sio(server);
 io.on('connection', function(socket) {
    
     console.log("conect");
      socket.emit('message', dispositivo);
        socket.on('message', function(message) {
            console.log(message);
           
        });

        client.on('message', (topic, message) => {
           
            onMessage(message,socket );

        });
    });

  
};

/**/