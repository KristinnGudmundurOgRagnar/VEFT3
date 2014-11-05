'use strict';

userApp.controller('functionController', [
    '$routeParams', '$rootScope', '$scope', '$location',
    '$http', '$filter', '$interval', 'executionFactory',
    function($routeParams, $rootScope, $scope, $location, $http, $filter, $interval, executionFactory) {
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
        $scope.chartSeries = [];
        var prufa = true;
        var ssDate, ssTime, eeDate, eeTime;

        $scope.submitTimeRange = function(sDate, sTime, eDate, eTime, page) {

            //console.log("Now our startTime is: " + sDate + "T" + sTime + ":59Z");
            //console.log("Now our endTime is: " + eDate + "T" + eTime + ":59Z");
            prufa = false;
            var start = new Date(sDate + "T" + sTime + ":59Z").getTime() / 1000;
            var end = new Date(eDate + "T" + eTime + ":59Z").getTime() / 1000;

            $scope.listForChart = [];
            executionFactory.getCurrentKeyWithRange($scope.currentKey, page, start, end).then(
                function(data, status, headers, config) {
                    $scope.executionTimes = data;
                    $scope.getTotal(start, end);

                    data.forEach(function(value) {
                        $scope.listForChart.push(value.execution_time);
                    });
                });

            $scope.chartSeries = [{
                "name": "Execution Time",
                "data": $scope.listForChart
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
            $scope.listForChart = [];
            $scope.getTotal(-1, -1);
            executionFactory.getCurrentKey($scope.currentKey, mypage).then(
                function(data) {
                    $scope.executionTimes = data;

                    data.forEach(function(value) {
                        $scope.listForChart.push(value.execution_time);
                    });
                });

            $scope.chartSeries = [{
                "name": "Execution Time",
                "data": $scope.listForChart
            }];
        }

        $scope.GetAllEx = function() {
            $scope.getCurrentKey(0);
            $scope.drawChart($scope.chartSeries);
            $scope.setPage(1);
            prufa = true;
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
        $scope.drawChart($scope.chartSeries);

        $scope.maxSize = 4;
        $scope.bigTotalItems = 0;
        $scope.bigCurrentPage = 1;
        $scope.itemPerPage = 25;

        $scope.setPage = function(pageNo) {
            $scope.bigCurrentPage = pageNo;
        };

        $scope.pageChanged = function() {
            //console.log('Page changed to: ' + $scope.bigCurrentPage);
            if (prufa)
                $scope.getCurrentKey($scope.itemPerPage * ($scope.bigCurrentPage - 1))
            else {
                $scope.submitTimeRange($scope.startDate, $scope.startTime, $scope.endDate, $scope.endTime, $scope.itemPerPage * ($scope.bigCurrentPage - 1));
            }
            $scope.drawChart($scope.chartSeries);
        };

        $scope.$watch('getTotalForKey', function(newvalue, oldvalue) {
            $scope.bigTotalItems = newvalue;
        });

        // Here comes the timer for updating the view
        var timer;
        $scope.timerCtrl = function() {
            $scope.$watch('timerCheck', function(n, o) {
                var trues = $filter('filter')(n, {
                    val: true
                })
                if (trues == true) {
                    timer = $interval(function() {
                        $scope.getCurrentKey(0);
                        $scope.drawChart($scope.chartSeries);
                        $scope.setPage(1);
                    }, 10000);
                } else {
                    if (angular.isDefined(timer)) {
                        $interval.cancel(timer);
                        timer = undefined;
                    }
                }
            }, true);
        };
    }
]);