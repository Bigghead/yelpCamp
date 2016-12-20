var express = require('express'),
    router  = express.Router(),
    passport = require('passport'),
    localStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    User = require('../models/user.js');


//================REGISTRATION ROUTE==========
router.get('/register', function(req, res){
  res.render('register');
});

router.post('/register', function(req, res){
  var username = req.body.username;
  var password = req.body.password;

  User.register(new User({username: username}), password, function(err, success){
    if(err){
      console.log(err);
      console.log(err.message);
      //go back to register form
      return res.render('register');
    }
      //use passport to authenticate, register new user, and redirect somewhere
      passport.authenticate('local')(req, res, function(){
        res.redirect('/campgrounds');
      });
  });
});


//=============LOGIN ROUTE===========
router.get('/login', function(req, res){
  res.render('login');
});

//.post(url, passport.authenticate('local', {redirects}), callback);
router.post('/login', passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureRedirect: '/login'
}) ,function(){

});

//============LOGOUT=======
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/campgrounds');
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
