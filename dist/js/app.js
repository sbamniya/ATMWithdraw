'use strict';

var testApp = angular.module('testApp', ['ngRoute']);

testApp.constant('API_ENDPOINT', 'http://localhost:3000/api/v1.0.0/');

testApp.config(['$routeProvider',function($routeProvider) {
	$routeProvider
	.when('/', {
		controller: 'homeCtrl',
        templateUrl: 'templates/home.html'
	})
    .when('/amount', {
        controller: 'amountCtrl',
        templateUrl: 'templates/amount.html'
    })
    .when('/payment-done/:payID', {
        controller: 'paymentCtrl',
        templateUrl: 'templates/payment-done.html'
    })
}]);