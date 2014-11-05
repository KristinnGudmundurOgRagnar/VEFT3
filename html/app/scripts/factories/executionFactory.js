'use strict';

userApp.factory('executionFactory', ['$rootScope', '$http', '$q', 'API_URL',
    function($rootScope, $http, $q, API_URL) {
        return {
            getTotal: function(id, gte, lte) {
                var deferred = $q.defer();
                var extraRoute = '';

                if (lte >= 0 && gte >= 0) {
                    extraRoute = '/' + gte + '/' + lte;
                }
                //console.log(apiRoute.apiEndpoint + '/api/total/' + id + extraRoute);

                $http.get(API_URL+ '/total/' + id + extraRoute).
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

                $http.get(API_URL + '/key/' + id + '/execution_time/' + start + '/' + end + '/page/' + page).
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

                $http.get(API_URL + '/key/' + id + '/execution_time/page/' + page).
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