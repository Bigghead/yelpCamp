var mongoose = require('mongoose'),
Camp = require('./models/campground.js');

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
    }
  });
  data.forEach(function(camp){
    Camp.create(camp, function(err, result){
      if(err){
        console.log(err)
      } else {
        console.log('Successful Add: '+ camp.name);
      }
    });
  })
  //add starter data
  //campgrounds
}

module.exports = seedDB;
