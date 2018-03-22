var app = angular.module('sendMailController', []);
// var main = angular.module('mainController', []);
app.controller('sendMailController', ['$scope', '$location', '$http', function($scope, $location, $http) {



    $scope.addMail = function(newMail){
        $http.post('/mail', newMail).success(function(data) {
            $scope.mails = data;
            $location.path('/allmaillist');
            console.log(newMail);
            // console.log(main.username);
        })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
    // $scope.addBar =  function hello() {
    //
    //     console.log("Hello WOrld");
    //
    // }

}]);