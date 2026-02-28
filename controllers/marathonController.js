const model = require("../models/index");
const jwt = require("jsonwebtoken")
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '10m' });
};
const generateRegistrationId = () => {
  return "MRN" + Date.now();
};


module.exports = {
  createRegistration: async (req, res) => {
    try {
      const {
        name,
        marathonId,
        phone,
        dob,
        gender,
        address,
        state,
        pincode,
        tshirt,
      } = req.body;

      // Check existing phone
      const existing = await model.marathonModel.findOne({ phone });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "यह मोबाइल नंबर पहले से पंजीकृत है",
        });
      }

      const newRegistration = new model.marathonModel({
        name,
        phone,
        dob,
        gender,
        address,
        marathonId,
        state,
        pincode,
        tshirt,
        registrationId: generateRegistrationId(),
      });

      await newRegistration.save();

      return res.status(201).json({
        success: true,
        message: "मैराथन पंजीकरण सफल रहा 🎉",
        data: newRegistration,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

  },
  getMarathonMembers: async (req, res) => {
    try {
      const members = await model.marathonModel.find()
      return res.status(200).json({ status: true, members })

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  createNewMarathon: async (req, res) => {
    try {
      const {
        title,
        description,
        date,
        place,
        objective,
        image,
        status,
        latitude,
        longitude,
      } = req.body;

      const Marathon = await model.marathonScheduleSchema.create({
        title,
        description,
        date,
        place,
        objective,
        image,
        status,
        location: {
          latitude: latitude ?? null,
          longitude: longitude ?? null,
        },
      });

      res.status(201).json({
        success: true,
        message: "Marathon created successfully",
        data: Marathon,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  getAllMarathonSchedule: async (req, res) => {
    try {
      const { isActive } = req.query;
      let filter = {};
      if (isActive === "true") {
        filter.isActive = true;
      } else if (isActive === "false") {
        filter.isActive = false;
      }

      const marathon = await model.marathonScheduleSchema.find(filter).sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: marathon.length,
        data: marathon,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  updateStatus: async (req, res) => {
    try {
      const { status } = req.body;

      // validation
      if (!["pending", "ongoing", "completed"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status value",
        });
      }

      const marathon = await model.marathonScheduleSchema.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      if (!marathon) {
        return res.status(404).json({
          success: false,
          message: "Marathon not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Status updated successfully",
        data: marathon,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },
  updateActive: async (req, res) => {
    try {
      const { isActive } = req.body;

      if (typeof isActive !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "isActive must be true or false",
        });
      }

      const marathon = await model.marathonScheduleSchema.findByIdAndUpdate(
        req.params.id,
        { isActive },
        { new: true }
      );

      if (!marathon) {
        return res.status(404).json({
          success: false,
          message: "Marathon not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Active status updated successfully",
        data: marathon,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },
  checkRegistration: async (req, res) => {
    try {
      const { mobile, dob } = req.body;
      const start = new Date(dob);
      start.setHours(0, 0, 0, 0);

      const end = new Date(dob);
      end.setHours(23, 59, 59, 999);

      let user = await model.marathonModel.findOne({
        phone: mobile,
        dob: { $gte: start, $lte: end }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Registration not found",
        });
      }
      user.token =  generateToken(user._id)
      await user.save()
      return res.status(200).json({
        success: true,
        data: user,
        message:"Logged Successfully"
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  getMarathonReceipt: async (req, res) => {
    try {
      const memberData = req.user
      const { phone, dob } = memberData;
      const strDate =new Date(dob).toLocaleDateString("en-GB") 
      const start = new Date(strDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(dob);
      end.setHours(23, 59, 59, 999);
      const user = await model.marathonModel.aggregate(
        [
          {
            $match: {
              phone: phone ,
              dob: { $gte: start, $lte: end }
            }
          },
          {
            $lookup: {
              from: "marathonschedules",
              localField: "marathonId",
              foreignField: "_id",
              as: "ongoingMarathon",

            }
          },
          {
            $unwind: {
              path: "$ongoingMarathon",
              preserveNullAndEmptyArrays: true
            }
          }
        ]
      )
      // const user = await model.marathonModel.findOne({
      //   phone:mobile,
      //   dob: { $gte: start, $lte: end }
      // });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Registration not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: user,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

