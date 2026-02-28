const express = require("express");
const router = express.Router();
const marathonController = require("../controllers/marathonController");
const {marathonAuth} =require("../middleware/auth")
router.post("/registration",marathonController.createRegistration)
router.get("/get-members",marathonController.getMarathonMembers)
router.post("/create-marathon",marathonController.createNewMarathon)
router.get("/marathonList",marathonController.getAllMarathonSchedule)
router.patch("/:id/active",marathonController.updateActive)
router.patch("/:id/status",marathonController.updateStatus)
router.post("/view-marathon-member-details",marathonController.checkRegistration)
router.get("/download-marathon-receipt",marathonAuth,marathonController.getMarathonReceipt)


module.exports = router;
