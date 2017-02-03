(function() {
    var currentX = null;
    var currentY = null;
    var customTooltips = function(tooltip) {

        var helpers = Chart.helpers;
        var ctx = this._chart.ctx;
        var vm = this._view;

        if (vm == null || ctx == null || helpers == null || vm.opacity === 0) {
            return;
        }

        var tooltipSize = this.getTooltipSize(vm);

        var pt = {
            x: vm.x,
            y: vm.y
        };

        if (currentX == vm.x && currentY == vm.y) {
            return;
        }

        currentX = vm.x;
        currentY = vm.y;

        //  IE11/Edge does not like very small opacities, so snap to 0
        var opacity = Math.abs(vm.opacity < 1e-3) ? 0 : vm.opacity;

        // Draw Background
        var bgColor = helpers.color(vm.backgroundColor);
        ctx.fillStyle = bgColor.alpha(opacity * bgColor.alpha()).rgbString();
        helpers.drawRoundedRectangle(ctx, pt.x, pt.y, tooltipSize.width, tooltipSize.height, vm.cornerRadius);
        ctx.fill();

        // Draw Caret
        this.drawCaret(pt, tooltipSize, opacity);

        // Draw Title, Body, and Footer
        pt.x += vm.xPadding;
        pt.y += vm.yPadding;

        // Titles
        this.drawTitle(pt, vm, ctx, opacity);

        // Body
        this.drawBody(pt, vm, ctx, opacity);

        // Footer
        this.drawFooter(pt, vm, ctx, opacity);
    };


    var scaleSettings = {
        startValue: -50,
        endValue: 50,
        majorTick: {
            color: 'black',
            tickInterval: 10
        },
        minorTick: {
            visible: true,
            color: 'black',
            tickInterval: 1
        }
    };

    var app = angular.module('monitor-module', ["chart.js"]);


    app.controller('BarCtrl', ['$scope', '$interval', '$http', function($scope, $interval, $http) {

        $scope.tempChart = {};
        $scope.dispositivo = {}

      



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
var coutn =0;

    

        $scope.tempChart.colors = ['#45b7cd', '#38648A'];
        $scope.tempChart.labels = ['-', '-', '-', '-', '-'];
       // $scope.tempChart.series = [$scope.dispositivo.Unidad];
        $scope.tempChart.data = [
            [0]
        ];

    

$interval(function() {
  $http.get("/dispositivos").success(function(data) {
            var dis = data[0];
            var nombre = dis.Dispositivo;
           if(dis){
                
                    $scope.dispositivo = data[0];
            
                
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
        
       
        coutn = coutn +1;
           $scope.tempChart.data[0].push($scope.dispositivo.Valor);
            $scope.tempChart.labels.push(coutn);
                if ($scope.tempChart.data[0].length > 9) {
                    $scope.tempChart.data[0].shift();

                }
                 if ($scope.tempChart.labels.length < 9) {
                   $scope.tempChart.labels.shift();
                }
           }
         
            
        }).error(function(){
            $scope.dispositivo.status ="Desconectado";
        });
       
}, 1000);

$scope.getClass =  function(){
    var clss = "label-danger";
    if(  $scope.dispositivo.status =="Conectado"){
        clss = "label-success";
    }
    return clss
};
      



    }]);









})();
