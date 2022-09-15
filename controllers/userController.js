const User = require('../models/user');


// render the user page
module.exports.user = function(req, res){
    return res.render('user', {
        title: "user"
    });
}


// render the profile page
module.exports.profile = async function(req, res){
    try {
        // find the user from params id 
        let user = await User.findById(req.params.id);
        return res.render('user_profile', {
            title: "iConnect | user | profile",
            profile_user: user
        });
    } catch (err) {
        console.log('Error', err);
        return;
    }

    // User.findById(req.params.id, function(err, user){
    //     return res.render('user_profile', {
    //         title: "iConnect | user | profile",
    //         profile_user: user
    //     });
    // });
    
}

module.exports.update = async function(req, res){
    try {
        if(req.user.id == req.params.id){
            await User.findByIdAndUpdate(req.params.id, req.body);
            return res.redirect('back');
            // User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
            //     return res.redirect('back');
            // });
        }else{
            return res.status(401).send('Unauthorized!!');
        }
    } catch (err) {
        console.log('Error', err);
        return;
    }
}


// render the sign-in page
module.exports.sign_in = function(req, res){
    // if the user is already signed in
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    // if the user is not signed in
    return res.render('user_sign_in', {
        title: "sign-in"
    });
}


// render the sign-up page
module.exports.sign_up = function(req, res){
    // if the user is already signed in
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    // if the user is not signed in
    return res.render('user_sign_up', {
        title: "sign-up"
    });
}


// controller for creating a user
module.exports.create_user = async function(req, res){
    try {
        // if both the password doesn't match
        if(req.body.password != req.body.confirm_password){
            return res.redirect('back');
        }

        // find the user with the provided email
        let user = await User.findOne({email: req.body.email});
        // if the user doesn't exist then creat that user
        if(!user){
            let user = await User.create(req.body);
            return res.redirect('/users/sign-in');
        // if the user exist then we simply redirect back
        }else{
            return res.redirect('back');
        }

    } catch (err) {
        console.log('Error', err);
        return;
    }
    // User.findOne({email: req.body.email}, (err, user) => {
    //     if(err){
    //         console.log("Error in finding the user in signing up");
    //         return;
    //     }

    //     // if the user doesn't exist then creat that user
    //     if(!user){
    //         User.create(req.body, (err) => {
    //             if(err){
    //                 console.log("Error in creating the user in signing up");
    //                 return res.redirect('back');
    //             }
    //             return res.redirect('/users/sign-in');
    //         });

    //         // if the user exist then we simply redirect back
    //     }else{
    //         return res.redirect('back');
    //     }
    // });
}

// controller for creating a session that is sign in
module.exports.create_session = function(req, res){
    // sending the flash messages to the req
    req.flash('success', 'Logged in Successfully!');
    return res.redirect('/');
}

// sign out controller
module.exports.destroySession = async function(req, res){
    try {
        // inbuilt function for logout provided by passport
        req.logout((err) => {
            if(err){
                console.log("Error in logging out");
                return;
            }
            // sending the flash messages to the req
            req.flash('success', 'You have Logged Out!');
            return res.redirect('/');
        });
    } catch (err) {
        console.log('Error', err);
        return;
    }
    // inbuilt function for logout provided by passport
    // if(req.isAuthenticated()){
    //     req.logout(function(err){
    //         if(err){
    //             console.log("Error in logging out");
    //             return;
    //         }
    //     });
    //     return res.redirect('/');
    // }else{
    //     return res.redirect('/');
    // }
    
}




