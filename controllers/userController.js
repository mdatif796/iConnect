// render the user page
module.exports.user = function(req, res){
    res.render('user', {
        title: "user"
    });
}


// render the profile page
module.exports.profile = function(req, res){
    res.end('<h1> User profile </h1>');
}


// render the sign-in page
module.exports.sign_in = function(req, res){
    return res.render('user_sign_in', {
        title: "sign-in"
    });
}


// render the sign-up page
module.exports.sign_up = function(req, res){
    return res.render('user_sign_up', {
        title: "sign-up"
    });
}
