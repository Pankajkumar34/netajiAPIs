const User = require('../models/User');
const Location = require('../models/Location');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
exports.getStats = async (req, res) => {
    try {
        const { state, vidhansabha, district, block, village } = req.query;
        
        let userQuery = {};
        if (state) userQuery.state = state;
        if (vidhansabha) userQuery.vidhansabha = vidhansabha;
        if (district) userQuery.district = district;
        if (block) userQuery.block = block;
        if (village) userQuery.village = village;

        // Get total users
        const totalUsers = await User.countDocuments(userQuery);

        // Get users by role
        const usersByRole = await User.aggregate([
            { $match: userQuery },
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);

        // Get users by Vidhan Sabha
        const usersByVidhanSabha = await User.aggregate([
            { $match: { ...userQuery, vidhansabha: { $ne: null } } },
            { $group: { _id: '$vidhansabha', count: { $sum: 1 } } }
        ]);

        // Get users by District
        const usersByDistrict = await User.aggregate([
            { $match: { ...userQuery, district: { $ne: null } } },
            { $group: { _id: '$district', count: { $sum: 1 } } }
        ]);

        // Get active/inactive users
        const activeUsers = await User.countDocuments({ ...userQuery, isActive: true });
        const inactiveUsers = await User.countDocuments({ ...userQuery, isActive: false });

        res.json({
            totalUsers,
            activeUsers,
            inactiveUsers,
            usersByRole,
            usersByVidhanSabha,
            usersByDistrict
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user list with filters
// @route   GET /api/dashboard/users
exports.getUserList = async (req, res) => {
    try {
        const { state, vidhansabha, district, block, village, role, search, page = 1, limit = 20 } = req.query;
        
        let query = {};
        
        if (role) query.role = role;
        if (state) query.state = state;
        if (vidhansabha) query.vidhansabha = vidhansabha;
        if (district) query.district = district;
        if (block) query.block = block;
        if (village) query.village = village;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { mobile: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .select('-password')
            .populate('state', 'name')
            .populate('vidhansabha', 'name')
            .populate('district', 'name')
            .populate('block', 'name')
            .populate('village', 'name')
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(query);

        res.json({
            users,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
