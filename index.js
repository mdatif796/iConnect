const bodyParser = require('body-parser');
const express = require('express');
const cookieParser = require('cookie-parser');
// const ejs = require('ejs');
const path = require('path');
const port = 8000;
const expressLayouts = require('express-ejs-layouts');

// setting up the connection with the database
const db = require('./config/databaseConnection');

// passport authentication
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const session = require('express-session');

// creating app of express
const app = express();

// for parsing the data which comes from browser
app.use(bodyParser.urlencoded({extended: false}));
// for parsing the cookie
app.use(cookieParser());

// using static files
app.use(express.static('./assets'));

// telling app to use expressLayouts
app.use(expressLayouts);

// extract styles and scripts from sub pages and include it in layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);




// setting up the views for ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));  // OR app.set('views', './views');

app.use(session({
    name: 'iConnect',
    secret: 'jaihind',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// any request from browser for '/' sent to routes folder
app.use('/', require('./routes'));






app.listen(process.env.PORT || port, function(err){
    if(err){
        console.log("Error in listening on port ", port);
        return;
    }
    console.log("Express server is running on the port ", port);
    return;
});