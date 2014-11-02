userApp.controller("functionController", ["$scope", "$location", "$routeParams", "$http", "$filter", "apiRoute",
    function($scope, $location, $routeParams, $http, $filter, apiRoute) {
        $scope.currentKey = $routeParams.key;
        $scope.startTime;
        $scope.endTime;
        $scope.executionTimes = [];

        $scope.currentTime = $filter('date')(new Date(), 'HH:mm:ss')

        $scope.submitTimeRange = function() {
            var start = new Date();
            var end = new Date();
            start.setUTCSeconds($scope.startTime);
            end.setUTCSeconds($scope.endTime);

            console.log("StartTime: " + start);
            console.log("EndTime: " + end);


            $http.get(apiRoute.apiEndpoint + '/api/key/' + $scope.currentKey + '/execution_time/' + $scope.startTime + '/' + $scope.endTime).
            success(function(data, status, headers, config) {
                console.log("Info: got times");
                if (status == 200) {
                    console.log("Info: The times exist");
                    console.log("Info: times are: " + JSON.stringify(data));
                    $scope.executionTimes = data;
                    setExecutionTimeFormat();
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
                    enabled: true
                },
                loading: false,
                size: {}
            }
        }

        $scope.getAll = function() {
            console.log("Get all");
            $http.get(apiRoute.apiEndpoint + '/api/key/' + $scope.currentKey + '/execution_time').
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
                        "name": "Somename",
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

        $scope.getAll();




    }
]);