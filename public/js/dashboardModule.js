(function() {



    var app = angular.module('dashboard-module', []);


    app.controller('alertController', ['$scope', '$http', function($scope, $http) {
        $scope.toggleAlert = function($event) {
            var $this = $(event.target);
            $($this).toggleClass('btn-danger').blur();
            if ($("#alertbtn").attr("class").search("btn-danger") >= 0) {
                $($this).text("Desactivada");
            }
            else {
                $($this).text("Activada");
            }
        }
        
        
    }]);



    /*
     * Directiva dashboard
     * recursoTemplate : /dashboardTemplate Express
     *restrict : elemnt
     */
    app.directive('dashboard', function() {
        return {
            restrict: 'E',
            templateUrl: '/templates/dashboard'
        };
    });






})();
