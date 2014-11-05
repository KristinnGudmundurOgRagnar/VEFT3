'use strict';

var userApp = angular.module('userApp', [
    'ngRoute',
    'ngResource',
    'highcharts-ng',
    'ui.bootstrap',
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
]).constant('API_URL', 'http://127.0.0.1:3000/api');