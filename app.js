var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));  //css files


app.listen(3000, function(){
  console.log('Camp Server Started');
});
