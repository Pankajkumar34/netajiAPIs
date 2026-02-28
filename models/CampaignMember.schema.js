const mongoose = require("mongoose");

const campaignMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },

    dob: {
      type: Date,
      required: true
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true
    },

    state: {
      type:String,
      require:true   
    },

    vidhanSabha: {
      type:String,
      require:true
    },

    district: {
      type:String,
      ref: "District",
      required: true
    },

    block: {
      type:String,
      require:true
    },

    village: {
      type:String,
      require:true
    },

    occupation: {
      type: String,
      required: true
    },
    status:{
      enum:["active","inactive"],
      type:String,
      default:"active"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CampaignMember", campaignMemberSchema);