(function() {




    var app = angular.module('monitor-module', ["chart.js", 'n3-pie-chart','gridster']);


    app.controller('BarCtrl', ['$scope', '$interval', '$http', 'socket',  function($scope, $interval, $http, socket) {

 
        $scope.gridsterOpts = {
    columns: 28, // the width of the grid, in columns

    defaultSizeX: 8, // the default width of a gridster item, if not specifed
    defaultSizeY: 6, // the default height of a gridster item, if not specified
    minSizeX: 6, // minimum column width of an item
    minSizeY: 6, // minumum row height of an item
    
    resizable: {
       enabled: true,
       handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
       start: function(event, $element, widget) {console.log("a")}, // optional callback fired when resize is started,
       resize: function(event, $element, widget) {}, // optional callback fired when item is resized,
       stop: function(event, $element, widget) {} // optional callback fired when item is finished resizing
    },
    draggable: {
       enabled: true, // whether dragging items is supported
       handle: '.panel-heading', // optional selector for drag handle
       start: function(event, $element, widget) {}, // optional callback fired when drag is started,
       drag: function(event, $element, widget) {}, // optional callback fired when item is moved,
       stop: function(event, $element, widget) {} // optional callback fired when item is finished dragging
    }
};
        $scope.widgets = [];


        var widgetExample = {
            tipo: "linear",
            dispositivo: "ARD1",
            sensor: "AL2",
            unidad: "AMP",
            lugar: "EKT",
            chart: {
                create: true,
                labels: [],
                data: [
                    [0]
                ],
                options: {
                    animation: false,
                    legend: {
                        display: false
                    },

                    responsive: true,
                    tooltips: {
                        mode: 'single',
                        callbacks: {
                            label: function(tooltipItems, data) {
                                return tooltipItems.yLabel + " ";
                            }
                        }

                        /*   
                           custom: customTooltips
                           position:'average',
                           titleFontSize:8,
                           bodyFontSize:9*/

                    },

                    scales: {
                        xAxes: [{
                            display: false
                        }],
                        yAxes: [{
                            display: true
                        }]

                    }
                },
                colors: ['#45b7cd'],
                datasetOverride: [{
                    tension: 0.3,
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
                }]

            },
            opciones: {
                color: "blue",
                size: 8
            }


        };

        var widgetExample2 = {
            tipo: "gauge",
            dispositivo: "ARD2",
            sensor: "TEMP1",
            unidad: "",
            lugar: "",
            chart: {
                create: true,
                data: [{
                    label: "-",
                    value: 0,
                    suffix: "-",
                    color: "steelblue"
                }],
                opciones: {
                    thickness: 12,
                    mode: "gauge",
                    total: 100
                }
            },
            opciones: {
                color: "blue",
                size: 3
            }


        };


        var widgetExample3 = {
            tipo: "gauge",
            dispositivo: "ARD",
            sensor: "AL2",
            unidad: "",
            lugar: "",
            chart: {
                create: true,
                data: [{
                    label: "-",
                    value: 0,
                    suffix: "-",
                    color: "#DE5D5D"
                }],
                opciones: {
                    thickness: 12,
                    mode: "gauge",
                    total: 500
                }
            },
            opciones: {
                color: "blue",
                size: 3
            }


        };



        var widgetExample4 = {
            tipo: "text",
            dispositivo: "ARD",
            sensor: "AL2",
            unidad: "",
            lugar: "",
            valor: "",
            opciones: {
                color: "blue",
                size: 3
            }


        };

        var initialGauge = function(widget) {

            widget.chart.options = widget.chart.opciones;
        }

        var initialChart = function(widget) {
            var numsamples = 60;
            for (var i = 0; i < numsamples; i++) {
                widget.chart.labels.push('');
                widget.chart.data[0].push(null);
            }
        }

        initialChart(widgetExample);

        $scope.widgets.push(widgetExample);
    //    $scope.widgets.push(widgetExample2);
      //  $scope.widgets.push(widgetExample3);
        $scope.widgets.push(widgetExample4);

        socket.on('message', function(msg) {


            watchDeices(msg);
        });


        var watchDeices = function(msg) {
            var widget = JSPath.apply('.{.dispositivo =="' + msg.Dispositivo + '" }.', $scope.widgets);

            if (widget.length > 0) {


                llenarWidget(widget, msg)
                $scope.$apply();
            }

        }


        var llenarWidget = function(wid, msg) {

            for (i = 0; i < wid.length; i++) {

                var sensPth = JSPath.apply('.{.nombre =="' + wid[i].sensor + '" }', msg.sensores);
                if (sensPth[0]) {
                    wid[i].unidad = sensPth[0].unidad;



                    switch (wid[i].tipo) {
                        case "linear":
                            wid[i].chart.data[0].shift();
                            wid[i].chart.labels.shift();
                            var label = '-';
                            wid[i].chart.data[0].push(sensPth[0].data[0].valor);

                            var ts = new Date();
                            var csecs = moment(ts).format('s');
                            var label = '';
                            if (csecs % 15 === 0){
                                label = csecs == '0' ? moment(ts).format('HH:mm') : moment(ts).format(':ss');}
                            
                            wid[i].chart.labels.push(label);
                            wid[i].unidad = sensPth[0].unidad;

                            break;
                        case "gauge":

                            var color = wid[i].chart.data[0].color;
                            wid[i].chart.data = [{
                                label: sensPth[0].nombre,
                                value: sensPth[0].data[0].valor,
                                suffix: sensPth[0].unidad,
                                color: color
                            }];
                            wid[i].unidad = sensPth[0].unidad;
                            initialGauge(wid[i]);

                            break;
                        case "text":

                            var mathUnit = math.unit(sensPth[0].data[0].valor, wid[i].unidad = sensPth[0].unidad);
                            var unitString = mathUnit.toString();
                            var unitSplice = unitString.split(" ");
                            var valor = unitSplice[0];
                            var unidad = unitSplice[1];

                            wid[i].valor = valor;
                            wid[i].unidad = unidad;

                            break;




                    }
                }

            }
            $scope.$apply();

        }


        $scope.getClass = function() {
            var clss = "label-danger";
            if ($scope.status == "Conectado") {
                clss = "label-success";
            }
            return clss
        };




    }]);



    /**
     * Directive Proxy caraga widgets por tipo
     *
     */
    app.directive('proxy', ['$parse', '$injector', '$compile', function($parse, $injector, $compile) {
        return {
            replace: true,
            link: function(scope, element, attrs) {
                var nameGetter = $parse(attrs.proxy);
                var name = nameGetter(scope);
                var value = undefined;
                if (attrs.proxyValue) {
                    var valueGetter = $parse(attrs.proxyValue);
                    value = valueGetter(scope);
                }

                var directive = $injector.get(name.tipo + 'Directive')[0];

                if (value !== undefined) {

                    attrs[name.tipo] = value;

                }
                var a = $compile(directive.template)(scope);

                element.replaceWith(a);

            }
        }
    }])



    /**
     * Directiva Widget Linear.
     *
     */
    app.directive('linear', function() {
        return {
            restrict: 'A',
            scope: true,
            replace: true,
            template: "<canvas class = 'chart chart-line' chart-data='wid.chart.data' chart-labels='wid.chart.labels' chart-options='wid.chart.options' chart-dataset-override='wid.chart.datasetOverride' chart-colors='wid.chart.colors')></canvas>",
            link: function(scope, element, attrs) {

            }
        }
    })

    /**
     * Directiva Widget Gauge.
     *
     */
    app.directive('gauge', function() {
        return {
            restrict: 'A',
            scope: true,
            replace: true,
            template: "<div><pie-chart data='wid.chart.data' options='wid.chart.options'></pie-chart></div>",
            link: function(scope, element, attrs) {

            }
        }
    })


    /**
     * Directiva Widget text.
     *ng-class='{\"charMedium\": (wid.valor.toString().length >= 7), \"charLarge\": (wid.valor.toString().length >= 17)}'
     */
    app.directive('text', function() {
        return {
            restrict: 'A',
            scope: true,
            replace: true,
            template: "<div style='height: 100%; width: 100%; display: table'>"+
           "<div style='display: table-cell; vertical-align: middle'>"+
  "<div style='max-width: 300px; margin: 0 auto;'>"+
"<h1 class='text-center text-widget'> {{wid.valor}} <small> {{wid.unidad}}</small><h1><div><div><div>",
            link: function(scope, element, attrs) {

            }
        }
    })
})();
