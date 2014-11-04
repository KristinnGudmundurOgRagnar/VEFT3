userApp.factory('HolyService', function(apiRoute, $http) {
    return {
        getTotal: function(id) {
        	console.log("Got this id :" +id);
            return $http.get(apiRoute.apiEndpoint + '/api/total/' + id);
        }
    }
});