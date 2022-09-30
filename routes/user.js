const express = require('express');

// setting up the router
const router = express.Router();

const userController = require('../controllers/userController');

const passport = require('passport');

router.get('/', userController.user);

// get request for '/user/profile' from browser 
router.get('/profile/:id', passport.checkAuthentication, userController.profile);
// post request for updating the profile 
router.post('/update/:id', passport.checkAuthentication, userController.update);



// get request for '/user/sign-in' from browser
router.get('/sign-in', userController.sign_in);
// get request for '/user/sign-up' from browser
router.get('/sign-up', userController.sign_up);

// post request for creating a user
router.post('/create-user', userController.create_user);

// post request for creating a session
router.post('/create-session', passport.authenticate('local', {failureRedirect: '/users/sign-in'}),
    userController.create_session
);

// get request for sign out
router.get('/sign-out', passport.checkAuthentication, userController.destroySession);
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), userController.create_session);



module.exports = router;