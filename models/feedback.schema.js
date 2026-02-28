const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    phone: {
      type: String,
      required: true,
    },


    feedback: {
      type:String,
      require:true   
    },

    
  },
  { timestamps: true }
);

module.exports = mongoose.model("feedback", feedbackSchema);