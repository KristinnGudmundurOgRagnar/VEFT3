userApp.controller("functionController", [
    "$routeParams", "$rootScope", "$scope", "$location", "$routeParams", "$http", "$filter", "apiRoute", "executionFactory",
    function($routeParams, $rootScope, $scope, $location, $routeParams, $http, $filter, apiRoute, executionFactory) {
        $scope.currentKey = $routeParams.key;

        // Input current date into the inputs in function.html
        $scope.currentDate = new Date();
        $scope.startTime = $filter('date')($scope.currentDate, 'HH:mm');
        $scope.endTime = $filter('date')($scope.currentDate, 'HH:mm');
        $scope.startDate = $filter('date')($scope.currentDate, 'yyyy-MM-dd');
        $scope.endDate = $filter('date')($scope.currentDate, 'yyyy-MM-dd');

        $scope.executionTimes = [];
        $scope.getTotalForKey = 0;
        $scope.totalItems;

        $scope.submitTimeRange = function(sDate, sTime, eDate, eTime, page) {

            //console.log("Now our startTime is: " + sDate + "T" + sTime + ":59Z");
            //console.log("Now our endTime is: " + eDate + "T" + eTime + ":59Z");

            var start = new Date(sDate + "T" + sTime + ":59Z").getTime() / 1000;
            var end = new Date(eDate + "T" + eTime + ":59Z").getTime() / 1000;

            $scope.drasl = [];
            executionFactory.getCurrentKeyWithRange($scope.currentKey, 0, start, end).then(
                function(data, status, headers, config) {
                    $scope.executionTimes = data;
                    $scope.getTotal(start, end);

                    data.forEach(function(value) {
                        $scope.drasl.push(value.execution_time);
                    });
                });

            $scope.chartSeries = [{
                "name": "Execution Time",
                "data": $scope.drasl
            }];
            $scope.drawChart($scope.chartSeries)

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

        $scope.getCurrentKey = function(mypage) {
            $scope.drasl = [];
            $scope.getTotal(-1, -1);
            executionFactory.getCurrentKey($scope.currentKey, mypage).then(
                function(data) {
                    $scope.executionTimes = data;

                    data.forEach(function(value) {
                        $scope.drasl.push(value.execution_time);
                    });
                });

            $scope.chartSeries = [{
                "name": "Execution Time",
                "data": $scope.drasl
            }];
            $scope.drawChart($scope.chartSeries);
        }


        $scope.getTotal = function(gte, lte) {
            var promise = executionFactory.getTotal($scope.currentKey, gte, lte);
            promise.then(function(totalNumber) {
                $scope.getTotalForKey = totalNumber;
            }, function(errorPayload) {
                $scope.getTotalForKey = 0;
            });

        }

        $scope.getCurrentKey(0);
        $scope.maxSize = 4;
        $scope.bigTotalItems = 0;
        $scope.bigCurrentPage = 1;
        $scope.itemPerPage = 25;

        $scope.setPage = function(pageNo) {
            $scope.bigCurrentPage = pageNo;
        };

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.bigCurrentPage);
            $scope.getCurrentKey($scope.itemPerPage*($scope.bigCurrentPage-1))
        };

        $scope.$watch('getTotalForKey', function(newvalue, oldvalue) {
            $scope.bigTotalItems = newvalue;
        })
    }
]);