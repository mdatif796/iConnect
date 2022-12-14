const User = require('../models/user');
const Token = require('../models/token');
const crypto = require('crypto');
const fs = require('fs');  // fs is used to remove the file name also when we update the new avatar
const path = require('path');
const queue = require('../config/kue');
const forgetPasswordMailer = require('../workers/forgetPassword_emails_worker');


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
        req.flash('error', err);
        return res.redirect('/');
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
            // await User.findByIdAndUpdate(req.params.id, req.body);
            // req.flash('success', 'User Updated Successfully!');
            // return res.redirect('back');
            // User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
            //     return res.redirect('back');
            // });

            let user = await User.findById(req.params.id);
            
            // this form contains multipart data , that's why we don't simply use req.body.name for fetching the value 
            User.uploadAvatar(req, res, function(err){
                if(err){console.log('******multer**** ', err); return}
                user.name = req.body.name;
                user.email = req.body.email;
                // if the file exist 
                if(req.file){

                    // check if user has already a avatar
                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }

                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                req.flash('success', 'User Updated Successfully!');
                return res.redirect('back');
            });
        }else{
            req.flash('error', 'You cannot update this profile!');
            return res.status(401).send('Unauthorized!!');
        }
    } catch (err) {
        req.flash('error', err);
        return res.redirect('back');
    }
}


// render the sign-in page
module.exports.sign_in = function(req, res){
    // if the user is already signed in
    if(req.isAuthenticated()){
        req.flash('error', 'User already Signed In!');
        return res.redirect('/');
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
        req.flash('error', 'User already Signed In!');
        return res.redirect('/');
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
            req.flash('error', 'Password does not match');
            return res.redirect('back');
        }

        // find the user with the provided email
        let user = await User.findOne({email: req.body.email});
        // if the user doesn't exist then creat that user
        if(!user){
            let user = await User.create(req.body);
            req.flash('success', 'User Created Successfully');
            return res.redirect('/users/sign-in');
        // if the user exist then we simply redirect back
        }else{
            req.flash('error', 'User Exist!');
            return res.redirect('back');
        }

    } catch (err) {
        req.flash('error', err);
        return res.redirect('back');
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
                req.flash('error', err);
                return;
            }
            // sending the flash messages to the req
            req.flash('success', 'You have Logged Out!');
            return res.redirect('/');
        });
    } catch (err) {
        req.flash('error', err);
        return res.redirect('/');
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

module.exports.forgetPasswordPage = async (req, res) => {
    return res.render('forget_password', {
        title: 'forget-password-page',
        token: ''
    });
}

module.exports.forgetPasswordEmail = async (req, res) => {
    try {
        let user = await User.findOne({email: req.body.email});
        if(!user){
            req.flash('success', 'Email does not exist');
            return res.redirect('back');
        }
    
        let token = await Token.findOne({userId: user._id});
        if(!token){
            token = await Token.create({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex")
            });
        }
    
        token = await token.populate('userId', 'name email');
    
        let job = queue.create('forgetPasswordEmail', token).save((err) => {
            if(err){ console.log('Error in creating a job' , err); return; }
            console.log(job.id);
        });
    
        req.flash('success', 'Password recovery email sent!');
        return res.redirect('/users/sign-in');
    } catch (error) {
        console.log('error: ', error);
        req.flash('error', 'Error');
        return res.redirect('/users/sign-in');
    }
}

module.exports.forgetPasswordVerify = async (req, res) => {
    

    let user = await User.findById(req.params.userId);
    console.log('user: ', user);
    if(!user){
        req.flash('error', 'User not exit');
        return res.redirect('/users/sign-in');
    }

    let token = await Token.findOne({
        userId: user._id,
        token: req.params.token
    });

    if(!token){
        req.flash('error', 'Token or Link Expired!');
        return res.redirect('/users/sign-in');
    }

    await token.populate('userId', '_id');

    if(!req.body.password){
        return res.render('forget_password', {
            token: token,
            title: 'forget-password-page'
        });
    }

    if(req.body.password !== req.body.confirm_password){
        req.flash('error', 'password and confirm password does not match');
        return res.redirect('back');
    }

    user.password = await req.body.password;
    await user.save();
    await token.delete();

    req.flash('success', 'Password Changed Successfully!');
    return res.redirect('/users/sign-in');
}




