var app = angular.module('financeController', [])

app.controller('financeController', ['$scope', '$location', '$http', function($scope, $location, $http) {



    $scope.newFinance = function(addFinance){
        $http.post('/newFinance', addFinance).success(function(data) {
            $scope.newFinance = data;
            $location.path('/viewFinance');
            console.log(data);
        })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };


}]);
