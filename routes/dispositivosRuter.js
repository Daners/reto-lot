var express = require('express');
var dispositivos = require('../js/dispositivos');
var router = express.Router();


router.get('/getAll', function(req, res, next) {

    dispositivos.findAll(function(err, devices) {
        res.send(devices);
    });

});

router.post('/saveAlert', function(req, res, next) {

})


module.exports = router;
