userApp.controller("functionController", ["$scope", "$location", "$routeParams", "$http", "apiRoute",
function($scope, $location, $routeParams, $http, apiRoute){
	$scope.currentKey = $routeParams.key;
	$scope.startTime;
	$scope.endTime;
	$scope.executionTimes = [];

	$scope.submitTimeRange = function(){
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
	
	$scope.getAll = function(){
		console.log("Get all");
		$http.get(apiRoute.apiEndpoint + '/api/key/' + $scope.currentKey + '/execution_time').
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

	$scope.getAll();

	function setExecutionTimeFormat(){
		for(var i = 0; i < $scope.executionTimes.length; i++){
			var newTime = new Date();
			newTime.setUTCSeconds($scope.executionTimes[i].timestamp);
			newTime = newTime.toLocaleString();

			$scope.executionTimes[i].timestamp = newTime;
		}
	}

	
	$scope.chartSeries = [
		{"name": "Some data", "data": [1, 2, 4, 7, 3]},
	];

	$scope.chartConfig = {
		options: {
			chart: {
				type: 'line'
			},
			plotOptions: {
				series: {
					stacking: ''
				}
			}
		},
		series: $scope.chartSeries,
		title: {
			text: 'Execution Times'
		},
		credits: {
			enabled: true
		},
		loading: false,
		size: {}
	}

}]);