const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const validations = require('../routes/validation');

router.get('/users/sign_up', userController.signUp);
router.post('/users/sign_up', validations.validateUsers, userController.create);
router.get('/users/sign_in', userController.signInForm);
router.post('/users/sign_in', userController.signIn);
router.get('/users/sign_out', userController.signOut);
router.get('/users/:id/premium', userController.showPremium);
router.post('/users/:id/premium', userController.upgradeToPremium);
router.get('/users/:id/downgrade', userController.showDowngrade);
router.post('/users/:id/downgrade', userController.downgrade);

module.exports = router;
