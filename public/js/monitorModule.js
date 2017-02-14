(function() {

  


    var app = angular.module('monitor-module', ["chart.js", 'n3-pie-chart']);


    app.controller('BarCtrl', ['$scope', '$interval', '$http','socket', function($scope, $interval, $http,socket) {

      
        $scope.tempChart = {};
        $scope.dispositivo = {}
        $scope.consola = [];

        $scope.data = [{
            label: "-",
            value: 0,
            suffix: "-",
            color: "steelblue"
        }];


        $scope.options = {
            thickness: 10,
            mode: "gauge",
            total: 80
        };


        $scope.tempChart.options = {
            animation: false,
            legend: {
                display: false
            },

            responsive: true,
            tooltips: {
                enabled: true,
                /*   
                   custom: customTooltips
                   position:'average',
                   titleFontSize:8,
                   bodyFontSize:9*/

            },

            scales: {
                xAxes: [{
                    display: true
                }],
                yAxes: [{
                    display: true
                }]

            }
        };




        $scope.tempChart.colors = ['#45b7cd', '#38648A'];
        $scope.tempChart.labels = ['-', '-', '-', '-', '-', '-', '-', '-','-', '-', '-', '-', '-', '-', '-', '-'];
        // $scope.tempChart.series = [$scope.dispositivo.Unidad];
        $scope.tempChart.data = [
            [0]
        ];

        socket.on('connect', function() {
            $scope.status = "Conectado";
            console.log($scope.status);
            $scope.$apply();
        });

        var count = new Date();
        var sec = count.getSeconds();
        var min = count.getMinutes();

     /*   socket.on('message', function(msg) {
            var dis = msg;
            var nombre = dis.Dispositivo;
            // $scope.consola.push(new Date());
            var d = new Date();
            var n = d.toISOString();
            $scope.consola.push(n + ": " + JSON.stringify(msg));
            if (dis) {

                $scope.dispositivo = msg;


                $scope.tempChart.datasetOverride = [{
                    label: $scope.dispositivo.Unidad,
                    tension: 0.2,
                    type: 'line',

                    fill: true,
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "rgba(75,192,192,1)",
                    pointBorderWidth: 1,
                    pointHoverRadius: 3,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 1,
                    pointRadius: 2,
                    pointHitRadius: 10


                }];

                var dat = new Date();
                var secda = dat.getSeconds() - sec;
                var minda = dat.getMinutes() - min;

                $scope.tempChart.data[0].push($scope.dispositivo.Valor);
                $scope.tempChart.labels.push(minda + ":" + secda);
                if ($scope.tempChart.data[0].length > 16) {
                    $scope.tempChart.data[0].shift();

                }
                if ($scope.tempChart.labels.length > 16) {
                    $scope.tempChart.labels.shift();
                }
            }
            var uniti = $scope.dispositivo.Unidad;

            $scope.data = [{
                label: $scope.dispositivo.Sensor,
                value: $scope.dispositivo.Valor,
                suffix: uniti.substring(0, 3),
                color: "steelblue"
            }];


            $scope.options = {
                thickness: 10,
                mode: "gauge",
                total: 1000
            };
            $scope.$apply();

        });*/



        $scope.getClass = function() {
            var clss = "label-danger";
            if ($scope.status == "Conectado") {
                clss = "label-success";
            }
            return clss
        };




    }]);









})();
