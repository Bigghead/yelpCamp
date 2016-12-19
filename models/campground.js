var mongoose = require('mongoose');

//set a pattern for new data
var campSchema = new mongoose.Schema({
  name: String,
  image : String,

  //just added
  description: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  author:{
    id:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  }
});

//make a new collection called 'camps' in the DB
var Camp = mongoose.model('Camp', campSchema);

module.exports = Camp;
