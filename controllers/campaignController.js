const model = require("../models/index")
module.exports = {
    createMember: async (req, res) => {
        try {
            const {
                name,
                dob,
                gender,
                phone,
                email,
                state,
                vidhanSabha,
                district,
                block,
                village,
                occupation
            } = req.body;
            const existing = await model.campaingModel.findOne({ phone });
            if (existing) {
                return res.status(400).json({
                    success: false,
                    message: "यह मोबाइल नंबर पहले से पंजीकृत है"
                });
            }

            const member = await model.campaingModel.create({
                name,
                dob,
                gender,
                phone,
                email,
                state,
                vidhanSabha,
                district,
                block,
                village,
                occupation
            });

            return res.status(201).json({
                success: true,
                message: "सफलतापूर्वक पंजीकरण हो गया",
                data: member
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Server Error",
                error: error.message
            });
        }
    },
    getAllMembers: async (req, res) => {
        try {
            const members = await model.campaingModel.find().sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                count: members.length,
                data: members
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
    getMembersByVidhanSabha: async (req, res) => {
        try {
            const { vidhanSabhaId } = req.params;

            const members = await model.campaingModel.find({
                vidhanSabha: vidhanSabhaId
            });

            return res.staus(200).json({
                success: true,
                count: members.length,
                data: members
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
    feedbackCreate: async (req, res) => {
        try {
            const { name, phone, feedback } = req.body
            const createdData = await model.feedbackModel.create({
                name: name,
                phone: phone,
                feedback: feedback
            })
            return res.status(201).json({
                success: true,
                data: createdData,
                message: "Thanks For Given This valuble feedback"
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
    feedbackList: async (req, res) => {
        try {
            const feedbackList = await model.feedbackModel.find()
            return res.status(200).json({
                success: true,
                feedbackList,
                message: "Thanks For Given This valuble feedback"
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
    createMultiplePosts: async (req, res) => {
        try {
            const titles = req.body.title;
            const descriptions = req.body.description;
            const user = req.user

            // make sure always array
            const titleArray = Array.isArray(titles) ? titles : [titles];
            const descArray = Array.isArray(descriptions)
                ? descriptions
                : [descriptions];

            const posts = titleArray.map((title, index) => {
                const file = req.files[index];

                return {
                    title,
                    adminName: user?.name,
                    adminId: user?._id,
                    description: descArray[index],
                    fileUrl: file
                        ? `http://localhost:5000/uploads/post/${file.filename}`
                        : null,
                    mediaType: file?.mimetype.startsWith("video/")
                        ? "video"
                        : "image",
                    isActive: true,
                };
            });

            const createdPosts = await model.newPostModel.insertMany(posts);

            return res.status(201).json({
                success: true,
                message: "Posts created successfully",
                data: createdPosts,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Server Error",
                error: error.message,
            });
        }
    },
    getNewsPost: async (req, res) => {
        try {
            const post = await model.newPostModel.find()
            return res.status(200).json({ status: true, post })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Server Error",
                error: error.message,
            });
        }
    }

}
