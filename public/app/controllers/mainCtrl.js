angular.module('mainController', ['authServices', 'userServices'])


.controller('mainCtrl', function (Auth, $timeout, $location,$rootScope, $window, $interval, $route, User, AuthToken) {
    var app = this;
    app.loadme = false;

    app.checkSession = function () {
        if(Auth.isLoggedIn()){
            app.checkingSession = true;
            var interval = $interval(function () {
              var token =   $window.localStorage.getItem('token')
                if(token === null){
                    $interval.cancel(interval);
                }else{
                    self.parseJwt = function(token){
                        var base64Url = token.split('.')[1];
                        var base64 = base64Url.replace('-','+').replace('-','/');
                        return JSON.parse($window.atob(base64));
                    }
                    var expireTime = self.parseJwt(token);
                    var timeStamp = Math.floor(Date.now()/1000);
                    console.log(expireTime.exp)
                    console.log(timeStamp)

                    var timeCheck = expireTime.exp - timeStamp;
                    console.log('time check' +timeCheck)

                    if(timeCheck <= 15){
                        $interval.cancel(interval)
                        showModel(1);
                        console.log('Token is expired')
                    }else{
                        console.log('Token not expired')
                    }
                }
            }, 2000 )
        }
    };

    app.checkSession();

    var showModel = function (option) {
        app.choice = false;
        app.modelHeader = undefined;
        app.modelBody = undefined;
        app.hideButton = false;
        if(option ===1 ){
            app.modelHeader = ' Time Out Warning';
            app.modelBody = 'Your session is going to expire in 5 minutes. Would you like to continue?';
            $("#myModal").modal({backdrop: "static"});
        }else if(option ===2 ){
            app.hideButton = true;
            app.modelHeader = 'Logging out';
            $("#myModal").modal({backdrop: "static"});
            $timeout(function () {
                Auth.logout();
                $location.path('/');
                hideModal();
                $route.reload();
            }, 2000)

        } $timeout(function () {

            if(!app.choice){
                hideModal();
            }

        }, 4000)
    }
    
    app.renewSession = function () {
        app.choice = true;
        User.renewSession(app.username).then(function (data) {
            if(data.data.success){
                AuthToken.setToken(data.data.token);
                app.checkSession();
            }else{
                app.modelBody = data.data.message;
            }

        })
        hideModal();
    };

    app.endSession = function () {
        app.choice = true;
        hideModal();
        $timeout(function () {
            showModel(2)
        }, 1000)
    };

    var hideModal = function () {
        $("#myModal").modal("hide");
    }

    $rootScope.$on('$routeChangeStart', function () {
        if(!app.checkSession) app.checkSession();

        if (Auth.isLoggedIn()) {
            // console.log('Success: User is logged in')
            app.isLoggedIn   = true;
            Auth.getUser().then(function (data) {
                // console.log(data.data.username)
                app.username=data.data.username
                app.useremail=data.data.email
                app.loadme = true;
            })
        }
        else {
            // console.log('Failure: User is not logged in')
            app.isLoggedIn = false;
            app.username= ''
            app.loadme = true;

        }
        if($location.hash() == '_=_'){
            $location.hash(null)
        }
    })


    this.facebook = function () {
        console.log($window.location.host) //localhost:3000
        console.log($window.location.protocol) //http:
        $window.location = $window.location.protocol+ '//' + $window.location.host + '/auth/facebook'


    }

    this.twitter = function () {
        console.log($window.location.host) //localhost:3000
        console.log($window.location.protocol) //http:
        $window.location = $window.location.protocol+ '//' + $window.location.host + '/auth/twitter'


    }


    this.google = function () {
        console.log($window.location.host) //localhost:3000
        console.log($window.location.protocol) //http:
        $window.location = $window.location.protocol+ '//' + $window.location.host + '/auth/google'


    }

    this.doLogin = function(loginData){
        app.loading = true;
        app.errorMsg = false;

        Auth.login(app.loginData).then(function (data) {

            if(data.data.success){
                app.loading = false;
                app.successMsg = data.data.message+ '.......... Redirecting'
                $timeout(function () {
                    $location.path('/')
                    app.loginData = '';
                    app.successMsg = false;
                    app.checkSession();
                },2000);

            }else {
                app.loading = false;
                app.errorMsg = data.data.message

            }
        })

    }

    app.logout = function () {
        showModel(2);
    }

})