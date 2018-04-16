angular.module('userServices', [])

    .factory('User', function ($http) {

        var userFactory = {}

        userFactory.create = function (regData) {
            return $http.post('/api/users', regData)
        }

        // User.checkUsername(regData);
        userFactory.checkUsername = function (regData) {
            return $http.post('/api/checkusername', regData)
        }
        // User.checkEmail(regData);
        userFactory.checkEmail = function (regData) {
            return $http.post('/api/checkemail', regData)
        }

        userFactory.renewSession = function (username) {
            return $http.get('/api/renewToken' + username)
        }

        return userFactory;
    })

