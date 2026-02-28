// models/ReferralStats.js
const mongoose = require("mongoose");

const referralStatsSchema = new mongoose.Schema(
  {
    referralCode: {
      type: String,
      unique: true,
      index: true,
    },
    userIds:[
      mongoose.Types.ObjectId
    ],
    totalReferrals: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReferralStats", referralStatsSchema);