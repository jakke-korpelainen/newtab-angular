define(['angularAMD'], function (angularAMD) {
	var services = angular.module('services', []);
	services.factory("LS", function($window, $http, $q, $rootScope) {
	  var userPath = 'new-tab-user',
		  storagePath = 'new-tab-storage';

  	  return {
	    setData: function(val) {
    	  $window.localStorage && $window.localStorage.setItem(storagePath, val);
	      return this;
	    },
	    getData: function() {
	      return JSON.parse($window.localStorage.getItem(storagePath));
	    },
	    hasDateExpired : function(dayVal) {
	      var storedFiles = JSON.parse($window.localStorage.getItem(storagePath)) || {};
      	  return (typeof storedFiles.date === "undefined" || storedFiles.date < dayVal);
	    },
	    hasHourExpired : function(hourVal) {
		  var storedFiles = JSON.parse($window.localStorage.getItem(storagePath)) || {};
      	  return (typeof storedFiles.hour === "undefined" || storedFiles.hour < hourVal);
	    },
	    loadUser: function() {
	    	var promise = $http.get('user.json');
 
			promise.then(function(response) {
				$window.localStorage.setItem(userPath, JSON.stringify(response.data));
				return response.data;
			});

			return promise;
	    },
	    getUser: function() {
	      return JSON.parse($window.localStorage.getItem(userPath));
	    },
	    getQuotes : function() {
	    	var promise = $http.get('quotes.json');
	    	promise.then(function(response) {
    			return response.data;
	    	});

	    	return promise;
	    },
	    getWeather : function(location)
	    {
	    	var promise = $http.get('http://api.openweathermap.org/data/2.5/weather?q=' + location);
	    	promise.then(function(response) {
	    		return response.data;
	    	});
	    	
	    	return promise;
	    }
	  };
	});
});