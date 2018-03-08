var app = angular.module('appRoutes',['ngRoute'])


    .config(function ($routeProvider, $locationProvider) {

        $routeProvider


            .when('/',{
            templateUrl: 'app/views/pages/home.html'

        })

            .when('/about',{

            templateUrl: 'app/views/pages/about.html'

         })
        .when('/addBar',{

            templateUrl: 'app/views/pages/bars/addbar.html',
            controller:'addbarController',
            authenticated: true

         }).when('/addStaff',{

            templateUrl: 'app/views/pages/staff/addstaff.html',
            controller:'addstaffcontroller',
            authenticated: true

         }) .when('/sendMail',{

            templateUrl: 'app/views/pages/mail/sendmail.html',
            controller:'sendMailController',
            authenticated: true

         }).when('/viewMail',{

            templateUrl: 'app/views/pages/mail/viewmail.html',
            controller:'viewMailController',
            authenticated: true

         }).when('/allbarlist',{

            templateUrl: 'app/views/pages/bars/allbarlist.html',
            controller:'barlistController',
            //controllerAs: 'barlist', //nickname for controller
            authenticated: true

         }).when('/allstafflist',{

            templateUrl: 'app/views/pages/staff/allstafflist.html',
            controller:'stafflistController',
            //controllerAs: 'barlist', //nickname for controller
            authenticated: true

         })

            .when('/login',{

                templateUrl: 'app/views/pages/users/login.html',
                authenticated: false

            })
            .when('/register',{

                templateUrl: 'app/views/pages/users/register.html',
                controller: 'regCtrl',
                controllerAs: 'register', //nickname for controller
                authenticated: false
            })

            .when('/logout',{

                templateUrl: 'app/views/pages/users/logout.html',
                // controller: 'regCtrl',
                // controllerAs: 'register' //nickname for controller
                authenticated: true


            })
            .when('/profile',{

                templateUrl: 'app/views/pages/users/profile.html',
                // controller: 'regCtrl',
                // controllerAs: 'register' //nickname for controller
                authenticated: true

            })

            .when('/policy',{

                templateUrl: 'app/views/pages/privatepolicy.html',
                // controller: 'regCtrl',
                // controllerAs: 'register' //nickname for controller

            })


            .when('/facebook/:token',{

                templateUrl: 'app/views/pages/users/social/social.html',
                controller: 'facebookCtrl',
                controllerAs: 'facebook', //nickname for controller,
                authenticated: false



            })

            .when('/twitter/:token',{

                templateUrl: 'app/views/pages/users/social/social.html',
                controller: 'twitterCtrl',
                controllerAs: 'twitter', //nickname for controller
                authenticated: false


            })

            .when('/facebookerror',{

                templateUrl: 'app/views/pages/users/login.html',
                controller: 'facebookCtrl',
                controllerAs: 'facebook', //nickname for controller
                authenticated: false

            })

            .when('/twittererror',{

                templateUrl: 'app/views/pages/users/login.html',
                controller: 'twitterCtrl',
                controllerAs: 'twitter', //nickname for controller
                authenticated: false

            })

            .when('/googleerror',{

                templateUrl: 'app/views/pages/users/login.html',
                controller: 'googleCtrl',
                controllerAs: 'google', //nickname for controller
                authenticated: false

            })

            .when('/google/:token',{

                templateUrl: 'app/views/pages/users/social/social.html',
                controller: 'googleCtrl',
                controllerAs: 'google', //nickname for controller
                authenticated: false

            })
            .otherwise({
                redirectTo: '/'
            })   // redirects users to the home page if the url is incorrect or does not exist


        $locationProvider.html5Mode({
            enabled:true,
            requireBase: false
        })

    })

app.run(['$rootScope', 'Auth', '$location' ,function ($rootScope, Auth, $location) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        if (next.$$route !== undefined) {

            if (next.$$route.authenticated == true) {
                if (!Auth.isLoggedIn()) {
                    event.preventDefault();
                    $location.path('/')
                }

            } else if (next.$$route.authenticated == false) {

                if (Auth.isLoggedIn()) {
                    event.preventDefault();
                    $location.path('/profile')
                }

            } else console.log("does not matter")

            // console.log(next.$$route.authenticated = true)
        }     // console.log(Auth.isLoggedIn())
    })


}]);
