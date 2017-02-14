const mqtt = require('mqtt');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://adm:adm@ds159747.mlab.com:59747/express-todo');

const client = null;
var conexionSchema = mongoose.Schema({
    "url": String,
    "port": Number,
    "username": String,
    "password": String
});

var url = 'mqtt://broker.mqttdashboard.com';
var options = {
    port: 1883,
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: "",
    password: ""
};
var topic = "outTopic/Test/Test2";






client.on('connect', () => {
    client.subscribe(topic);
    console.log("conect MQTT");
});

var connect = function(connect, callBack) {
    url = connect.url;
    options.port = connect.port
    options.username = connect.port
    options.password = connect.port
    client = mqtt.connect(url, options);
    client.on('connect', function() {
        client.subscribe(topic);
        callBack(true);
    });
    client.on('error', function() {
        console.log("ERROR MQTT");
        callBack(false);
        client.end();
    })

}


var subscribe = function(topicSb, callBack){
    var topic = topicSb;
    client.subscribe(topic);
    callBack(true);
    
}


var getTopic = function(){
    return topic;
}

var getMqtt = function(){
    var mqttServer = {
    "url": url,
    "port": options.port,
    "username": options.username,
    "password": options.password
    }
    return mqttServer;
}

module.exports = subscribe;
module.exports = connect;

module.exports = getTopic;
module.exports = getMqtt;
