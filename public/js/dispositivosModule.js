(function() {



    var app = angular.module('dispositivos-module', [angularDragula(angular)]);


    app.controller('dispositivoController', ['$scope', "socket", '$http', 'dragulaService', "$interval", function($scope, socket, $http, dragulaService, $interval) {

        dragulaService.options($scope, 'device-bag', {
            moves: function(el, container, handle) {
                var hand = handle.className;

                var isHandle = (hand === 'panel-title ng-binding' || hand === 'panel-heading');
                return isHandle;
            }
        });

        $scope.deviceModel = {};
        $scope.dispositivos = [];

      








        var dispEjm = {
            Dispositivo: "ARD3",
            Lugar: "EKT",
            status: "Activo",
            sensores: [{
                nombre: "AL1",
                valor: "-",
                unidad: "AMP"
            }]
        }

        var dispEjm2 = {
            Dispositivo: "ARDUINO2",
            Lugar: "EKT",
            status: "Inactivo",
            sensores: [{
                nombre: "AL1",
                valor: "-",
                unidad: "AMP"
            }]
        }



        socket.on('connect', function() {


        });



        $interval(function() {

            chackMessage();


        }, 60000);

        socket.on('message', function(msg) {

            parseMessage(msg);
        });


        var chackMessage = function() {
            var d = Date.now();
            for (i = 0; i < $scope.dispositivos.length; i++) {
                var device = $scope.dispositivos[i];
                var sensores = device.sensores;
                for (j = 0; j < sensores.length; j++) {
                    var data = sensores[j].data;
                    //  for (k = 0; k < data.length; k++) {
                    //  if(data.date!=d){

                    // device.status = "Inactivo"; 
                    console.log(data[0].date);

                    var dateDevice = new Date(data[0].date);
                    if (dateDevice < d) {
                        device.status = "Inactivo";
                    }
                    //}
                    //}


                    //$scope.$apply();
                }
            }
        }

        var parseMessage = function(message) {

            var namedis = message.Dispositivo;


            var device = JSPath.apply('.{.Dispositivo =="' + namedis + '" }.', $scope.dispositivos);


            if (device.length > 0) {


                llenarDevice(device, message)
                $scope.$apply();
            }
            else {
                var newDev = {};
                newDev.Dispositivo = message.Dispositivo;
                newDev.Lugar = message.Lugar;
                newDev.status = "Activo";
                newDev.sensores = message.sensores;

                $scope.dispositivos.push(newDev);
                $scope.$apply();

            }




        }




        var llenarDevice = function($dispositivos, message) {

            for (i = 0; i < $dispositivos.length; i++) {
                var device = $dispositivos[i];
                device.Lugar = message.Lugar;


                llenarSensor(device.sensores, message.sensores[0]);

                device.status = "Activo";

            }

            $scope.$apply();

        }

        var llenarSensor = function(sensores, messageSensor) {

            var sensPth = JSPath.apply('.{.nombre =="' + messageSensor.nombre + '" }', sensores);

            if (sensPth.length == 0) {
                var sens = {};
                sens.data = messageSensor.data;
                sens.unidad = messageSensor.unidad;
                sens.nombre = messageSensor.nombre;
                sensores.push(sens);
            }
            else {

                for (i = 0; i < sensores.length; i++) {
                    if (sensores[i].nombre == messageSensor.nombre) {
                        sensores[i].data = messageSensor.data;
                        sensores[i].unidad = messageSensor.unidad;

                    }

                }
            }
        }

        var saveDevice = function(dev) {

            $http.post('/devices/add', dev).then(function successCallback(response) {
                // $btn.button('reset');

            }, function errorCallback(response) {


            });

        }

        $scope.getDevices = function() {
            $http({
                method: 'GET',
                url: '/devices/getAll'
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.dispositivos = response.data;
            }, function errorCallback(response) {

            });
        }
        $scope.formatDate = function(date) {
            var dateOut = new Date(date);
            return dateOut;
        }

        $scope.llenarDeviceModal = function(device) {
            console.log(device);
            $scope.deviceModel = device;

        }

        $scope.toggleAlert = function($event) {
            var $this = $(event.target);
            $($this).toggleClass('btn-danger').blur();
            if ($this.attr("class").search("btn-danger") >= 0) {
                $($this).text("Desactivada");
            }
            else {
                $($this).text("Activada");
            }
        }


    }]);












})();
