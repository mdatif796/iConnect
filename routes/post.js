const express = require('express');
// setting up the router
const router = express.Router();

const postController = require('../controllers/postController');



// post creation section
router.post('/create-post', postController.create_post);

module.exports = router;