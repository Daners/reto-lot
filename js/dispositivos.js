var express = require('express');
var mongoose = require('mongoose');


var router = express.Router();


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


var deviceSchema = mongoose.Schema({
    Dispositivo: String,
    Lugar: String,
    status: {
        type: String,
        default: "Inactivo"
    },
    sensores: [{
        nombre: String,
        unidad: String,
        data: [{
            valor: Number,
            date: Date
        }]
    }]
});
var Dispositivo = mongoose.model('dispositivo', deviceSchema);








exports.findAll = function(callback) {
    Dispositivo.find({},{ "sensores.data": { "$slice": -1 }},function(err, devices) {
        callback(err, devices);
    });

}

exports.onmessage = function(msg, socket) {

    msg = JSON.parse(msg);
    var valid = validSchema(msg);
    if (valid) {
        var device = newDevice(msg);
        var newDisp = new Dispositivo(device);
        findDevice(device, function(err, dev) {
            if (!dev) {
                console.log("NEW DEVICE:" + device.Dispositivo)
                newDisp.save(function(err, d) {
                    if (err) return console.error(err);
                });
                socket.emit('message', device);
            }
            else {
                var contain = contieneSensor(dev.sensores, device.sensores[0].nombre);

                if (!contain) {
                    dev.sensores.push(device.sensores[0]);

                    dev.save(function(err, d) {
                        if (err) return console.error(err);
                    });

                }
                else {
                    var sensor = device.sensores[0];
                    var nameSensor = sensor.nombre;

                    for (i = 0; i < dev.sensores.length; i++) {
                        console.log(dev.sensores[i].nombre + " " + nameSensor);
                        if (dev.sensores[i].nombre == nameSensor) {
                            dev.sensores[i].data.push(sensor.data[0]);
                            
                        }
                    }
                    
                    dev.save(function(err,d){
                        if(err) console.log(err);
                    })
                }
                socket.emit('message', device);

            }

        });



    }


}


var contieneSensor = function(sensores, nameSensor) {
    var isSensor = false;

    for (i = 0; i < sensores.length; i++) {
        console.log(sensores[i].nombre + " " + nameSensor);
        if (sensores[i].nombre == nameSensor) {
            isSensor = true;
            break;
        }

    }

    console.log("issensor: " + isSensor)
    return isSensor;
}

var findDevice = function(device, callback) {

    Dispositivo.findOne({
        Dispositivo: device.Dispositivo
    }, function(err, dev) {
        if (err) {
            console.log(err);
        }
        console.log(dev);
        callback(err, dev);
    });

}


var newDevice = function(message) {
    var dev = {};
    dev.Dispositivo = message.Dispositivo
    dev.Lugar = message.Lugar;
    dev.status = "Activo";
    dev.sensores = [{
        nombre: message.Sensor,
        unidad: message.Unidad,
        data: [{
            valor: message.Valor,
            date: Date.now()
        }]
    }]
    return dev;
}


var validSchema = function(mensaje) {
    var valid = false;
    var MensajeMqtt = mongoose.model('mensajesMqtt', mensajeMqttSchema);
    if (typeof mensaje === "object") {
        var badMensajeMqtt = new MensajeMqtt(mensaje);

        var error = badMensajeMqtt.validateSync();
        if (!error) {
            valid = true;
        }
    }
    return valid;

}
