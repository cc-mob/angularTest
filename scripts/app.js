'use strict';
var confusionApp = angular.module('confusionApp', ['ngRoute']);


angular.module('Authentication', []);
angular.module('Home', []);
var confusionApp = angular.module('confusionApp', ['Authentication','Home','ngRoute','ngCookies']);



confusionApp
        .config(function($routeProvider) {
                $routeProvider
                    // route for the contactus page
                    .when('/contactus', {
                        templateUrl : './html/contactus.html',
                        controller  : 'ContactController'
                    })
                    // route for the menu page
                    .when('/menu', {
                        templateUrl : './html/menu.html',
                        controller  : 'MenuController'
                    })
                    // route for the dish details page
                    .when('/menu/:id', {
                        templateUrl : './html/dishdetail.html',
                        controller  : 'DishDetailController'
                    })
                     .when('/login', {
                        templateUrl: './html/login.html',
                        controller: 'LoginController',
                        hideMenus: true
                    })
                     .when('/aboutus', {
                        templateUrl: './html/aboutus.html',
                        controller: 'AboutusController'
                    })

                     .when('/', {
                        templateUrl: './html/home.html',
                        controller: 'HomeController'

                    })
                     .when('/system', {
                        templateUrl: './html/system.html',
                        controller: 'SystemController'

                    })
                    //.otherwise({ redirectTo: '/login' });
        })


        .run(['$rootScope', '$location', '$cookieStore', '$http',
            function ($rootScope, $location, $cookieStore, $http) {
                // keep user logged in after page refresh
                $rootScope.globals = $cookieStore.get('globals') || {};
                if ($rootScope.globals.currentUser) {
                    $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
                }

                $rootScope.$on('$locationChangeStart', function (event, next, current) {
                    // redirect to login page if not logged in
                    if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                        $location.path('/login');
                    }
                });
            }]);
