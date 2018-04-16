var app = angular.module('addbarController', [])

app.controller('addbarController', ['$scope', '$location', '$http', function($scope, $location, $http) {



    $scope.addBar = function(newBar){
        $http.post('/bar', newBar).success(function(data) {
            $scope.bars = data;
            $location.path('/allbarlist');
            console.log(data);
        })
            .error(function(data) {
                console.log('Error: ' + data);

            });
    }
}]);
