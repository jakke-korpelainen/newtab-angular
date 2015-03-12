define(['angularAMD', 'storage'], function (angularAMD) {
	var controllers = angular.module('controllers', ['services']);
	controllers.controller('DashboardCtrl', function ($scope, $interval, $http, LS, locale) {

		LS.loadUser();
		
		// localStorage with image
    	var user = LS.getUser(),
    		storageFiles = LS.getData() || {},
			background = document.getElementById("background")
	        date = new Date(),
	        currentDate = (date.getMonth() + 1).toString() + date.getDate().toString(),
	        currentHour = date.getHours();

		$scope.setBackground = function() {

		    // Compare date and create localStorage if it's not existing/too old   
		    if (LS.hasDateExpired()) {
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

		            // Set date for localStorage
		            storageFiles.date = currentDate;

		            // Save as JSON in localStorage
		            try {
		            	LS.setData(JSON.stringify(storageFiles));
		            }
		            catch (e) {
		                console.log("Storage failed: " + e);             
		            }
		        }, false);

		        // Set initial image src
		        background.setAttribute("src", "img/" + (Math.floor(Math.random() * 63) + 1) + ".jpg");

		        // Set initial quote
				$http.get('quotes.json')
					.success(function(data, status, headers, config) {
						var quote = data.quotes[(Math.floor(Math.random() * 270) + 1)];
						storageFiles.quote = quote;
						$scope.quote = quote;

			            try {
			            	LS.setData(JSON.stringify(storageFiles));
			            }
			            catch (e) {
			                console.log("Storage failed: " + e);                
			            }
					})
					.error(function(data, status, headers, config) {
						$scope.quote = { body : 'Virhe', source : 'ei löytynyt' };
					});
		    }
		    else {
		        // Use image from localStorage
		        background.setAttribute("src", storageFiles.background);

		        // Use quote from localStorage
		        $scope.quote = storageFiles.quote;
		    }
		}

		$scope.setWeather = function() {

			$scope.loc = user.location;

		    // Hourly expiring temperature values in localStorage
		    if (LS.hasHourExpired()) {
	            storageFiles.hour = currentHour;
	            
				$http.get('http://api.openweathermap.org/data/2.5/weather?q=' + user.location)
					.success(function(data, status, headers, config) {
						var temp;
						if (user.temperatureType == 0)
						{
							// celsius
							temp = Math.round(parseInt(data.main.temp) - 273.15, 2) + "°C";
						} else { 
							// fahrenheit
							temp = Math.round(((parseInt(data.main.temp) - 273.15) * 9/5) + 32, 2) + "°F";
						}
						storageFiles.temp = temp;
						$scope.temp = temp;

			            try {
			            	LS.setData(JSON.stringify(storageFiles));
			            }
			            catch (e) {
			                console.log("Storage failed: " + e);                
			            }
					})
					.error(function(data, status, headers, config) {
						$scope.temp = "NaN";
					});
		    }
		    else {
	    		$scope.temp = storageFiles.temp;
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
				$scope.desc = 
					locale.getString('time.good') + ' ' +
	            	locale.getString($scope.getStateOfDay(moment().get('hour'))) + ' ' +
	            	user.name + ', ' +
	            	locale.getString('time.today') + ' ' +
	            	locale.getString('time.is') + ' ' + moment().format('dddd DD.MM.YYYY');
            });

			$scope.clock = moment().format('HH:mm');
		}

		$scope.startup = function() {
			moment.locale(user.locale);

			$scope.setBackground();
			$scope.setWeather();

			$interval(function () { 
				$scope.setDateAndTime();
			}, 1000);
		}

		$scope.startup();
	});
});