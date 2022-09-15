const Comment = require('../models/comment');
const Post = require('../models/post');
const { post } = require('../routes/post');

module.exports.create = async function(req, res){
    try {
        // find the post on which that comment is going to save
        let post = await Post.findById(req.body.post);
        if(post){
            let comment = await Comment.create({
                content: req.body.content,
                user: req.user._id,
                post: req.body.post
            });
            // saving the id of comment to Post's comment array
            post.comments.push(comment._id);
            post.save();
            return res.redirect('/');
        }else{
            console.log('Post is not found on which you commented');
            return res.redirect('/');
        }
    } catch (err) {
        console.log('Error', err);
        return;
    }
    
}

    // Post.findById(req.body.post, function(err, post){
    //     if(err){
    //         console.log("Error in finding the post at comment saving time");
    //         return;
    //     }
    //     // if the post is found
    //     if(post){
    //         Comment.create({
    //             content: req.body.content,
    //             user: req.user._id,
    //             post: req.body.post
    //         }, function(err, comment){
    //             if(err){
    //                 console.log("Error in creating a comment");
    //                 return;
    //             }
    //             // saving the id of comment to Post's comment array
    //             post.comments.push(comment._id);
    //             post.save();
    //             return res.redirect('/');
    //         });
    //     }else{
    //         console.log('Post is not found on which you commented');
    //         return res.redirect('/');
    //     }
    // });
// }


// destroying comment 
module.exports.destroy_comment = async function(req, res){
    try {
        // first find the comment by it's id which comes from params
        let comment = await Comment.findById(req.params.id);

        // if the user which is logged in match with the user who makes this comment
        // find the user of the post to make the functionality like if the user which is logged in is equal to
        // the user who makes this post then he will delete the comment on his post

        if((comment.user == req.user.id)){
            // 1st way of doing this
            let postId = comment.post;
            comment.remove();
            // $pull is used to remove that id from comments
            await Post.findByIdAndUpdate(postId, {$pull:{comments: req.params.id}});
            return res.redirect('back');

        }else{
            return res.redirect('back');
        }

    } catch (err) {
        console.log('Error', err);
        return;
    }
}

//     Comment.findById(req.params.id, function(err, comment){
//         // if the user which is logged in match with the user who makes this comment
//         // find the user of the post to make the functionality like if the user which is logged in is equal to
//         // the user who makes this post then he will delete the comment on his post
        
//         // To Be done 

//         if((comment.user == req.user.id)){
//             // 1st way of doing this
//             let postId = comment.post;
//             comment.remove();
//             // $pull is used to remove that id from comments
//             Post.findByIdAndUpdate(postId, {$pull:{comments: req.params.id}}, function(err){
//                 return res.redirect('back');
//             });

//             // second way of doing this
//             // // then remove that comment
//             // comment.remove();
//             // // and we also have to remove from the comments array which is present inside the post
//             // // that's why we first find that post
//             // Post.findById(comment.post, function(err, post){

//             //     // find the index of that comment's id which should be deleted
//             //     const index = post.comments.indexOf(comment.id);
//             //     post.comments.splice(index, 1);
//             //     // after that save the post
//             //     post.save();
//                 // return res.redirect('back');
//             // });
//         }else{
//             return res.redirect('back');
//         }
//     });
// }