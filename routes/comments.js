var express = require('express'),
    router = express.Router();

//don't forget to import the comment/camp models used in the routes below
var Camp = require('../models/campground.js'),
    Comment = require('../models/comments.js');
// ==============================
// COMMENTS ROUTES
//===============================
router.get('/campgrounds/:id/newComments', isLoggedIn, function(req, res){
  var id = req.params.id;
  Camp.findById(id, function(err, foundCamp){
    if(err){
      console.log(err);
    } else {
      res.render('newComments', {camp: foundCamp});
    }
  });
});


router.post('/campgrounds/:id/newComments', isLoggedIn, function(req, res){
  var id = req.params.id;
  var commentAuthor = req.body.commentAuthor;
  var commentText = req.body.commentText;

  Camp.findById(id, function(err, foundCamp){
    if(err){
      console.log(err);
    } else{
      Comment.create({
        text: commentText,
        author:{
            username: req.user.username,
            id: req.user._id
          }
      }, function(err, madeComment){
        if(err){
          console.log(err);
        } else{
          console.log(req.user);
          madeComment.save();
          foundCamp.comments.push(madeComment);
          foundCamp.save();
          res.redirect('/campgrounds/' + id);
        }
      });
    }
  });
});



//======EDIT COMMENTS=====
router.get('/campgrounds/:id/newComments/:comment_id/edit', checkOwnerComment, function(req, res){
  Camp.findById(req.params.id, function(err, foundCamp){
    if(err){
      console.log(err);
    } else {
      Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
          console.log(err);
        } else {
          res.render('editComments', {foundCamp : foundCamp , foundComment: foundComment});
        }
      });
    }
  });
});


//=======UPDATE COMMENT====
router.put('/campgrounds/:id/newComments/:comment_id', checkOwnerComment, function(req, res){
  var newText = req.body.commentText;
  Comment.findByIdAndUpdate(req.params.comment_id, {
    text : newText
  }, function(err, foundComment){
    if(err){
      console.log(err);
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});


router.delete('/campgrounds/:id/newComments/:comment_id/delete', function(req,res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err, success){
    if(err){
      res.redirect('/campgrounds/' + req.params.id);
    } else {
      res.redirect('/campgrounds/' + req.params.id);
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


function checkOwnerComment(req, res, next){
  // check if user is logged in
  if(req.isAuthenticated()){
    //check if comment id matches the user log in id
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
      console.log(err);
    } else {
      console.log('Comment:' + foundComment.author.id);
      if(foundComment.author.id.equals(req.user._id)){
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
