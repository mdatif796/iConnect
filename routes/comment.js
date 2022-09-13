const express = require('express');
// setting up the router
const router = express.Router();
const passport = require('passport');

const commentController = require('../controllers/commentController');



// comment creation section
router.post('/create', passport.checkAuthentication, commentController.create);
// destroying comment 
router.get('/destroy/:id', passport.checkAuthentication, commentController.destroy_comment);

module.exports = router;