const Post = require('../models/post');
const Comment = require('../models/comment');

// post creation controller
module.exports.create_post = async function(req, res){
    try {
        if(req.isAuthenticated()){
            let post = await Post.create({
                content: req.body.content,
                user: req.user._id
            });
        
            if(req.xhr){
                // populate the user name who post
                await post.populate('user', 'name');
                return res.status(200).json({
                    data: {
                        post: post
                    },
                    message: 'Post created!'
                });
            }
            req.flash('success', 'Post Created Successfully!');
            return res.redirect('back');
        } else {
            req.flash('error', 'User is not signed in!');
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error', err);
        return res.redirect('back');
    }
    // if(req.isAuthenticated()){
    //     Post.create({
    //         content: req.body.content,
    //         user: req.user._id
    //     }, (err) => {
    //         if(err){
    //             console.log("Error in creating a post");
    //             return res.redirect('back');
    //         }
    //         return res.redirect('/');
    //     });
    // }else{
    //     return res.redirect('back');
    // }
}

// for destroying post
module.exports.destroy = async function(req, res){
    try {
        let post = await Post.findById(req.params.id);
        // .id is required here to convert _id to string 
        if(post.user == req.user.id){
            post.remove();
            await Comment.deleteMany({post: req.params.id});
            if(req.xhr){
                return res.status(200).json({
                    data: {
                        postId: req.params.id
                    },
                    message: 'Post deleted!'
                });
            }
            req.flash('success', 'Post Deleted Successfully!');
            return res.redirect('back');
        } else {
            req.flash('error', 'You cannot delete this post!');
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error', err);
        return res.redirect('back');
    }


    // Post.findById(req.params.id, function(err, post){

    //     // .id is required here to convert _id to string 
    //     if(post.user == req.user.id){
    //         post.remove();
    //         Comment.deleteMany({post: req.params.id}, function(err){
    //             return res.redirect('back');
    //         });
    //     }else
    //         return res.redirect('back');
    // });
}