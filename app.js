var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    mongoose = require('mongoose'),
    Camp = require('./models/campground.js'),
    Comment = require('./models/comments.js'),
    seedDB = require('./seeds.js');
    app = express();



//conect to mongodb
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/campgrounds');


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));  //css files

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
      //redirect back to /campgrounds
      // res.render('campgrounds');
      res.redirect('campgrounds');
    }
  });

});


//Show ROUTE - shows more info about one campround
app.get('/campgrounds/:id', function(req, res){
  //find the campground with provided id
  var id = req.params.id;
  // Camp.findById(id, callback)
  // Camp.findById(id, function(err, foundCamp){
  //   if(err){
  //     console.log(err);
  //   } else {
  //     console.log(foundCamp);
  //     res.render('show', {id: foundCamp});
  //   }
  // });

  Camp.findById(id).populate('comments').exec(function(err, foundCamp){
    console.log('Still Trying');
    console.log(foundCamp);
    res.render('show', {id: foundCamp});
  });
});

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
        }
      });
    }
  });
  Camp.findById(id).populate('comments').exec(function(err, foundCamp){
    console.log('Still Trying');
    res.render('show', {id: foundCamp});
  });
});

app.listen(3000, function(){
  console.log('Camp Server Started');
});
