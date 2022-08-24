const bodyParser = require('body-parser');
const express = require('express');
const cookieParser = require('cookie-parser');
// const ejs = require('ejs');
const path = require('path');
const port = 8000;
const expressLayouts = require('express-ejs-layouts');

// setting up the connection with the database
const db = require('./config/databaseConnection');

// creating app of express
const app = express();

// for parsing the cookie
app.use(cookieParser());
// for parsing the data which comes from browser
app.use(bodyParser.urlencoded({extended: false}));

// using static files
app.use(express.static('./assets'));

// telling app to use expressLayouts
app.use(expressLayouts);

// extract styles and scripts from sub pages and include it in layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// any request from browser for '/' sent to routes folder
app.use('/', require('./routes'));


// setting up the views for ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));  // OR app.set('views', './views');






app.listen(process.env.PORT || port, function(err){
    if(err){
        console.log("Error in listening on port ", port);
        return;
    }
    console.log("Express server is running on the port ", port);
    return;
});