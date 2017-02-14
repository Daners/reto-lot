//var nodemailer = require('nodemailer');
const nodemailer = require('nodemailer');

var valueAlert="";
var emailsTo="";

var transport = nodemailer.createTransport( {
  service:"Gmail",
    auth: {
        type :'OAuth2',
        clientId :"809450744146-lu3u8kfqkfpb2dm9n8koqg4vh54ktegu.apps.googleusercontent.com",
        clientSecret :"78BhqVaMOOwu2ttx8uJhsz5R",
        user: "danielespinosa.bin@gmail.com",
        refreshToken:"1/aC3scUf0yPeXhoYNDwXcjl-p9X4i63_UpkI_UqAjskPj0Bm3t40Y8Bb3D2yOYbR4"
    }
});

module.exports.sendEmail = function(device) {

    
        var text = "ALERTA!!\n\n" +
            "Dispositivo: " + device.Dispositivo + "\n" +
            "Sensor: " + device.Sensor + "\n" +
            "Alcanzo el limite con: " + device.Valor + " " + device.Unidad;
        var mailOptions = {
            from: 'danielespinosa.bin@gmail.com', // sender address
            to: 'dzib.arduino@gmail.com,danielespinosa.bin@gmail.com', // list of receivers
            subject: 'Alerta Dispositivo: ' + device.Dispositivo, // Subject line
            text: text //, // plaintext body
                // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
        };

        transport.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);

            }
            else {
                console.log('Message sent: ' + info.response);

            };
        });
    
    
module.exports.setValueAlert = function(val){
    valueAlert = val;
}    

module.exports.setEmailsTo = function(emails){
    emailsTo = emails;
}    
    

}
