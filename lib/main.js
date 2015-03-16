var preferences = require('sdk/preferences/service');
var self = require('sdk/self');
var tabs = require('sdk/tabs');

// Set browser startup and new tab preferences
preferences.set('browser.newtab.url', self.data.url('./index.html'));
preferences.set('browser.startup.homepage', self.data.url('./index.html'));
preferences.set('startup.override_homepage_url', '');

// Does not yet work
// tabs.on('ready', function(tab) {
//     if (tab.url === self.data.url('./index.html')) {
//         tab.url = '';
//     }
// });
