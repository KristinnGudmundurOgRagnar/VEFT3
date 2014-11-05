'use strict';

var userApp = angular.module('userApp', [
    'ngRoute',
    'ngCookies',
    'ngTouch',
    'config',
    'highcharts-ng',
    'ui.bootstrap'
]);

userApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'views/main.html',
            controller: 'mainController'
        }).when('/:key/', {
            templateUrl: 'views/function.html',
            controller: 'functionController'
        }).otherwise({
            redirectTo: '/'
        });
    }
]);