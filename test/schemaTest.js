var mongoose = require('mongoose');

var mensajeMqttSchema = mongoose.Schema({
    "Lugar": {
        type: String,
        required: true
    },
    "Dispositivo": {
        type: String,
        required: true
    },
    "Sensor": {
        type: String,
        required: true
    },
    "Valor": {
        type: Number,
        required: true
    },
    "Unidad": {
        type: String,
        required: true
    }
});

var MensajeMqtt = mongoose.model('mensajesMqtt', mensajeMqttSchema);

var badMensajeMqtt = new MensajeMqtt({
    "Lugar": "EKT",
    "Dispositivo": "Arduino",
    "Sensor": "Temp ",
    "Valor": 20,
    Unidad:"c"
   
});

var error = badMensajeMqtt.validateSync();

console.log(error);
