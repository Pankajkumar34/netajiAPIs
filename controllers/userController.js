const model = require("../models/index")
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
// // @desc    Get all users
// // @route   GET /api/users
// exports.getUsers = async (req, res) => {
//     try {
//         const { role, state, vidhansabha, district, block, village, page = 1, limit = 10 } = req.query;

//         let query = {};

//         if (role) query.role = role;
//         if (state) query.state = state;
//         if (vidhansabha) query.vidhansabha = vidhansabha;
//         if (district) query.district = district;
//         if (block) query.block = block;
//         if (village) query.village = village;

//         const users = await User.find(query)
//             .select('-password')
//             .populate('state', 'name')
//             .populate('vidhansabha', 'name')
//             .populate('district', 'name')
//             .populate('block', 'name')
//             .populate('village', 'name')
//             .skip((page - 1) * limit)
//             .limit(parseInt(limit));

//         const total = await User.countDocuments(query);

//         res.json({
//             users,
//             total,
//             page: parseInt(page),
//             pages: Math.ceil(total / limit)
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // @desc    Get single user
// // @route   GET /api/users/:id
// exports.getUserById = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id).select('-password')
//             .populate('state', 'name')
//             .populate('vidhansabha', 'name')
//             .populate('district', 'name')
//             .populate('block', 'name')
//             .populate('village', 'name');

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         res.json(user);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // @desc    Update user
// // @route   PUT /api/users/:id
// exports.updateUser = async (req, res) => {
//     try {
//         const { name, address, role, isActive, state, vidhansabha, district, block, village } = req.body;

//         const user = await User.findById(req.params.id);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         user.name = name || user.name;
//         user.address = address || user.address;
//         user.role = role || user.role;
//         user.isActive = isActive !== undefined ? isActive : user.isActive;
//         user.state = state || user.state;
//         user.vidhansabha = vidhansabha || user.vidhansabha;
//         user.district = district || user.district;
//         user.block = block || user.block;
//         user.village = village || user.village;

//         const updatedUser = await user.save();

//         res.json({
//             _id: updatedUser._id,
//             name: updatedUser.name,
//             mobile: updatedUser.mobile,
//             role: updatedUser.role,
//             isActive: updatedUser.isActive
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // @desc    Delete user
// // @route   DELETE /api/users/:id
// exports.deleteUser = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         await user.deleteOne();

//         res.json({ message: 'User removed' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };



// controllers/userController.js
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
const { nanoid } = require("nanoid");

module.exports = {
    registerUser: async (req, res) => {
        try {
            const {
                name,
                fatherName,
                gender,
                dob,
                address,
                district,
                block,
                pincode,
                mobile,
                referralCode,
            } = req.body;
            let bannerImages;
            console.log(req.files)
            const isExistuser = await model.userModel.findOne({ mobile })
            if (isExistuser) {
                return res.status(400).json({ status: false, message: "Already Account exist of this number" })
            }
            if (req.files) {
                console.log(req.files)
                bannerImages = req.files.map((file) => ({
                    image: `http://localhost:5000/uploads/profile/${file.filename}`,
                    isActive: true,
                }));
            }
            console.log(bannerImages, "bannerImagesbannerImages")
            const myReferralCode = nanoid(8);

            const user = await model.userModel.create({
                name,
                image: bannerImages?.length > 0 ? bannerImages[0]?.image : "",
                fatherName,
                gender,
                dob,
                address,
                district,
                block,
                pincode,
                mobile,
                referralCode: myReferralCode,
                referredBy: referralCode || null,
            });

            // If user entered referral
            if (referralCode) {
                await model.referralStataModel.findOneAndUpdate(
                    { referralCode },
                    { $inc: { totalReferrals: 1 }, $push: { userIds: user._id }, },
                    { upsert: true, new: true }
                );
            }

            res.status(201).json({
                success: true,
                message: "User Registered Successfully",
                data: user,
                token: generateToken(user._id)
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    profile: async (req, res) => {
        try {
            const userId = req.user.id
            console.log(userId)
            const user = await model.userModel.aggregate([
                {
                    $match: { _id: new mongoose.Types.ObjectId(userId) }
                },
                {
                    $lookup: {
                        from: "referralstats",
                        localField: "referralCode", 
                        foreignField: "referralCode",
                        as: "referrals"
                    }
                },
                {
                    $unwind: {
                        path: "$referrals",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $addFields: {
                        totalMembers: { $ifNull: ["$referrals.totalReferrals", 0] },
                        totalCoins: { $ifNull: ["$referrals.totalReferrals", 0] }
                    }
                },
                {
                    $project: {
                        password: 0,
                        referrals: 0
                    }
                }
            ]);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }


            return res.status(200).json({ status: true, user });

        } catch (error) {
            return res.status(500).json({ status: false, message: error.message });
        }
    }

}