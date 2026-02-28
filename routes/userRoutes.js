const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {auth} = require('../middleware/auth');
const { uploadMultiple } = require('../utils/fileUploader');


router.post("/registration",uploadMultiple,userController.registerUser)
router.get('/profile', auth, userController.profile);

module.exports = router;
