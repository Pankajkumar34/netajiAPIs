const jwt = require('jsonwebtoken');
const model = require("../models/index");
const { nanoid } = require('nanoid');
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.signup = async (req, res) => {
    try {
        const { name, mobile, password, role, email } = req.body;
        const myReferralCode = nanoid(8);
        // Check if user exists
        const userExists = await model.userModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this mobile number' });
        }

        // Create user
        const user = await model.userModel.create({
            name,
            mobile,
            password,
            email: email,
            referralCode: myReferralCode,
            role: role || 'user',

        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                mobile: user.mobile,
                role: user.role,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.login = async (req, res) => {
  try {
    const { email, password, mobile, dob } = req.body;

    let user;

  
    if (mobile && dob) {

      user = await model.userModel.findOne({ mobile });

      if (!user) {
        return res.status(401).json({ message: "Invalid mobile number" });
      }

      const inputDob = new Date(dob).toISOString().split("T")[0];
      const userDob = user.dob.toISOString().split("T")[0];

      if (inputDob !== userDob) {
        return res.status(401).json({ message: "Invalid DOB" });
      }

    } 
  
    else if (email && password) {

      user = await model.userModel.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: "Invalid email" });
      }

      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

    } 
    else {
      return res.status(400).json({
        message: "Provide either mobile & dob OR email & password",
      });
    }



    if (!user.isActive) {
      return res.status(401).json({
        message: "Your account has been deactivated",
      });
    }

 

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
    try {
        const user = await model.userModel.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
