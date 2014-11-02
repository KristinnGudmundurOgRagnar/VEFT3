userApp.controller("functionController", ["$scope", "$location", "$routeParams",
function($scope, $location, $routeParams){
	$scope.currentKey = $routeParams.key;

	$scope.buttonClicked = function(){
		alert("Stuff");
	};
}]);