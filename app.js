var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var ForecastIo = require("forecastio");
var zipdb = require("zippity-do-dah");
//var ForecastIo = require("forecastio");
var app = express();
var pathStatic = path.resolve(__dirname,"public");
var pathViews = path.resolve(__dirname,"views");

app.set("views",pathViews);
app.set("view engine","ejs");

app.use(bodyParser.json());
app.use(bodyParser({urlencoded:true}));
app.use(express.static(pathStatic));

//API FORECAST.io
var weather = new ForecastIo("a305c489471cd484585d0d5f74585e6c");

//RUTAS
app.get('/',function(req,res){
  res.render("index");
});
app.post('/geo',function(req,res,next){
  console.log('Latitud '+ req.body.lat);
  console.log('Longitud '+ req.body.long);
  var latitude = req.body.lat;
  var longitude = req.body.long;
  weather.forecast(latitude, longitude, function(err, data) {
    if (err) {
      next();
      return;
    }
    //convertir a celsius
    var ft = data.currently.temperature;
    console.log('temperatura farenheit '+ft);
    var celsius = parseFloat((ft - 32) * (5/9));
    res.render("geo",{
      'lat': req.body.lat,
      'long':req.body.long,
      'temp': celsius
    });
  });

});
app.use(function(req,res){
  res.status(404).render("404");
});

app.listen(3000);
