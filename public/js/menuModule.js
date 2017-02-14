


(function() {


    var app = angular.module('menu-module', ['slide-menu']);
   
 
app.controller('menuController',['$scope','$http', function($scope,$http) {

       var  menu = this;
       menu.header = "Panel de Control"
       menu.itemsMenu = [{name:"Panel de Control",href:"#dashboard"},
       {name:"Proyectos",href:"#proyects"},
       {name:"Modulos",href:"#modules"}];

    }]);

  /*
    * Directiva navi
    * recursoTemplate : /navi Express
    *restrict : elemnt
    */
   /* app.directive('barNav', function() {
        return {
            restrict: 'E',
            templateUrl: '/templates/naviTemplate'
        };
    });*/

    
    
      /*
    * Directiva menu-slide
    * recursoTemplate : /menuTemplate Express
    *restrict : elemnt
    */
    app.directive('menuSlide', function() {
        return {
            restrict: 'E',
            templateUrl: '/templates/menu-slide'
        };
    });


  




})();
