DEMO: http://jakke-korpelainen.github.io/newtab/#/

#Briefly
Developed for personal use after changing from chrome to firefox.
Inspired by Momentum addon for Google Chrome.

Images and quotes loaned from the Momentum-addon for Chrome in addition with a few images I've handpicked from various open licence stock photo providers.
At the time being this works by referencing the site from filesystem or you may host this into a local/external httpserver. I recommend to use this with Custom New Tab -addin that supports preloading the app, placing focus into URL bar and making it empty.
https://addons.mozilla.org/en/firefox/addon/custom-new-tab/

#Customization
Basic level customization is available by modifying the user.json, temperatureType 0 : Celcius 1 : Fahrenheit, location is the name of the city you want forecast for and locale is for localizing the datetime.

#Features/Tech
Daily changing background, quote and a forecast (openweathermap.org/api), data is cached to html5 localStorage and expires daily/hourly (forecast).
There is no setup so feel free to tweak around to make it suitable for your needs. The "app" is powered by [AngularJs](https://angularjs.org/), [RequireJs](http://requirejs.org/) and [moment.js](http://momentjs.com/) (datetime localization).

#Screenshots
![1](http://i.imgur.com/BvVhERO.jpg "Screenshot 1")
![2](http://i.imgur.com/fqLBsDq.jpg "Screenshot 2")
