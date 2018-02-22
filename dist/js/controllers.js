testApp.controller('homeCtrl', ['$scope', 'cardService', '$location', function($scope, cardService, $location){
	$scope.card = {
		number: null,
		pin: null
	}
	$scope.cardError = {};
	$scope.authenticateCard = function() {
		$scope.cardError = {};
		cardService.authCard($scope.card).then(function(data) {
			$scope.card.balance = data.data.balance;
			localStorage.setItem('cardData', JSON.stringify($scope.card));
			$location.path('/amount');
		}, function(err){
			$scope.cardError = err;
		});
	}
}]);

testApp.controller('amountCtrl', ['$scope', 'cardService', '$location', function($scope, cardService, $location){
	var cardData = JSON.parse(localStorage.getItem('cardData'));
	if (cardData==null || typeof cardData !== 'object' || cardData.number == null || cardData.pin == null || cardData.balance===null) {
		$location.path('/');
	}
	$scope.amount = {
		amount: null,
		number: cardData.number,
		pin: cardData.pin
	}
	$scope.availiableBalance = cardData.balance;
	$scope.amountError = {};
	$scope.withdrawMoneyFromCard = function() {
		$scope.amountError = {};
		cardService.withdraw($scope.amount).then(function(data) {
			$location.path('/payment-done/'+data.data);
		}, function(err){
			$scope.amountError = err;
		});
	}
}]);

testApp.controller('paymentCtrl', ['$scope', 'cardService', '$location', '$routeParams', function($scope, cardService, $location, $routeParams){
	var payID = $routeParams.payID;
	console.log(payID);
	var cardData = JSON.parse(localStorage.getItem('cardData'));
	if (cardData==null || typeof cardData !== 'object' || cardData.number == null || cardData.pin == null || cardData.balance===null) {
		$location.path('/');
	}
	$scope.details = []
	cardService.getTransaction(payID).then(function(data){
		$scope.details = data.data;
		console.log($scope.details)
	}, function(err){
		console.log(err)
		$location.path('/');
	});

	$scope.goToHome = function(){
		localStorage.removeItem('cardData');
		$location.path('/');
	}
	
}]);