const mongoose = require("mongoose");

const marathonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    marathonId: {
      type: mongoose.Types.ObjectId,
      require: true,
      ref:"marathonSchedule"
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: /^[6-9]\d{9}$/,
    },

    dob: {
      type: Date,
      required: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    pincode: {
      type: String,
      required: true,
      match: /^\d{6}$/,
    },

    tshirt: {
      type: String,
      enum: ["S", "M", "L", "XL"],
      required: true,
    },

    registrationId: {
      type: String,
      unique: true,
    },
token:{
  type:String,
  default:""
}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Marathon", marathonSchema);