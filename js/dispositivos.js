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
    sensores: []
});
var Dispositivo = mongoose.model('dispositivo', deviceSchema);


var sensorSchema = mongoose.Schema({
    dispositivoId: mongoose.Schema.Types.ObjectId,
    nombre: String,
    unidad: String,
    data: [{
        valor: Number,
        date: Date
    }]

});
var Sensor = mongoose.model('sensor', sensorSchema);





exports.findAll = function(callback) {
    Dispositivo.find({}, {
        "sensores.data": {
            "$slice": -1
        }
    }, function(err, devices) {
        callback(err, devices);
    });

}

exports.onmessage = function(msg, socket) {

    msg = JSON.parse(msg);
    var valid = validSchema(msg);
    if (valid) {
        var device = newDevice(msg);
        socket.emit('message', device);
      //  guardarDevice(device);

    }


}


var guardarDevice = function(device) {
    var mdevice = newMdeice(device);
    var mSensor = newmSensor(device);
    var data = device.sensores[0].data[0];


    Dispositivo.findOneAndUpdate({
        Dispositivo: device.Dispositivo
    }, {
        $set: mdevice
    }, {
        upsert: true
    }, function(err, dev) {

        if (dev) {
            mSensor.dispositivoId = dev._id;
            Sensor.findOneAndUpdate({
                nombre: mSensor.nombre
            }, {
                $set: mSensor,
                $addToSet: {
                    data: data
                }
            }, {
                upsert: true
            }, function(err, numberAffected) {
            });
        }

    });
    // var newDisp = new Dispositivo(device);


    /*   findDevice(device, function(err, dev) {
           if (!dev) {
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
                       if (dev.sensores[i].nombre == nameSensor) {
                           dev.sensores[i].data.push(sensor.data[0]);
                           
                       }
                   }
                   
                   dev.save(function(err,d){
                       if(err) console.log(err);
                   })
               }
              

           }

       });*/
}


var contieneSensor = function(sensores, nameSensor) {
    var isSensor = false;

    for (i = 0; i < sensores.length; i++) {
        if (sensores[i].nombre == nameSensor) {
            isSensor = true;
            break;
        }

    }

    return isSensor;
}

var findDevice = function(device, callback) {

    Dispositivo.findOne({
        Dispositivo: device.Dispositivo
    }, function(err, dev) {
        if (err) {
            console.log(err);
        }
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

var newMdeice = function(device) {
    var dev = {};
    dev.Dispositivo = device.Dispositivo
    dev.Lugar = device.Lugar;
    dev.status = "Activo";
    return dev;

}

var newmSensor = function(device) {
    var sen = {};
    var sensor = device.sensores[0];
    sen.nombre = sensor.nombre;
    sen.unidad = sensor.unidad;
    return sen;

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
