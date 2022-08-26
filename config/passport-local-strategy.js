const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;


const User = require('../models/user');


// using passport middleware
passport.use(new LocalStrategy({
        usernameField: "email"
    },
    function(email, password, done){
        // find the user using this email passed
        User.findOne({email: email}, function(err, user){
            // if error finds
            if(err){
                console.log("Error in finding the user --> passport");
                return done(err);
            }

            // if user not found or password doesn't match
            if(!user || user.password != password){
                console.log("Invalid username/password");
                // report to the passport that user doesn't exist
                return done(null, false);
            }

            // if user found
            if(user){
                // report back to the passport that user exist and sends that user to passport
                return done(null, user);
            }

        });
    }
));

// serializing the user to kept user id as a key in cookies
passport.serializeUser(function(user, done){
    return done(null, user.id);
});

// deserializing the user to find the user using that key in the cookies
passport.deserializeUser(function(id, done){
    // find the user using that id present in the cookies
    User.findById(id, function(err, user){
        if(err){
            console.log("Error in finding the user --> deserializing user");
            return done(err);
        }

        // if the user found then pass that user to the passport
        return done(null, user);
    });
});

module.exports = passport;