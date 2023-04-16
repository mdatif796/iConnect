const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.toggleLike = async (req, res) => {
    try {
        let likeable;
        let deletable = false;

        // url = /likes/toggle/?id=1233&type=Post

        if(req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');

        } else {
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        // now check if like already exists or not
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        });

        // if likes already exist 
        if(existingLike) {
            await likeable.likes.pull(existingLike._id);
            deletable = true;
            await existingLike.remove();
        } else {
            let newLike = await Like.create({
                likeable: req.query.id,
                onModel: req.query.type,
                user: req.user._id
            });

            likeable.likes.push(newLike._id);
        }

        await likeable.save();

        return res.json(200, {
            message: 'request successfull',
            deletable: deletable,
            likeLength: likeable.likes.length
        });

    } catch (error) {
        console.log('error: ', error);
        return res.json(500, {
            message: 'Internal server error'
        });
    }
}