const jwt = require('jsonwebtoken');
const User = require('../models/User');

const MarathonModel = require('../models/marathonSchema');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'Token is not valid' });
        }

        if (!user.isActive) {
            return res.status(401).json({ message: 'User account is deactivated' });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Token expired. Please login again."
            });
        }

        // ✅ Invalid Token
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                message: "Invalid token."
            });
        }

        // ✅ Other Errors
        return res.status(401).json({
            message: "Authorization failed."
        });
    }

};
const marathonAuth = async (req, res, next) => {
    try {
        const token = req.query.token;

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await MarathonModel.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'Token is not valid' });
        }


        req.user = user;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Token expired. Please login again."
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                message: "Invalid token."
            });
        }

        return res.status(401).json({
            message: "Authorization failed."
        });
    }

};

module.exports = { auth, marathonAuth };
