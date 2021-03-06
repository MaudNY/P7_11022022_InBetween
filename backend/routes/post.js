const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/post');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


router.post('/createpost', auth, multer, postCtrl.createPost);
router.put('/updatepost/:postId', auth, multer, postCtrl.updatePost);
router.delete('/deletepost/:postId', auth, postCtrl.deletePost);
router.get('/home', auth, postCtrl.getAllPosts);

module.exports = router;