var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    mongoose = require('mongoose');
    app = express();

//conect to mongodb
mongoose.connect('mongodb://localhost/campgrounds');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));  //css files


//set a pattern for new data
var campSchema = new mongoose.Schema({
  name: String,
  image : String,

  //just added
  description: String
});

//make a new collection called 'campgrounds' in the DB
var Camp = mongoose.model('Camp', campSchema);

// Camp.create({
//   name: 'Granite Hill',
//   image: 'http://www.photosforclass.com/download/2770447094',
//   description: 'This is a huge Granite Hill. No bathrooms, no running water. Beautiful though'
// }, function(err, result){
//   if(err){
//     console.log(err);
//   } else {
//     console.log('Added ' + result.name);
//   }
// });


//Home Page
app.get('/', function(req, res){
  res.render('landing');
});

//Show All Campgrounds
app.get('/campgrounds', function(req, res){
  //campgrounds will be in a database. This will get passed to a view

  //get all campgrounds from db
  Camp.find({}, function(err, camps){
    if(err){
      console.log(err);
    } else {
      res.render('campgrounds', { camps : camps});
    }
  });
});

//add new campground
app.post('/campgrounds', function(req, res){
  //get data from form and add to camps database
  var campName = req.body.campName;
  var campImage = req.body.campImage;

  Camp.create({
    name: campName,
    image: campImage
  }, function(err, result){
    if(err){
      console.log(err);
    } else {
      console.log('Another Successful Add: ' + result.name);
      //redirect back to /campgrounds
      // res.render('campgrounds');
      res.redirect('campgrounds');
    }
  });

});

//page that has a form to send data to the post route above
app.get('/campgrounds/new', function(req, res){
  res.render('new');
});


//Show ROUTE
app.get('/campgrounds/:id', function(req, res){
  //find the campground with provided id
  //render show template with that campground
  var name = req.params.id;
  res.send('This will be the show page for ' + name);
});

app.listen(3000, function(){
  console.log('Camp Server Started');
});
