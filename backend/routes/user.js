const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/signup', userCtrl.signup);
router.post('/', userCtrl.login);
router.get('/profile/:id', auth, userCtrl.getOneProfile);
router.put('/updateprofile/:id', auth, userCtrl.updateProfile);
router.put('/updateprofilepic/:id', auth, multer, userCtrl.updateProfilePicture);
router.delete('/deleteaccount/:id', auth, userCtrl.deleteAccount);

module.exports = router;