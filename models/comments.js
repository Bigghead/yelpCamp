var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
  text: String,
  author : {
    username : String,
    id:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
