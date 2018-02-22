testApp.service('cardService', ['$http', '$q', 'API_ENDPOINT', function($http, $q, API_ENDPOINT){
	return {
		authCard: function(cardData){
			return $http.post(API_ENDPOINT+'check-card-details', cardData).then(function(result){
				return $q.resolve(result.data);
			}, function(err){
				return $q.reject(err.data);
			})
		},
		withdraw: function(cardData){
			return $http.post(API_ENDPOINT+'withdraw', cardData).then(function(result){
				return $q.resolve(result.data);
			}, function(err){
				return $q.reject(err.data);
			})
		},
		getTransaction: function(id){
			return $http.get(API_ENDPOINT+'get-info?id='+id).then(function(result){
				return $q.resolve(result.data);
			}, function(err){
				return $q.reject(err.data);
			})
		}
	}
}])