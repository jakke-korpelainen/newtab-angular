require.config({

    baseUrl: "js/scripts",
    
    paths: {
        'angular': '../lib/angular.min',
        'angular-route': '../lib/angular-route.min',
        'angularAMD': '../lib/angularAMD.min',
        'moment': '../lib/moment-with-locales.min',
        'controllers' : 'controllers'
    },

    shim: {
        'angularAMD': ['angular'],
        'angular-route': ['angular']
    },

    deps: ['app']
});