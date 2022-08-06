const express = require('express');
const ejs = require('ejs');
const path = require('path');
const port = 8000;

// creating app of express
const app = express();

// any request from browser for '/' sent to routes folder
app.use('/', require('./routes'));


// setting up the views for ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));






app.listen(process.env.PORT || port, function(err){
    if(err){
        console.log("Error in listening on port ", port);
        return;
    }
    console.log("Express server is running on the port ", port);
    return;
});