var mongoose = require('mongoose'),
    Camp = require('./models/campground.js'),
    Comment = require('./models/comments.js');

var data = [
  {
    name: 'Cloud\'s Rest',
    image: 'http://www.photosforclass.com/download/7121865553',
    description: 'Good place, even if sober'
  },
  {
    name: "Sauron's Palace",
    image: 'http://www.photosforclass.com/download/1430198323',
    description: 'Where LOTR was filmed'
  },{
    name: 'Sky Hook',
    image: 'http://www.photosforclass.com/download/3694344957',
    description: 'Almost no bears'
  }
]

//wipe everything from DB
function seedDB(){
  //remove all campgrounds
  Camp.remove({}, function(err){
    if(err){
      console.log(err);
    } else {
      console.log('Removed All Camps');
      data.forEach(function(camp){
        //add camp in DB
        Camp.create(camp, function(err, result){
          if(err){
            console.log(err)
          } else {
            console.log('Successful Add: '+ camp.name);
            //add comment in DB
            Comment.create({
              text: 'Who ate all the doughnuts?',
              author: 'Homer'
            }, function(err, result){
              if(err){
                console.log(err);
              } else {
                //then push each made comment into each looped camp
                camp.comments.push(result);
                console.log('Added a comment from '+ result.author);
                camp.save();
              }
            });
          }
        });
      });
    }
  })
}

module.exports = seedDB;
