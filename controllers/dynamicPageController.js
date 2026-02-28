const model = require("../models/index");
const fs = require("fs");
const path = require("path");
module.exports = {

  addHomePagedata: async (req, res) => {
    try {
      const { noticeboard } = req.body;
      let bannerImages;
      if (req.files) {
        bannerImages = req.files.map((file) => ({
          image: `http://localhost:5000/uploads/banner/${file.filename}`,
          isActive: true,
        }));
      }

      let homepage = await model.homepageModel.findOne();

      if (homepage) {
        homepage.banner.push(...bannerImages);
        homepage.noticeboard = noticeboard || homepage.noticeboard;
        await homepage.save();
      } else {
        homepage = await model.homepageModel.create({
          banner: bannerImages,
          noticeboard,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Homepage updated successfully",
        data: homepage,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
getHomepage :async(req,res)=>{
  try {
    const homepage = await model.homepageModel.find().sort({createdAt:-1})
     return res.status(200).json({
        success: true,
        message: "Homepage updated successfully",
        data: homepage,
      });
  } catch (error) {
    return res.status(500).json({
        success: false,
        message: error.message,
      });
  }
},
deleteBanner: async (req, res) => {
  try {
    const { imagepath } = req.query;

    if (!imagepath) {
      return res.status(400).json({
        success: false,
        message: "Image path is required",
      });
    }

    const filename = imagepath.split("/").pop();

    const filePath = path.join(
      __dirname,
      "../uploads/banner",
      filename
    );

    let homepage = await model.homepageModel.findOne();

    if (!homepage) {
      return res.status(404).json({
        success: false,
        message: "Homepage not found",
      });
    }

    homepage.banner = homepage.banner.filter(
      (item) => item.image !== imagepath
    );

    await homepage.save();

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
};
