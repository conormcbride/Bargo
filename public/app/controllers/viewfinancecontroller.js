var app = angular.module('viewFinanceController', [])
app.controller('viewFinanceController', ['$scope', '$http', function($scope, $http) {
    // create a message to display in our view
    $scope.message = 'Finance List!';

    findAll();

    function findAll() {
        $http.get('/finance')
            .success(function (data) {
                $scope.mails = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };


    $scope.current = {};

    // $scope.update = function (mail) {
    //     console.log(mail._id);
    //     $scope.current = mail;
    // };
    //
    // $scope.save = function () {
    //     console.log($scope.current._id);
    //     $http.put('mail/' + $scope.current._id + '/update', $scope.current).success(function (data) {
    //
    //         console.log(data);
    //         findAll()
    //         $scope.current = ""
    //     }).error(function (data) {
    //         console.log('Error: ' + data);
    //     });
    // }
}]);