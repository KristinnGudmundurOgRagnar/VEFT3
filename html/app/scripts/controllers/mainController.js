'use strict';

var userApp = angular.module('userApp');
userApp.controller('mainController', ['$scope', '$location', '$http', 'API_URL',
    function($scope, $location, $http, API_URL) {

        $scope.listOfKeys = [];

        $http.get(API_URL + '/keys').
        success(function(data, status) {
            console.log('Info: got keys');
            if (status === 200) {
                //console.log("Info: The keys exist");
                //console.log("Info: keys are: " + JSON.stringify(data));
                $scope.listOfKeys = data;
            } else {
                console.log('Info: Keys empty');
            }
        }).
        error(function() {
            $scope.listOfKeys = 'Error getting keys';
        });

        $http.get(API_URL + '/total').
        success(function(data, status) {
            if (status === 200) {
                //console.log('Count is ' + data);

                $scope.totalRows = data;
            }
        }).
        error(function() {
            $scope.totalRows = 'Error getting data';
        });


        $scope.buttonClicked = function(key) {
            $location.path('/' + key + '/');
        };
    }
]);