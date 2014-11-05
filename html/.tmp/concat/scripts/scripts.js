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
"use strict";

angular.module("config", [])

.constant("apiRoute", {
    "apiEndpoint": "http://127.0.0.1:3000"
});
'use strict';

userApp.factory('executionFactory', ['$rootScope', '$http', '$q', 'apiRoute',
    function($rootScope, $http, $q, apiRoute) {
        return {
            getTotal: function(id, gte, lte) {
                var deferred = $q.defer();
                var extraRoute = '';

                if (lte >= 0 && gte >= 0) {
                    extraRoute = '/' + gte + '/' + lte;
                }
                //console.log(apiRoute.apiEndpoint + '/api/total/' + id + extraRoute);

                $http.get(apiRoute.apiEndpoint + '/api/total/' + id + extraRoute).
                success(function(data) {
                    deferred.resolve(data);
                }).
                error(function() {
                    deferred.reject();
                });

                return deferred.promise;
            },

            getCurrentKeyWithRange: function(id, page, start, end) {
                var deferred = $q.defer();

                $http.get(apiRoute.apiEndpoint + '/api/key/' + id + '/execution_time/' + start + '/' + end + '/page/' + page).
                success(function(data, status, headers, config) {
                    deferred.resolve(data, status, headers, config);
                }).
                error(function() {
                    deferred.reject();
                });

                return deferred.promise;
            },

            getCurrentKey: function(id, page) {
                var deferred = $q.defer();

                $http.get(apiRoute.apiEndpoint + '/api/key/' + id + '/execution_time/page/' + page).
                success(function(data, status, headers) {
                    //console.log("Info: got times");
                    if (status == 200) {
                        //console.log("Info: The times exist");
                        //onsole.log("Info: times are: " + JSON.stringify(data));
                    }
                    deferred.resolve(data);
                }).
                error(function() {
                    deferred.reject();
                });

                return deferred.promise;
            }
        }
    }
]);
'use strict';

userApp.directive('dateTime', function() {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
            if (!ngModel) {
                console.log('no model, returning');
                return;
            }

            element.bind('blur keyup change', function() {
                scope.$apply(read);
            });

            read();

            function read() {
                ngModel.$setViewValue(element.val());
            }
        }
    }
});
'use strict';

userApp.controller('functionController', [
    '$routeParams', '$rootScope', '$scope', '$location',
    '$http', '$filter', 'apiRoute', 'executionFactory',
    function($routeParams, $rootScope, $scope, $location, $http, $filter, apiRoute, executionFactory) {
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
        $scope.timerCtrl = function($scope, $filter, $interval) {
            $scope.$watch("timerCheck", function(n, o) {
                var trues = $filter("filter")(n, {
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
        }

    }
]);
'use strict';

userApp.controller('mainController', ['$scope', '$location', '$http', 'apiRoute',
    function($scope, $location, $http, apiRoute) {

        $scope.listOfKeys = [];

        $http.get(apiRoute.apiEndpoint + '/api/keys').
        success(function(data, status, headers, config) {
            console.log("Info: got keys");
            if (status == 200) {
                //console.log("Info: The keys exist");
                //console.log("Info: keys are: " + JSON.stringify(data));
                $scope.listOfKeys = data;
            } else {
                console.log("Info: Keys empty");
            }
        }).
        error(function(data, status, headers, config) {
            //console.log("Error: unable to connect");
        });

        $http.get(apiRoute.apiEndpoint + '/api/total').
        success(function(data, status, headers, config) {
            if (status == 200) {
                //console.log('Count is ' + data);

                $scope.totalRows = data;
            }
        }).
        error(function(data, status, headers, config) {
            $scope.totalRows = "Error getting data";
        });


        $scope.buttonClicked = function(key) {
            $location.path("/" + key + "/");
        };
    }
]);