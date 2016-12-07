var express = require('express'),
    router  = express.Router(),
    Camp = require('../models/campground.js');

//change all the app.get/app.post to router.get/router.post

//Index ROUTE
router.get('/', function(req, res){
  res.render('landing');
});

//Index ROUTE
router.get('/campgrounds', function(req, res){
  //campgrounds will be in a database. This will get passed to a view
  //get all campgrounds from db
  Camp.find({}, function(err, camps){
    if(err){
      console.log(err);
    } else {
      res.render('index', { camps : camps});
    }
  });
});


//NEW ROUTE
//page that has a form to send data to the post route above
router.get('/campgrounds/new', isLoggedIn, function(req, res){
  res.render('new');
});


//CREATE ROUTE
router.post('/campgrounds', isLoggedIn, function(req, res){
  //get data from form and add to camps database
  var campName = req.body.campName;
  var campImage = req.body.campImage;
  var campDes = req.body.campDescription;

  Camp.create({
    name: campName,
    image: campImage,
    description: campDes
  }, function(err, result){
    if(err){
      console.log(err);
    } else {
      console.log('Another Successful Add: ' + result.name);
      res.redirect('/campgrounds');
    }
  });

});


//Show ROUTE - shows more info about one campround
router.get('/campgrounds/:id', function(req, res){
  //find the campground with provided id
  var id = req.params.id;

  Camp.findById(id).populate('comments').exec(function(err, foundCamp){
    res.render('show', {id: foundCamp});
  });
});

//check if user is logged in
function isLoggedIn(req, res, next){
  //if user is logged in, continue to the next function
  if(req.isAuthenticated()){
    return next();
  } else {
    res.render('login');
  }
}


module.exports = router;
