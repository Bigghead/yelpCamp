var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));  //css files

//Home Page
app.get('/', function(req, res){
  res.render('landing');
});

//Show All Campgrounds
app.get('/campgrounds', function(req, res){
  //campgrounds will be in a database. This will get passed to a view
  var campgrounds = [
    {name: 'Salmon Creek', image: 'https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg'},
    {name: 'Granite Hill', image: 'http://www.photosforclass.com/download/4369518024'},
    {name: 'Salmon Creek', image: 'http://www.photosforclass.com/download/4684194306'}
  ];
  res.render('campgrounds', {camps : campgrounds});
});

app.listen(3000, function(){
  console.log('Camp Server Started');
});
