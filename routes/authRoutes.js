const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

router.post('/signup', authController.signup_post);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);
router.patch('/modifycart',authController.modify_patch);
router.get('/getuser',authController.getuser_get);
router.post('/getproduct',authController.getproduct_post);
router.get('/getcart',authController.getcart_get);

module.exports = router;