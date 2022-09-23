const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req, res){
    let posts = await Post.find({})
    .sort('-createdAt')
    .populate('user', '-password')  // -password is used to prevent the password to populate
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    });

    return res.status(200).json({
        message: 'success',
        posts: posts
    });
}


// for destroying post
module.exports.destroy = async function(req, res){
    try {
        let post = await Post.findById(req.params.id);
            post.remove();
            await Comment.deleteMany({post: req.params.id});
            return res.status(200).json({
                message: 'Post and its associated comments deleted'
            });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal server error'
        });
    } 
}