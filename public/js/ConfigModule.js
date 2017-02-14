(function() {



    var app = angular.module('configure-module', []);


    app.controller('mqttController', ['$scope', '$http', function($scope, $http) {


        $scope.mqtt = {};

        $http({
            method: 'GET',
            url: '/mqtt/getmqtt'
        }).then(function successCallback(response) {
            console.log(response);
            $scope.mqtt = response.data;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });




        $scope.conectar = function($event) {
            console.log("CONNECTAR");
            var $this = $(event.target);
 console.log($this);
           // var $btn = $this.button('loading');
            $http.post('/mqtt/connect', $scope.mqtt).then(function successCallback(response) {
               // $btn.button('reset');

            }, function errorCallback(response) {


            });
        };


    }]);



    /*
     * Directiva dashboard
     * recursoTemplate : /dashboardTemplate Express
     *restrict : elemnt
     */
    app.directive('dashboard', function() {
        return {
            restrict: 'E',
            templateUrl: '/templates/dashboardTemplate'
        };
    });






})();
