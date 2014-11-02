'use strict';

userApp.controller("mainController", ["$scope", "$location", "$http", "apiRoute",

    function($scope, $location, $http, apiRoute) {
        //alert("Ready to work");
        //

        $scope.buttonClicked = function() {
            $location.path("/HERP");
        }


        //$scope.theFunctions = [];

        $http.get(apiRoute.apiEndpoint + '/api/keys').
        success(function(data, status, headers, config) {
            console.log("Info: got keys");
            if (status == 200) {
                console.log("Info: The keys exist");
                console.log("Info: keys are: " + JSON.stringify(data));
                $scope.allKeys = data;
            } else {
                console.log("Info: Keys empty");
            }
        }).
        error(function(data, status, headers, config) {
            console.log("Error: unable to connect");
        });

        $scope.apply;

    }
]);