const express = require("express");
const router = express.Router();
const { uploadMultiple } = require("../utils/fileUploader");
const homepageController = require("../controllers/dynamicPageController");

router.post(
  "/homepage",
  uploadMultiple, // max 10 images
  homepageController.addHomePagedata
);
router.get("/get-page-data",homepageController.getHomepage)
router.delete("/remove",homepageController.deleteBanner)


module.exports = router;
