


(function() {


    var app = angular.module('dashboard-module', []);
   
 /*
app.controller('monitorController',['$scope','$http', function($scope,$http) {

     
    }]);*7

  
    
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
