
const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema(
  {
     role: {
        type: String,
        enum: ['superadmin', 'callcenteradmin', 'supportmanager', 'user'],
        default: 'user'
    },
     email: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    name: { type: String, required: true },
    fatherName: { type: String},
    gender: { type: String },
    dob: { type: Date },
    address: { type: String },
    district: { type: String },
    block: { type: String },
    pincode: { type: String },
    mobile: { type: String,require:true },
    image: {
        type: String,
    },
    referralCode: {
      type: String,
      unique: true,
      index: true,
    },

    referredBy: {
      type: String,
      index: true,
    },
    isActive:{
        type:Boolean,
        default:true
    }
  },
  { timestamps: true }
);
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};
module.exports = mongoose.model("User", userSchema);
