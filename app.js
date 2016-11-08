var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    mongoose = require('mongoose');
    app = express();

//conect to mongodb
mongoose.connect('mongodb://localhost/campgrounds');

//set a pattern for new data
var campSchema = new mongoose.Schema({
  name: String,
  image ; String
});

//make a new collection called 'campgrounds' in the DB
var Camp = mongoose.model('Campground', campSchema);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));  //css files

var campgrounds = [
  {name: 'Salmon Creek', image: 'https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg'},
  {name: 'Granite Hill', image: 'http://www.photosforclass.com/download/4369518024'},
  {name: 'Salmon Creek', image: 'http://www.photosforclass.com/download/4684194306'}
];

//Home Page
app.get('/', function(req, res){
  res.render('landing');
});

//Show All Campgrounds
app.get('/campgrounds', function(req, res){
  //campgrounds will be in a database. This will get passed to a view
  res.render('campgrounds', {camps : campgrounds});
});

//add new campground
app.post('/campgrounds', function(req, res){
  //get data from form and add to camps database
  var campName = req.body.campName;
  var campImage = req.body.campImage;
  var newCampGround = {name: campName, image: campImage};
  campgrounds.push(newCampGround);
  //redirect back to /campgrounds
  // res.render('campgrounds');
  res.redirect('campgrounds');
});

//page that has a form to send data to the post route above
app.get('/campgrounds/new', function(req, res){
  res.render('new');
});

app.listen(3000, function(){
  console.log('Camp Server Started');
});
