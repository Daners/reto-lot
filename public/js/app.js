(function() {

    $("#console").hide();
    $("#consolebtn").click(function() {

        $("#console").toggle();
    })
    




     var app = angular.module('controlpanel', ['ngRoute', 'menu-module', 'dashboard-module', 'monitor-module','configure-module','ng-mfb',"dispositivos-module","timer"]);

    app.config(function($routeProvider) {
        $routeProvider.when("/", {
            templateUrl: "/templates/dashboard",
          
            // Is there a way to load /experiment/managementController.js here?
        }).when("/config", {
             templateUrl: "/templates/config",
             // Is there a way to load /experiment/managementController.js here?
        }).when("/dispositivos", {
            templateUrl: "/templates/dispositivos",
            // Is there a way to load /experiment/managementController.js here?
       
         }).when("/charTest", {
             templateUrl: "/templates/chart",
             // Is there a way to load /experiment/managementController.js here?
        });
    });

    /*
     * Directiva menu-slide
     * recursoTemplate : /menuTemplate Express
     *restrict : elemnt
     */
    app.directive('contenedor', function() {
        return {
            restrict: 'E',
            templateUrl: '/templates/ccontenedor'
        };
    });


  /*
     * Directiva config
     * recursoTemplate : /configTemplate Express
     *restrict : elemnt
     */
    app.directive('config', function() {
        return {
            restrict: 'E',
            templateUrl: '/templates/config'
        };
    });


app.factory('socket', ['$rootScope', function ($rootScope) {
  var socket = io.connect();

  return {
    on: function (eventName, callback) {
 

     

      return  socket.on(eventName, callback);
    },

    emit: function (eventName, data, callback) {
     return socket.emit(eventName, data, function () {
      
          if(callback) {
            callback;
          }
        
      });
    }
  };
}]);





})();
