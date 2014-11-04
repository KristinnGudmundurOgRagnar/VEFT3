userApp.controller("functionController", ["$scope", "$location", "$routeParams", "$http", "$filter", "apiRoute",
    function($scope, $location, $routeParams, $http, $filter, apiRoute) {
        $scope.currentKey = $routeParams.key;

        // Input current date into the inputs in function.html
        $scope.currentDate = new Date();
        $scope.startTime = $filter('date')($scope.currentDate, 'HH:mm');
        $scope.endTime = $filter('date')($scope.currentDate, 'HH:mm');
        $scope.startDate = $filter('date')($scope.currentDate, 'yyyy-MM-dd');
        $scope.endDate = $filter('date')($scope.currentDate, 'yyyy-MM-dd');

        $scope.executionTimes = [];

        $scope.currentTime = new Date();

        $scope.submitTimeRange = function() {

            var theStartDate = $scope.startDate;
            var theEndDate = $scope.endDate;
            var theStartTime = $scope.startTime;
            var theEndTime = $scope.endTime;

            var start = new Date(theStartDate + "T" + theStartTime+"Z").getTime() / 1000;
            var end = new Date(theEndDate + "T" + theEndTime+"Z").getTime() / 1000;

            $http.get(apiRoute.apiEndpoint + '/api/key/' + $scope.currentKey + '/execution_time/' + $scope.startTime + '/' + $scope.endTime + '/page/0').
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
            $http.get(apiRoute.apiEndpoint + '/api/key/' + $scope.currentKey + '/execution_time/page/'+page).
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

        $scope.getAll(0);
        $scope.apply;

    }
]);