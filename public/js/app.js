


(function() {

$("#console").hide();
$("#consolebtn").click(function(){
    
    $("#console").toggle(); 
})

    var app = angular.module('controlpanel', ['menu-module','dashboard-module','monitor-module']);



     /*
    * Directiva menu-slide
    * recursoTemplate : /menuTemplate Express
    *restrict : elemnt
    */
    app.directive('contenedor', function() {
        return {
            restrict: 'E',
            templateUrl: '/templates/contenedorTemplate'
        };
    });









})();
