const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const validations = require('../routes/validation');

router.get('/users/sign_up', userController.signUp);
router.post('/users/sign_up', validations.validateUsers, userController.create);

module.exports = router;