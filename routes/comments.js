var express = require('express'),
    router = express.Router();


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
