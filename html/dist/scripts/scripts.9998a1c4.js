"use strict";var userApp=angular.module("userApp",["ngRoute","ngResource","highcharts-ng","ui.bootstrap"]);userApp.config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"mainController"}).when("/:key/",{templateUrl:"views/function.html",controller:"functionController"}).otherwise({redirectTo:"/"})}]).constant("API_URL","http://127.0.0.1:3000/api"),userApp.factory("executionFactory",["$rootScope","$http","$q","API_URL",function(a,b,c,d){return{getTotal:function(a,e,f){var g=c.defer(),h="";return f>=0&&e>=0&&(h="/"+e+"/"+f),b.get(d+"/total/"+a+h).success(function(a){g.resolve(a)}).error(function(){g.reject()}),g.promise},getCurrentKeyWithRange:function(a,e,f,g){var h=c.defer();return b.get(d+"/key/"+a+"/execution_time/"+f+"/"+g+"/page/"+e).success(function(a,b,c,d){h.resolve(a,b,c,d)}).error(function(){h.reject()}),h.promise},getCurrentKey:function(a,e){var f=c.defer();return b.get(d+"/key/"+a+"/execution_time/page/"+e).success(function(a,b){f.resolve(a)}).error(function(){f.reject()}),f.promise}}}]),userApp.directive("dateTime",function(){return{restrict:"A",require:"?ngModel",link:function(a,b,c,d){function e(){d.$setViewValue(b.val())}return d?(b.bind("blur keyup change",function(){a.$apply(e)}),void e()):void console.log("no model, returning")}}}),userApp.controller("functionController",["$routeParams","$rootScope","$scope","$location","$http","$filter","$interval","executionFactory",function(a,b,c,d,e,f,g,h){c.currentKey=a.key,c.currentDate=new Date,c.startTime=f("date")(c.currentDate,"HH:mm"),c.endTime=f("date")(c.currentDate,"HH:mm"),c.startDate=f("date")(c.currentDate,"yyyy-MM-dd"),c.endDate=f("date")(c.currentDate,"yyyy-MM-dd"),c.executionTimes=[],c.getTotalForKey=0,c.totalItems,c.chartSeries=[];var i=!0;c.submitTimeRange=function(a,b,d,e,f){i=!1;var g=new Date(a+"T"+b+":59Z").getTime()/1e3,j=new Date(d+"T"+e+":59Z").getTime()/1e3;c.listForChart=[],h.getCurrentKeyWithRange(c.currentKey,f,g,j).then(function(a){c.executionTimes=a,c.getTotal(g,j),a.forEach(function(a){c.listForChart.push(a.execution_time)})}),c.chartSeries=[{name:"Execution Time",data:c.listForChart}],c.drawChart(c.chartSeries)},c.drawChart=function(a){c.chartConfig={options:{chart:{type:"spline"},plotOptions:{series:{stacking:""}}},series:a,title:{text:"Execution Times"},credits:{enabled:!1},loading:!1,size:{}}},c.getCurrentKey=function(a){c.listForChart=[],c.getTotal(-1,-1),h.getCurrentKey(c.currentKey,a).then(function(a){c.executionTimes=a,a.forEach(function(a){c.listForChart.push(a.execution_time)})}),c.chartSeries=[{name:"Execution Time",data:c.listForChart}]},c.GetAllEx=function(){c.getCurrentKey(0),c.drawChart(c.chartSeries),c.setPage(1),i=!0},c.getTotal=function(a,b){var d=h.getTotal(c.currentKey,a,b);d.then(function(a){c.getTotalForKey=a},function(){c.getTotalForKey=0})},c.getCurrentKey(0),c.drawChart(c.chartSeries),c.maxSize=4,c.bigTotalItems=0,c.bigCurrentPage=1,c.itemPerPage=25,c.setPage=function(a){c.bigCurrentPage=a},c.pageChanged=function(){i?c.getCurrentKey(c.itemPerPage*(c.bigCurrentPage-1)):c.submitTimeRange(c.startDate,c.startTime,c.endDate,c.endTime,c.itemPerPage*(c.bigCurrentPage-1)),c.drawChart(c.chartSeries)},c.$watch("getTotalForKey",function(a){c.bigTotalItems=a});var j;c.timerCtrl=function(){c.$watch("timerCheck",function(a){var b=f("filter")(a,{val:!0});1==b?j=g(function(){c.getCurrentKey(0),c.drawChart(c.chartSeries),c.setPage(1)},1e4):angular.isDefined(j)&&(g.cancel(j),j=void 0)},!0)}}]),userApp.controller("mainController",["$scope","$location","$http","API_URL",function(a,b,c,d){a.listOfKeys=[],c.get(d+"/keys").success(function(b,c){console.log("Info: got keys"),200==c?a.listOfKeys=b:console.log("Info: Keys empty")}).error(function(){}),c.get(d+"/total").success(function(b,c){200==c&&(a.totalRows=b)}).error(function(){a.totalRows="Error getting data"}),a.buttonClicked=function(a){b.path("/"+a+"/")}}]);