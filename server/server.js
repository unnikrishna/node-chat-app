const path = require('path');
const express = require('express');

const port = process.env.PORT || 3300;

var app = express();
var publicPath = path.join(__dirname, '../public');

app.get('/',function(req,res){
  res.sendFile(path.join(publicPath+'/index.html'));
  //__dirname : It will resolve to your project folder.
});
app.listen(port);
