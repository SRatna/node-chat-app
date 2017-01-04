const express = require('express');
const path = require('path');

var publicPath = path.join(__dirname,'../public');

var app = express();
app.use(express.static(publicPath));

const port = process.env.PORT || 3000;

app.listen(port,((err)=>{
  if(!err)console.log('sever is up and running......');
}));
