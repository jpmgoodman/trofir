var express = require('express');
var router = express.Router();

router.use('/users', require('./api/users'));
router.use('/schools', require('./api/schools'));
router.use('/courses', require('./api/courses'));
router.use('/messages', require('./api/messages'));
router.use('/avatars', require('./api/avatars'));

module.exports = router;
