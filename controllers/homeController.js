const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req, res){
    // populate here is used to pass all the user information 
    try {
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });

        let users = await User.find({});

        return res.render('home', {
            title: "iConnect | home",
            posts: posts,
            all_users: users
        });

    } catch (err) {
        console.log("Error", err);
        return;
    }
    
    // .exec(function(err, posts){
    //         if(err){
    //             console.log('Error in finding all posts of home page.');
    //             return;
    //         }

    //         // finding all the user and shows it on home page 
    //         User.find({}, function(err, users){
    //             return res.render('home', {
    //                 title: "iConnect | home",
    //                 posts: posts,
    //                 all_users: users
    //             });
    //         });
            
    // });
}