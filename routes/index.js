const express = require('express');

// setting up the router
const router = express.Router();
const homeController = require('../controllers/homeController');

// get request for home route
router.get('/', homeController.home);

// any request that come for '/user' from browser sent to routes of user
router.use('/users', require('./user'));

module.exports = router;