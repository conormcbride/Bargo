angular.module('barlistcontroller', [])

.controller('barlistcontroller',['$scope', '$http', function($scope, $http) {
    // create a message to display in our view
    $scope.message = 'Bar List!';

    findAll();

    function findAll() {
        $http.get('/bar')
            .success(function (data) {
                $scope.bars = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    $scope.delete = function (id) {
        if (confirm("are you sure you want to delete this ?")) {
            console.log('Deleting id :' + id);

            $http.delete('/bar/' + id)
                .success(function (data) {
                    console.log(data);
                    findAll();
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                })
        }
    }
    $scope.current = {};

    $scope.update = function (bar) {
        console.log(bar._id);
        $scope.current = bar;
    };

    $scope.save = function () {
        console.log($scope.current._id);
        $http.put('bar/' + $scope.current._id + '/update', $scope.current).success(function (data) {

            console.log(data);
            findAll()
            $scope.current = ""
        }).error(function (data) {
            console.log('Error: ' + data);
        });
    }
}]);