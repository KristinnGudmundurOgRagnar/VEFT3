userApp.controller("mainController", ["$scope", "$location",
function($scope, $location){
	//TODO: Get this list from the API
	$scope.listOfKeys = ["key1", "key2", "key3"];

	$scope.buttonClicked = function(key){
		$location.path("/" + key + "/");
	};
}]);