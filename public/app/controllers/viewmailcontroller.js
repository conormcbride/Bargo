var app = angular.module('mailListController', [])
app.controller('mailListController', ['$scope', '$http', function($scope, $http) {
    // create a message to display in our view
    $scope.message = 'Mail List!';

    findAll();

    function findAll() {
        $http.get('/mail')
            .success(function (data) {
                $scope.mails = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    $scope.delete = function (id) {
        if (confirm("are you sure you want to delete this ?")) {
            console.log('Deleting id :' + id);

            $http.delete('/mail/' + id)
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

    $scope.update = function (mail) {
        console.log(mail._id);
        $scope.current = mail;
    };

    $scope.save = function () {
        console.log($scope.current._id);
        $http.put('mail/' + $scope.current._id + '/update', $scope.current).success(function (data) {

            console.log(data);
            findAll()
            $scope.current = ""
        }).error(function (data) {
            console.log('Error: ' + data);
        });
    }
}]);