var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    mongoose = require('mongoose'),
    Camp = require('./models/campground.js'),
    Comment = require('./models/comments.js'),
    User = require('./models/user.js'),
    seedDB = require('./seeds.js'),
    passport = require('passport'),
    localStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    Session = require('express-session'),
    app = express();



//conect to mongodb
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/campgrounds');
//seedDB();


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));  //css files

//setup passport underneath body/cookie Parser
app.use(Session({
  secret: 'This is Sparta Again',
  resave :false,
  saveUninitialized: false
}));

//tell Express to use Passport
app.use(passport.initialize());
app.use(passport.session());

//passport checks for login later
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Index ROUTE
app.get('/', function(req, res){
  res.render('landing');
});

//Index ROUTE
app.get('/campgrounds', function(req, res){
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
app.get('/campgrounds/new', function(req, res){
  res.render('new');
});


//CREATE ROUTE
app.post('/campgrounds', function(req, res){
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
app.get('/campgrounds/:id', function(req, res){
  //find the campground with provided id
  var id = req.params.id;

  Camp.findById(id).populate('comments').exec(function(err, foundCamp){
    res.render('show', {id: foundCamp});
  });
});


// ==============================
// COMMENTS ROUTES
//===============================
app.get('/campgrounds/:id/newComments', function(req, res){
  var id = req.params.id;
  res.render('newComments', {id: id});
});


app.post('/campgrounds/:id/newComments', function(req, res){
  var id = req.params.id;
  var commentAuthor = req.body.commentAuthor;
  var commentText = req.body.commentText;

  Camp.findById(id, function(err, foundCamp){
    if(err){
      console.log(err);
    } else{
      Comment.create({
        text: commentText,
        author: commentAuthor
      }, function(err, madeComment){
        if(err){
          console.log(err);
        } else{
          console.log(foundCamp);
          foundCamp.comments.push(madeComment);
          foundCamp.save();
          res.redirect('/campgrounds/' + id);
        }
      });
    }
  });
});


//================REGISTRATION ROUTE==========
app.get('/register', function(req, res){
  res.render('register');
});

app.post('/register', function(req, res){
  var username = req.body.username;
  var password = req.body.password;

  User.register(new User({username: username}), password, function(err, success){
    if(err){
      console.log(err);
      //go back to register form
      res.render('register');
    } else {
      //use passport to authenticate, register new user, and redirect somewhere
      passport.authenticate('local')(req, res, function(){
        res.redirect('/campgrounds');
      });
    }
  });
});


//============LOGOUT=======
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/campgrounds');
});

app.listen(3000, function(){
  console.log('Camp Server Started');
});
