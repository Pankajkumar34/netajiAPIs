const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        adminId: {
            type: mongoose.Types.ObjectId,
            default: null
        },
        description: {
            type: String,
            required: true,
        },
        fileUrl: {
            type: String,
            required: true,
        },
        adminName: {
            type: String,
            default: "Admin - NashaMukt Abhiyan",
        },
       
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true, 
    }
);

module.exports = mongoose.model("newPost", postSchema);