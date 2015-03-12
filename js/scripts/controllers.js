define(['angularAMD'], function (angularAMD) {
	var controllers = angular.module('controllers', []);
	controllers.controller('DashboardCtrl', function ($scope, $interval, $http) {

		// localStorage with image
    	var storageFiles = JSON.parse(localStorage.getItem("storageFiles")) || {},
			background = document.getElementById("background"),
	        storageFilesDate = storageFiles.date,
	        storageFilesHour = storageFiles.hour,
	        date = new Date(),
	        todaysDate = (date.getMonth() + 1).toString() + date.getDate().toString(),
	        currentHour = date.getHours();

	    // Compare date and create localStorage if it's not existing/too old   
	    if (typeof storageFilesDate === "undefined" || storageFilesDate < todaysDate) {
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
	            storageFiles.date = todaysDate;

	            // Save as JSON in localStorage
	            try {
	                localStorage.setItem("storageFiles", JSON.stringify(storageFiles));
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
	                	localStorage.setItem("storageFiles", JSON.stringify(storageFiles));
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

	    // Hourly expiring temperature values in localStorage
	    if (typeof storageFilesHour === "undefined" || storageFilesHour < currentHour) {
            storageFiles.hour = currentHour;
            
			$http.get('http://api.openweathermap.org/data/2.5/weather?q=Helsinki&lang=fi')
				.success(function(data, status, headers, config) {
					var temp = Math.round(parseInt(data.main.temp) - 273.15, 2) + "°C";
					storageFiles.temp = temp;
					$scope.temp = temp;

		            try {
	                	localStorage.setItem("storageFiles", JSON.stringify(storageFiles));
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

		$scope.getStateOfDay = function(hours)
		{
			if (hours >= 6 && hours < 12) 
			{
				return "morning";
			} else if (hours >= 12 && hours < 14) {
				return "afternoon";
			} else if (hours >= 14 && hours < 18) {
				return "day";
			} else if (hours >= 18 && hours < 22) {
				return "evening";
			} else {
				return "night";
			}
		}

		$scope.text = "Good " + $scope.getStateOfDay(moment().get('hour')) + ", today is " + moment().format('dddd DD.MM.YYYY') + ".";
		$scope.clock = moment().format('HH:mm');
		$interval(function () { 
			var hours = moment().get('hour');
			$scope.text = "Good " + $scope.getStateOfDay(hours) + ", today is " + moment().format('dddd DD.MM.YYYY') + ".";
			$scope.clock = moment().format('HH:mm');
		}, 1000);
	});
});