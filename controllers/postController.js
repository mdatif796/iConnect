const Post = require('../models/post');

// post creation controller
module.exports.create_post = function(req, res){
    if(req.isAuthenticated()){
        Post.create({
            content: req.body.content,
            user: req.user._id
        }, (err) => {
            if(err){
                console.log("Error in creating a post");
                return res.redirect('back');
            }
            return res.redirect('/');
        });
    }else{
        return res.redirect('back');
    }
}