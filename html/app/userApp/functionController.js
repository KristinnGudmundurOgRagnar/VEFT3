userApp.controller("functionController", ["$scope", "$location",
function($scope, $location){

	$scope.buttonClicked = function(){
		alert("Stuff");
	};
}]);