const express = require('express');
const router = express.Router();
const { getStats, getUserList } = require('../controllers/dashboardController');
const {auth} = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

router.get('/stats', auth, roleMiddleware('superadmin', 'admin', 'supportmanager'), getStats);
router.get('/users', auth, roleMiddleware('superadmin', 'admin', 'supportmanager'), getUserList);

module.exports = router;
