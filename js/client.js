const mqtt = require('mqtt');
const sendm = require('../js/sendmail');
var mongoose = require('mongoose');
var devicesSocket = require('../js/dispositivos');


var Schema = mongoose.Schema;
mongoose.connect('mongodb://adm:adm@ds159747.mlab.com:59747/express-todo');
var sio = require('socket.io');
var io = null;

var url = 'mqtt://broker.mqttdashboard.com';
var options = {
    port: 1883,
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: "",
    password: ""
};

var topic = "outTopic/Test/Test2";

var client = null;

var mqttSchema = mongoose.Schema({
    "url": String,
    "port": String,
    "username": String,
    "password": String,
    "topic": String,
    "status": String
});


var dispositivoSchema = mongoose.Schema({
    "Lugar": String,
    "Dispositivo": String,
    "Sensor": String,
    "Valor": Array,
    "Unidad": String,
    "status": String
});


var mqttBroker = mongoose.model('mqttBroker', mqttSchema);

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



var onMessage = function(message) {
    dispositivo = JSON.parse(message);
    dispositivo.status = "Conectado";
     console.log(dispositivo);
    var device = new dispositivos(dispositivo);
    device.save(function(err, device) {
        if (err) return console.error(err);
    });

    io.emit('message', dispositivo);
    //sendm.sendEmail(dispositivo);

}

exports.io = function() {
    return io;
};

exports.clientMqtt = function() {
    return client;
};

exports.initialize = function(server) {
    io = sio(server);

    getMqttConfig(function(mqttconf) {
        parseMqtt(mqttconf);
        client = mqtt.connect(url, options);
        client.on('connect', () => {
            console.log("conect MQTT");
            client.subscribe(topic);
            console.log(topic);
            io.on('connection', function(socket) {
                console.log(socket.id);
                console.log("conect");
                //socket.emit('message', dispositivo);
                socket.on('message', function(message) {
                    console.log(message);

                });

              
                
            });
            
              client.on('message', (topic, msg) => {
                         console.log("mensajjjeeje"); 
                   // onMessage(msg); 
                  devicesSocket.onmessage(msg,io);

                });
        });
    })






};


exports.connect = function(connect, callBack) {
    console.log("connect function");
    parseMqtt(connect);
    console.log("connect:" + JSON.stringify(options));
    client.end();

    client = mqtt.connect(url, options);
    client.on('connect', function() {
        client.subscribe(topic);

        callBack(true);
        saveMqtt(connect);

    });
    client.on('error', function() {
        console.log("ERROR MQTT");
        callBack(false);
        client.end();
    })

}



var saveMqtt = function(connect) {
    if (!connect.topic) {
        connect.topic = topic;
    }
    var mqtt = new mqttBroker(connect);


    mqttBroker.findOneAndUpdate("{url:" + connect.url + "}", connect, {
        upsert: true
    }, function(err, mqttB) {
        if (err) console.log(err);


    });
}



var getMqttConfig = function(callback) {
    mqttBroker.findOne().sort({
        '_id': -1
    }).exec(function(err, mqtt) {
        if (err) console.log(err);
        console.log(mqtt);
        
        callback(mqtt);
    });

}


var parseMqtt = function(connect) {
        url = connect.url;
        options.port = connect.port
        options.username = connect.username
        options.password = connect.password
        options.clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8);
        topic = connect.topic;

    }
    /*  setInterval(function() {

          
          dispositivo.Lugar = "MEX";
          dispositivo.Sensor = "AL1";
          dispositivo.Dispositivo = "Arduino01";
          dispositivo.Unidad = "Ampere";
          dispositivo.Valor = Math.floor(Math.random() * (300 - (-300) + 1)) + (-300);
              console.log("Publising"+topic);
          client.publish(topic, JSON.stringify(dispositivo));

      }, 1000);*/




exports.subscribe = function(topicSb, callBack) {
    topic = topicSb;
    client.subscribe(topic);
    callBack(true);

}


exports.getTopic = function() {
    return topic;
}

exports.getMqtt = function() {
    var mqttServer = {
        "url": url,
        "port": options.port,
        "username": options.username,
        "password": options.password,
        "topic":topic
    }
    return mqttServer;
}



/**/
