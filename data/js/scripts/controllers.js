define(['angularAMD', 'storage', 'moment-src'], function (angularAMD, storage, moment) {
	var controllers = angular.module('controllers', ['services']);
	controllers.controller('DashboardCtrl', function ($scope, $interval, $http, LS, locale) {

	    var KELVIN = 273.15;

		// define variables
    	var user,
    		storageFiles,
			background,
	        date,
	        currentDate,
	        currentHour;

	    $scope.updateCache = function() {
            try {
            	storageFiles.date = currentDate;
            	storageFiles.hour = currentHour;
            	LS.setData(JSON.stringify(storageFiles));
            }
            catch (e) {
                console.log("Storage failed: " + e);
                console.log("Attempting to auto-resolve by clearing localStorage and re-initializing.");
                localStorage.clear();
                $scope.startup();
            }
	    }

		$scope.setBackground = function(forceChange) {

			var canvas = document.getElementById('background');
			canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
	        var ctx = canvas.getContext('2d');
	        var img = new Image;
	        ctx.width = img.width;
	        ctx.height = img.height;

			img.onload = function() {
				if (img.src != "")
				ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
				loaded();
	        }

	        var loaded = function() {
	        	img.src = "";
	        	img = null;
	        }

		    if (typeof storageFiles.background === "undefined"  || forceChange || LS.hasDateExpired(currentDate)) {
		        var url = "img/" + (Math.floor(Math.random() * 63) + 1) + ".jpg";
		        storageFiles.background = url;
		        $scope.updateCache();
		    }
		    
		    img.src = storageFiles.background;
		    ctx.width = img.width;
		    ctx.height = img.height;
		}

		$scope.quoteLoaded = function() {
			$scope.quote = storageFiles.quote;
		}

		$scope.setQuote = function() {

			if (typeof storageFiles.quote === "undefined" || LS.hasDateExpired(currentDate)) {
				LS.getQuotes().then(function(response) {
						storageFiles.quote = response.data.quotes[(Math.floor(Math.random() * 270) + 1)];
			            $scope.updateCache();
			            $scope.quoteLoaded();
	            });
			} else {
				$scope.quoteLoaded();
			}
		}

		$scope.weatherLoaded = function() {
    		$scope.temp = storageFiles.temp;
			$scope.loc = storageFiles.loc;
		}

		$scope.setWeather = function() {

		    if (typeof storageFiles.temp === "undefined" || storageFiles.loc != user.location || LS.hasHourExpired(currentHour)) {
	            
				LS.getWeather(user.location).then(function(response) {
						var temp = response.data.main.temp;
						storageFiles.loc = user.location;
						storageFiles.temp = (user.temperatureType == 0 ? 
											Math.round(parseInt(temp) - parseInt(KELVIN), 2) + "°C" : 
											Math.round(((parseInt(temp) - parseInt(KELVIN)) * 9/5) + 32, 2) + "°F");
						$scope.updateCache();
						$scope.weatherLoaded();
				});
		    } else {
		    	$scope.weatherLoaded();
		    }
		}
		$scope.getStateOfDay = function(hours) {
			if (hours >= 6 && hours < 12) 
			{
				return "time.morning";
			} else if (hours >= 12 && hours < 14) {
				return "time.afternoon";
			} else if (hours >= 14 && hours < 18) {
				return "time.day";
			} else if (hours >= 18 && hours < 22) {
				return "time.evening";
			} else {
				return "time.night";
			}
		}

		$scope.setDateAndTime = function() {
			locale.ready('time').then(function () {
				moment.locale(user.locale);
				$scope.name = user.name;
				$scope.daystate = locale.getString($scope.getStateOfDay(moment().get('hour')));
	            $scope.date = moment().format(user.dateformat);
            });

			$scope.clock = moment().format('HH:mm');
		}

		$scope.startup = function() {

			LS.loadUser().then(function(response) {
			  	user = response.data;
				moment.locale(user.locale);
				storageFiles = LS.getData() || {};
				background = document.getElementById("background");
				date = new Date();
		        currentDate = (date.getMonth() + 1).toString() + date.getDate().toString(),
		        currentHour = date.getHours();

				$scope.setBackground();
				$scope.setWeather();
				$scope.setQuote();
			});

			$interval(function () { 
				$scope.setDateAndTime();
			}, 1000);
		}

		$scope.startup();
	});
});