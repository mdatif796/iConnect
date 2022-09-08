const Post = require('../models/post');

module.exports.home = function(req, res){
    // populate here is used to pass all the user information 
    Post.find({}).populate('user').exec(function(err, posts){
        if(err){
            console.log('Error in finding all posts of home page.');
            return;
        }
        return res.render('home', {
            title: "iConnect | home",
            posts: posts
        });
    });
}