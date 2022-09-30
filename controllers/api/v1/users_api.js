require('dotenv').config();

const User = require('../../../models/user');

const jwt = require('jsonwebtoken');

module.exports.create_session = async function(req, res){
    // find if email exist or not
    try {
        
        let user = await User.findOne({email: req.body.email});

        // if user not found or the password doesn't match
        if(!user || user.password != req.body.password){
            return res.status(422).json({
                message: 'Invalid username or password'
            });
        }

        // if the user is found and the password matches 
        return res.status(200).json({
            message: 'User is successfully signed in and the generated token is here!',
            token: {
                data: jwt.sign(user.toJSON(), process.env.JWTSECRETKEY, {expiresIn: 10000})
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server error',
            error: error
        });
    }
}