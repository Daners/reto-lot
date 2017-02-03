var express = require('express');
var router = express.Router();
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://broker.mqttdashboard.com:8000');
//var nodemailer = require('nodemailer');
const nodemailer = require('nodemailer');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://adm:adm@ds159747.mlab.com:59747/express-todo');


var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'danielespinosa.bin@gmail.com', // Your email id
        pass: 'D4n13l3sp1n0s4G00gl3>(' // Younpm r password
    }
});

var sendEmail = function(device, transporter) {

    if (device.Valor >= 30) {
        console.log("ALERTA HOT");
        var text = "ALERTA!!\n\n" +
            "Dispositivo: " + device.Dispositivo + "\n" +
            "Sensor: " + device.Sensor + "\n" +
            "Alcanzo el limite con: " + device.Valor + " " + device.Unidad;
        var mailOptions = {
            from: 'danielespinosa.bin@gmail.com', // sender address
            to: 'danielespinosa.bin@gmail.com', // list of receivers
            subject: 'Alerta Dispositivo: ' + device.Dispositivo, // Subject line
            text: text //, // plaintext body
                // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
               
            }
            else {
                console.log('Message sent: ' + info.response);
                
            };
        });
    }

}

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

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.post('/', function(req, res, next) {
    var body = req.body;

    dispositivo = body;
    sendEmail(dispositivo,transporter);
    dispositivo.status = "Conectado";
    var device = new dispositivos(dispositivo);
    console.log(device);
    device.save(function(err, device) {
        if (err) return console.error(err);
    });
    res.send(200);
});


router.get('/dispositivos', function(req, res, next) {

    res.send([dispositivo]);

});

client.on('connect', () => {
    client.subscribe('garage/connected')
})


client.on('message', (topic, message) => {
    if (topic === 'dispositivo/on') {
        var json = JSON.stringify(message.toString());
        dispositivo = json;
    }
})

module.exports = router;
