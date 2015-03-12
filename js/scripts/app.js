define(['angularAMD', 'angular-route', 'moment', 'controllers'], function (angularAMD) {
	moment.locale('en');
    var app = angular.module("newtab", ['ngRoute', 'controllers']);
    app.config(['$routeProvider', function($routeProvider) {
    	$routeProvider.
    	when('/', {
    		templateUrl : 'js/scripts/view/dashboard.html',
    		controller : 'DashboardCtrl'
    	}).
    	otherwise({
    		redirectTo : '/'
    	});
    }]);

    var cssPaths = [
    	"css/normalize.min.css",
    	"css/app.css",
    	"css/fonts.css",
    	"css/typography.css",
    	"css/font-awesome.min.css"
    ]

    angular.forEach(cssPaths, function(value) {
		loadCss(value);
    });

    return angularAMD.bootstrap(app);

    function loadCss(url) {
	    var link = document.createElement("link");
	    link.type = "text/css";
	    link.rel = "stylesheet";
	    link.href = url;
	    document.getElementsByTagName("head")[0].appendChild(link);
	}
});