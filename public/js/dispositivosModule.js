(function() {



    var app = angular.module('dispositivos-module', []);


    app.controller('dispositivoController', ['$scope', "socket", '$http', function($scope, socket, $http) {


        $scope.deviceModel = {};
        $scope.dispositivos = [];
        var dispEjm = {
            Dispositivo: "ARDUINO",
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

        socket.on('message', function(msg) {

            parseMessage(msg);
        });



        var parseMessage = function(message) {

            var namedis = message.Dispositivo;


            var device = JSPath.apply('.{.Dispositivo =="' + namedis + '" }.', $scope.dispositivos);


            if (device.length > 0) {

                console.log(device);
                llenarDevice(device, message)
                $scope.$apply();
            }
            else {
                var newDev = {};
                console.log(message);
                newDev.Dispositivo = message.Dispositivo;
                newDev.Lugar = message.Lugar;
                newDev.status = "Activo";
                newDev.sensores = message.sensores;

                $scope.dispositivos.push(newDev);
                $scope.$apply();

            }


            console.log($scope.dispositivos);

        }




        var llenarDevice = function($dispositivos, message) {

            for (i = 0; i < $dispositivos.length; i++) {
                var device = $dispositivos[i];
                device.Lugar = message.Lugar;


                llenarSensor(device.sensores, message.sensores[0]);

                device.status = "Activo";
                $scope.$apply();
            }

        }

        var llenarSensor = function(sensores, messageSensor) {

            for (i = 0; i < sensores.length; i++) {
                console.log(sensores[i].nombre + " " + messageSensor.nombre)
                if (sensores[i].nombre == messageSensor.nombre) {
                    sensores[i].data = messageSensor.data;
                    sensores[i].unidad = messageSensor.unidad;

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
