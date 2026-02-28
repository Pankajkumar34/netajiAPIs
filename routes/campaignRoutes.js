const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const { uploadMultiple } = require('../utils/fileUploader');
const {auth} = require('../middleware/auth');

router.post('/create-member',campaignController.createMember );
router.post('/create-feedback',campaignController.feedbackCreate );
router.post('/feedback-list',campaignController.feedbackList );
router.get("/get-member",campaignController.getAllMembers)
router.post("/create-post",auth, uploadMultiple,campaignController.createMultiplePosts)
router.get("/get-post", campaignController.getNewsPost)



module.exports = router;
