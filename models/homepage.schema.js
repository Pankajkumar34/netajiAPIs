const mongoose = require("mongoose");

const homepageSchema = new mongoose.Schema(
  {
    banner: [
      {
        image: {
          type: String,
          required: true,
        },
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],
    noticeboard: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Homepage", homepageSchema);