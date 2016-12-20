var express = require('express'),
    router  = express.Router(),
    Camp = require('../models/campground.js'),
    User = require('../models/user.js');

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
  console.log('User: ' + req.user);
  res.render('new');
});


//CREATE ROUTE
router.post('/campgrounds', isLoggedIn, function(req, res){
  //get data from form and add to camps database
  var campName = req.body.campName;
  var campImage = req.body.campImage;
  var campDes = req.body.campDescription;

  User.findById(req.user._id, function(err, foundUser){
    if(err){
      console.log(err);
    } else{
      Camp.create({
        name: campName,
        image: campImage,
        description: campDes,
        author:{
          id: req.user._id,
          username : req.user.username
        }
      }, function(err, result){
        if(err){
          console.log(err);
        } else {
          console.log('Another Successful Add: ' + result.name);
          res.redirect('/campgrounds');
        }
      });
    }
  })

});


//Show ROUTE - shows more info about one campround
router.get('/campgrounds/:id', function(req, res){
  //find the campground with provided id
  var id = req.params.id;

  Camp.findById(id).populate('comments').exec(function(err, foundCamp){
    res.render('show', {id: foundCamp});
  });
});


//=====EDIT CAMPGROUND======
router.get('/campgrounds/:id/edit', function(req, res){
  var id = req.params.id;
  //is user logged in?
  if(req.isAuthenticated()){
    Camp.findById(id, function(err, foundCamp){
      if(err){
        console.log(err);
      } else {
        console.log(foundCamp);
        //does the foundCamp author id match the user's id?
        //foundCamp.author.id is an ObjectId. User id is a string
        if(foundCamp.author.id.equals(req.user._id)){
          res.render('editCamp', {foundCamp: foundCamp});
        } else {
          res.send('You shall not pass!');
        }
      }
    });
  } else {
    res.redirect('/campgrounds/' + id);
  }
});


//=====UPDATE CAMPGROUND====
router.put('/campgrounds/:id', isUserCamp, function(req, res){
  var name = req.body.campName;
  var image = req.body.campImage;
  var des = req.body.campDescription;

  Camp.findByIdAndUpdate(req.params.id,
    {
      name: name,
      image: image,
      description : des
    },function(err, foundCamp){
    if(err){
      console.log(err);
    } else{
      res.redirect('/campgrounds/'+ req.params.id);
    }
  });
});

//==========DELETE CAMP=======
router.delete('/campgrounds/:id', isUserCamp, function(req, res){
  Camp.findByIdAndRemove(req.params.id, function(err, success){
    if(err){
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds');
    }
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

function isUserCamp(req, res, next){
  //is user logged in?
  if(req.isAuthenticated()){
    Camp.findById(req.params.id, function(err, foundCamp){
      if(err){
        console.log(err);
      } else{
        //if user logged in,
        //does his id match the camp's creator's id?
        if(foundCamp.author.id.equals(req.user._id)){
          //if yes to everything, do next
          next();
        } else {
          res.redirect('back');
        }
      }
    });
  } else {
    res.redirect('back');
  }
}

module.exports = router;
