var mongoose = require('mongoose'),
    Comment = require('./models/comments.js'),
    Camp = require('./models/campground.js');


var data = [
  {
    name: 'Cloud\'s Rest',
    image: 'http://www.photosforclass.com/download/7121865553',
    description: 'Bacon ipsum dolor amet prosciutto beef cupim kielbasa. Frankfurter t-bone jerky flank. Ground round pig brisket shankle porchetta venison t-bone filet mignon jerky chuck flank ham hock drumstick spare ribs short ribs. Shoulder kevin biltong, meatloaf brisket short loin pork loin capicola ground round turducken. Picanha tail doner corned beef bacon turducken swine alcatra frankfurter pork loin shoulder pork belly jowl pork chop flank. ',
    comments : []
  },
  {
    name: "Sauron's Palace",
    image: 'http://www.photosforclass.com/download/1430198323',
    description: 'Bacon ipsum dolor amet prosciutto beef cupim kielbasa. Frankfurter t-bone jerky flank. Ground round pig brisket shankle porchetta venison t-bone filet mignon jerky chuck flank ham hock drumstick spare ribs short ribs. Shoulder kevin biltong, meatloaf brisket short loin pork loin capicola ground round turducken. Picanha tail doner corned beef bacon turducken swine alcatra frankfurter pork loin shoulder pork belly jowl pork chop flank. ',
    comments : []
  },{
    name: 'Sky Hook',
    image: 'http://www.photosforclass.com/download/3694344957',
    description: 'Bacon ipsum dolor amet prosciutto beef cupim kielbasa. Frankfurter t-bone jerky flank. Ground round pig brisket shankle porchetta venison t-bone filet mignon jerky chuck flank ham hock drumstick spare ribs short ribs. Shoulder kevin biltong, meatloaf brisket short loin pork loin capicola ground round turducken. Picanha tail doner corned beef bacon turducken swine alcatra frankfurter pork loin shoulder pork belly jowl pork chop flank. ',
    comments : []
  }
];

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
        Camp.create(camp, function(err, madeCamp){
          if(err){
            console.log(err)
          } else {
            console.log('Successful Add: '+ camp.name);
            //add comment in DB
            Comment.create({
              text: 'Who ate all the doughnuts?',
              author: 'Homer'
            }, function(err, madeComment){
              if(err){
                console.log(err);
              } else {
                //then push each made comment into each looped camp
                madeCamp.comments.push(madeComment);
                console.log('Added a comment from '+ madeComment.author);
                madeCamp.save();
              }
            });
          }
        });
      });
    }
  })
}

module.exports = seedDB;
