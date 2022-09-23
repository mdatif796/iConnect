const express = require('express');

const router = express.Router();

const usersApiController = require('../../../controllers/api/v1/users_api');

router.post('/create-session', usersApiController.create_session);

module.exports = router;