const express = require('express');

// setting up the router
const router = express.Router();
const homeController = require('../controllers/homeController');

// get request for home route
router.get('/', homeController.home);

// any request that come for '/user' from browser sent to routes of user
router.use('/users', require('./user'));
// any request that come for '/posts' from browser sent to routes of post
router.use('/posts', require('./post'));
// any request that came for '/comment' fromm browser sent to routes of comment
router.use('/comments', require('./comment'));

module.exports = router;