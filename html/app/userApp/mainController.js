userApp.controller("mainController", ["$scope", "$location",
function($scope, $location){
	//alert("Ready to work");

	$scope.buttonClicked = function(){
		$location.path("/HERP");
	}
}]);