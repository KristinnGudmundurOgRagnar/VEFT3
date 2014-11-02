var userApp = angular.module("userApp", ["ngRoute"]);


userApp.config(["$routeProvider", function($routeProvider){
	$routeProvider.when("/", {
		templateUrl: "views/main.html",
		controller: "mainController"
	}).when("/:key/", {
		templateUrl: "views/function.html",
		controller: "functionController"
	}).otherwise({redirectTo: "/"});
}]);