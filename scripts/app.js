'use strict';
var confusionApp = angular.module('confusionApp', ['ngRoute']);


angular.module('Authentication', []);
angular.module('Home', []);
var baseURL = 'http://127.0.0.1:3000/';
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
                     .when('/oms', {
                        templateUrl: './html/oms.html',
                        controller: 'OmsController'

                    })
        })


        .run(['$rootScope', '$location', '$cookieStore', '$http','$interval',
            function ($rootScope, $location, $cookieStore, $http, $interval) {
                // keep user logged in after page refresh
                $rootScope.globals = $cookieStore.get('globals') || {};
                if ($rootScope.globals.currentUser) {
                    $http.defaults.headers.common['Authorization'] = $rootScope.globals.currentUser.token; // jshint ignore:line
                }

                $rootScope.$on('$locationChangeStart', function (event, next, current) {
                    // redirect to login page if not logged in
                    if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                        $location.path('/login');
                    }
                });

                $rootScope.theTime = new Date().toLocaleTimeString();

                 $interval(function() {
                    $rootScope.theTime = new Date().toLocaleTimeString();
                  }, 1000);

                 $interval(function() {
                    if($http.defaults.headers.common['Authorization']){
                        if($rootScope.globals.currentUser.retoken){
                            $http.post(baseURL+'api/authenticate/delegation', {username: $rootScope.globals.currentUser.username})
                            .success(function (data,status,headers, config) {
                                console.log('DATA 확인',data.TOKEN);
                                $http.defaults.headers.common['Authorization'] = data.TOKEN;
                            });
                        }else{
                            $location.path('/login');
                        }
                    }
                 }, 50000); //50초


            }])
