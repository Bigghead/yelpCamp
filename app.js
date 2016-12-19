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
    flash = require('connect-flash'),
    method = require('method-override'),
    app = express();

//route imports
var campRoute = require('./routes/campgrounds.js'),
    commentRoute = require('./routes/comments.js'),
    authRoute = require('./routes/authentication.js');

//conect to mongodb
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/campgrounds');
//seedDB();


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));  //css files
app.use(method("_method"));

//setup passport underneath body/cookie Parser
app.use(Session({
  secret: 'This is Sparta Again',
  resave :false,
  saveUninitialized: false
}));

//tell Express to use Passport
app.use(passport.initialize());
app.use(passport.session());


//pass in a req.user object into our header.ejs file
//middlewares run on every route. This will be available on every route
app.use(function(req, res, next){
  //res.locals is an object passed into our view engine
  //currentUser is the req.user object
  res.locals.currentUser = req.user;
  //{currentUser: req.user} will be passed into every ejs file
  //currentUser will be global, so no need to use <% %>
  next();
});

//======Routes========
app.use(campRoute);
app.use(commentRoute);
app.use(authRoute);

app.use(flash());

//passport checks for login later
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.listen(3000, function(){
  console.log('Camp Server Started');
});
