DEMO: http://jakke-korpelainen.github.io/newtab-angular/#/

#Briefly
Developed for personal use after changing from chrome to firefox.
Inspired by Momentum addon for Google Chrome.

Images and quotes loaned from the Momentum-addon for Chrome in addition with a few images I've handpicked from various open licence stock photo providers.
At the time being this works by referencing the site from filesystem or you may host this into a local/external httpserver. I recommend to use this with Custom New Tab -addin that supports preloading the app, placing focus into URL bar and making it empty.
https://addons.mozilla.org/en/firefox/addon/custom-new-tab/

#Customization
Basic level customization is available by modifying the user.json;
```javascript
{
	"locale" : "en",
	"name" : "Your Name",
	"location" : "Helsinki",
	"temperatureType" : 0,
	"dateformat" : "dddd DD.MM.YYYY"
}
```
* locale is for localizing the datetime.
* name which to greet
* location is the name of the city you want forecast
* temperatureType
   * 0 : Celsius 
   * 1 : Fahrenheit
* dateformat, see [moment.js docs](http://momentjs.com/docs/#/displaying/) for help

#Features/Tech
Daily changing background, quote and a forecast from [OpenWeatherMap](http://openweathermap.org/api), data is cached to html5 localStorage and expires daily/hourly (forecast).
There is no setup so feel free to tweak around to make it suitable for your needs. The "app" is powered by [AngularJs](https://angularjs.org/), [RequireJs](http://requirejs.org/) and [moment.js](http://momentjs.com/) (datetime localization). If you get tired of a background you can double click it to get a new one.

#Screenshots
![1](http://i.imgur.com/BvVhERO.jpg "Screenshot 1")
![2](http://i.imgur.com/fqLBsDq.jpg "Screenshot 2")
