const express = require('express');
// setting up the router
const router = express.Router();
const passport = require('passport');

const postController = require('../controllers/postController');



// post creation section
router.post('/create-post', passport.checkAuthentication, postController.create_post);
// delete post route
router.get('/destroy/:id', passport.checkAuthentication, postController.destroy);

module.exports = router;