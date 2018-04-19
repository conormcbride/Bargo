
angular.module('userApp',['appRoutes','addstaffController','addbarController','stafflistController',
    'barlistcontroller','managementController','userControllers','sendMailController',
   'viewMailController','userServices', 'financeController', 'financeController', 'ngAnimate', 'mainController', 'authServices'
    ]) //inject all other modules into this module, this module is then injected into the index page

.config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');

})

// 'viewFinanceController',
// 'financeController',
