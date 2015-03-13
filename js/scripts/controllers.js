define(['angularAMD', 'storage', 'moment-src'], function (angularAMD, storage, moment) {
	var controllers = angular.module('controllers', ['services']);
	controllers.controller('DashboardCtrl', function ($scope, $interval, $http, LS, locale) {

		// define variables
    	var user,
    		storageFiles,
			background,
	        date,
	        currentDate,
	        currentHour;

	    var KELVIN = 273.15;

	    $scope.updateCache = function() {
            try {
            	storageFiles.date = currentDate;
            	storageFiles.hour = currentHour;
            	LS.setData(JSON.stringify(storageFiles));
            }
            catch (e) {
                console.log("Storage failed: " + e);
                console.log("Attempting to resolve");
                localStorage.clear();
                $scope.startup();
            }
	    }

		$scope.setBackground = function() {

		    if (LS.hasDateExpired(currentDate)) {
		        // Take action when the image has loaded
		        background.addEventListener("load", function () {
		            var imgCanvas = document.createElement("canvas"),
		                imgContext = imgCanvas.getContext("2d");

		            // Make sure canvas is as big as the picture
		            imgCanvas.width = background.width;
		            imgCanvas.height = background.height;

		            // Draw image into canvas element
		            imgContext.drawImage(background, 0, 0, background.width, background.height);

		            // Save image as a data URL
		            storageFiles.background = imgCanvas.toDataURL("image/png");

		            $scope.updateCache();

		        }, false);

		        // Set initial image src
		        background.setAttribute("src", "img/" + (Math.floor(Math.random() * 63) + 1) + ".jpg");
		    }
		    else {
		        // Use image from localStorage
		        background.setAttribute("src", storageFiles.background);
		    }
		}

		$scope.setQuote = function() {
			if (LS.hasDateExpired(currentDate)) {

				LS.getQuotes().then(function(response) {
						storageFiles.quote = response.data.quotes[(Math.floor(Math.random() * 270) + 1)];
			            $scope.updateCache();
	            });
			}

			$scope.quote = storageFiles.quote;
		}

		$scope.setWeather = function() {

		    // Check hourly for a new forecast
		    if (LS.hasHourExpired(currentHour) || $scope.loc != user.location) {
	            
				LS.getWeather(user.location).then(function(response) {
						var temp = response.data.main.temp;
						storageFiles.temp = (user.temperatureType == 0 ? 
											Math.round(parseInt(temp) - parseInt(KELVIN), 2) + "°C" : 
											Math.round(((parseInt(temp) - parseInt(KELVIN)) * 9/5) + 32, 2) + "°F");
						$scope.updateCache();
				});
		    }

    		$scope.temp = storageFiles.temp;
			$scope.loc = user.location;
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