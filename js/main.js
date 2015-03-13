require.config({
    noGlobal : true,
    paths : {
        'moment-src': '../lib/moment-with-locales.min',
    }
});

require.config({

    baseUrl: "js/scripts",
    
    paths: {
        'angular': '../lib/angular.min',
        'angular-route': '../lib/angular-route.min',
        'angular-cookies': '../lib/angular-cookies.min',
        'angular-sanitize': '../lib/angular-sanitize.min',
        'angular-localization': '../lib/angular-localization.min',
        'angularAMD': '../lib/angularAMD.min',
        'storage' : 'storage',
        'controllers' : 'controllers'
    },

    shim: {
        'angularAMD': ['angular'],
        'angular-route': ['angular'],
        'angular-cookies': ['angular'],
        'angular-sanitize': ['angular'],
        'angular-localization': ['angular']
    },

    deps: ['app']
});