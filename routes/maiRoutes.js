
const express = require("express")
const router = express();
// Import Routes
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const locationRoutes = require('./locationRoutes');
const campaignRoutes = require('./campaignRoutes');
const marathonRoutes = require('./marathonRoutes');
const pageroutes = require("./DynamicpageRoutes")
router.use('/api/auth', authRoutes);
router.use('/api/users', userRoutes);
router.use('/api/dashboard', dashboardRoutes);
router.use('/api/locations', locationRoutes);
router.use('/api/campaign', campaignRoutes);
router.use('/api/page',pageroutes );
router.use('/api/marathon', marathonRoutes);

module.exports = router
