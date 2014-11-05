'use strict';

var userApp = angular.module('userApp');
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
        $scope.totalItems = 0;
        $scope.chartSeries = [];

        $scope.updateNumber = 10000;
        var isNotRange = true;

        $scope.submitTimeRange = function(sDate, sTime, eDate, eTime, page) {

            //console.log("Now our startTime is: " + sDate + "T" + sTime + ":59Z");
            //console.log("Now our endTime is: " + eDate + "T" + eTime + ":59Z");
            isNotRange = false;
            var start = new Date(sDate + 'T' + sTime + ':59Z').getTime() / 1000;
            var end = new Date(eDate + 'T' + eTime + ':59Z').getTime() / 1000;

            $scope.listForChart = [];
            executionFactory.getCurrentKeyWithRange($scope.currentKey, page, start, end).then(
                function(data) {
                    $scope.executionTimes = data;
                    $scope.getTotal(start, end);

                    data.forEach(function(value) {
                        $scope.listForChart.push(value.execution_time);
                    });
                });

            $scope.chartSeries = [{
                'name': 'Execution Time',
                'data': $scope.listForChart,
                'color': '#6956D6'
            }];
            $scope.drawChart($scope.chartSeries);
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
                chart: {
                    renderTo: 'container'
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
            };
        };

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
                'name': 'Execution Time',
                'data': $scope.listForChart,
                'color': '#6956D6'
            }];
        };

        $scope.GetAllEx = function() {
            $scope.getCurrentKey(0);
            $scope.drawChart($scope.chartSeries);
            $scope.setPage(1);
            isNotRange = true;
        };


        $scope.getTotal = function(gte, lte) {
            var promise = executionFactory.getTotal($scope.currentKey, gte, lte);
            promise.then(function(totalNumber) {
                $scope.getTotalForKey = totalNumber;
            }, function() {
                $scope.getTotalForKey = 0;
            });
        };

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
            if (isNotRange) {
                $scope.getCurrentKey($scope.itemPerPage * ($scope.bigCurrentPage - 1));
            } else {
                $scope.submitTimeRange($scope.startDate, $scope.startTime, $scope.endDate, $scope.endTime, $scope.itemPerPage * ($scope.bigCurrentPage - 1));
            }
            $scope.drawChart($scope.chartSeries);
        };

        $scope.$watch('getTotalForKey', function(newvalue) {
            $scope.bigTotalItems = newvalue;
        });

        // Here comes the timer for updating the view
        var timer;
        $scope.$watch('timerCheck', function(n) {
            var trues = $filter('filter')(n, {
                val: true
            });

            if (trues === true) {

                timer = $interval(function() {
                    $scope.getCurrentKey(0);
                    $scope.drawChart($scope.chartSeries);
                    $scope.setPage(1);
                }, $scope.updateNumber);
            } else {
                $scope.stopTimer();
            }
        }, true);

        $scope.stopTimer = function() {
            if (angular.isDefined(timer)) {
                $interval.cancel(timer);
                timer = undefined;
            }
        };
        $scope.$on('$destroy', function() {
            $scope.stopTimer();
        });
    }
]);