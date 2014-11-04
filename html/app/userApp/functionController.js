userApp.controller("functionController", ["$scope", "$location", "$routeParams", "$http", "$filter", "apiRoute", "HolyService",
    function($scope, $location, $routeParams, $http, $filter, apiRoute, HolyService) {
        $scope.currentKey = $routeParams.key;

        // Input current date into the inputs in function.html
        $scope.currentDate = new Date();
        $scope.startTime = $filter('date')($scope.currentDate, 'HH:mm');
        $scope.endTime = $filter('date')($scope.currentDate, 'HH:mm');
        $scope.startDate = $filter('date')($scope.currentDate, 'yyyy-MM-dd');
        $scope.endDate = $filter('date')($scope.currentDate, 'yyyy-MM-dd');

        $scope.executionTimes = [];
        console.log("Dagurinn í dager: " + $scope.currentDate);
        //$scope.currentTime = new Date();

        $scope.submitTimeRange = function(sDate, sTime, eDate, eTime) {

            console.log("Now our startTime is: " + sDate + "T" + sTime + ":59Z");
            console.log("Now our endTime is: " + eDate + "T" + eTime + ":59Z");

            var start = new Date(sDate + "T" + sTime + ":59Z").getTime() / 1000;
            var end = new Date(eDate + "T" + eTime + ":59Z").getTime() / 1000;

            $http.get(apiRoute.apiEndpoint + '/api/key/' + $scope.currentKey + '/execution_time/' + start + '/' + end + '/page/0').
            success(function(data, status, headers, config) {
                console.log("Info: got times");
                if (status == 200) {
                    console.log("Info: The times exist");
                    console.log("Info: times are: " + JSON.stringify(data));
                    $scope.executionTimes = data;
                    //setExecutionTimeFormat();
                } else {
                    console.log("Info: Times empty");
                }
            }).
            error(function(data, status, headers, config) {
                console.log("Error: unable to connect");
            });
        };

        $scope.drawChart = function(theData) {
            $scope.chartConfig = {
                options: {
                    chart: {
                        type: 'spline'
                    },
                    plotOptions: {
                        series: {
                            stacking: ''
                        }
                    }
                },
                series: theData,
                title: {
                    text: 'Execution Times'
                },
                credits: {
                    enabled: false
                },
                loading: false,
                size: {}
            }
        }

        $scope.getAll = function(page) {
            console.log("Get all");
            $http.get(apiRoute.apiEndpoint + '/api/key/' + $scope.currentKey + '/execution_time/page/' + page).
            success(function(data, status, headers, config) {
                console.log("Info: got times");
                if (status == 200) {
                    console.log("Info: The times exist");
                    console.log("Info: times are: " + JSON.stringify(data));
                    $scope.executionTimes = data;

                    $scope.drasl = [];
                    angular.forEach(data, function(key, value) {
                        $scope.drasl.push(data[value].execution_time);
                    });

                    $scope.chartSeries = [{
                        "name": "Execution Time",
                        "data": $scope.drasl
                    }];

                    $scope.drawChart($scope.chartSeries);

                } else {
                    console.log("Info: Times empty");
                }
            }).
            error(function(data, status, headers, config) {
                console.log("Error: unable to connect");
            });
        };


        var promise = HolyService.getTotal($scope.currentKey);
        promise.then(function(payload) {
            $scope.getTotalForKey = payload.data;
        }, function(errorPayload) {
            $scope.getTotalForKey = 0;
        });


        $scope.getAll(0);
    }
]);