const mongoose = require("mongoose");

const marathonScheduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    place: {
      type: String,
      required: true,
      trim: true,
    },

    objective: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String, // image URL
    },

    status: {
      type: String,
      enum: ["pending", "ongoing", "completed"],
      default: "pending",
    },

    location: {
      latitude: {
        type: Number,
        default: null,
      },
      longitude: {
        type: Number,
        default: null,
      },
    },
    isActive:{
        type:Boolean,
        default:false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("marathonSchedule", marathonScheduleSchema);