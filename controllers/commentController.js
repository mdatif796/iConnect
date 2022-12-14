const Comment = require('../models/comment');
const Post = require('../models/post');
const mailer = require('../mailers/commentMailers');
const { post } = require('../routes/post');
const queue = require('../config/kue');
const commentMailers = require('../workers/comment_emails_worker');

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
            comment = await comment.populate('user', 'name email');
            // mailer.newComment(comment);

            let job = queue.create('emails', comment).save(function(err){
                if(err){console.log('error in creating a job ', err); return;}
                console.log(job.id);
            });
            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Comment Created!"
                });
            }
            req.flash('success', 'Comment created Successfully!');
            return res.redirect('/');
        }else{
            req.flash('error', 'Post is not found on which you commented');
            return res.redirect('/');
        }
    } catch (err) {
        req.flash('error', err);
        return res.redirect('/');
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
            
            if(req.xhr){
                return res.status(200).json({
                    data: {
                        commentId: req.params.id
                    },
                    message: 'Comment Deleted'
                });
            }

            req.flash('success', 'Comment Deleted Successfully!');
            return res.redirect('back');

        }else{
            req.flash('error', 'You cannot delete this comment!');
            return res.redirect('back');
        }

    } catch (err) {
        req.flash('error', err);
        return res.redirect('back');
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