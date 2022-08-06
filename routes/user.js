const express = require('express');

// setting up the router
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/', userController.user);

// get request for '/user/profile' from browser 
router.get('/profile', userController.profile);

module.exports = router;