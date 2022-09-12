const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = function(req, res){
    // find the post on which that comment is going to save
    Post.findById(req.body.post, function(err, post){
        if(err){
            console.log("Error in finding the post at comment saving time");
            return;
        }
        // if the post is found
        if(post){
            Comment.create({
                content: req.body.content,
                user: req.user._id,
                post: req.body.post
            }, function(err, comment){
                if(err){
                    console.log("Error in creating a comment");
                    return;
                }
                // saving the id of comment to Post's comment array
                post.comments.push(comment._id);
                post.save();
                return res.redirect('/');
            });
        }else{
            console.log('Post is not found on which you commented');
            return res.redirect('/');
        }
    });
}