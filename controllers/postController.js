const Post = require('../models/post');
const Comment = require('../models/comment');

// post creation controller
module.exports.create_post = async function(req, res){
    try {
        if(req.isAuthenticated()){
            await Post.create({
                content: req.body.content,
                user: req.user._id
            });
            return res.redirect('back');
        } else {
            return res.redirect('back');
        }
    } catch (err) {
        console.log('Error', err);
        return;
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
            return res.redirect('back');
        } else {
            return res.redirect('back');
        }
    } catch (err) {
        console.log('Error', err);
        return;
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