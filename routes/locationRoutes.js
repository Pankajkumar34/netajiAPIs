const express = require('express');
const router = express.Router();
const { 
    createLocation, 
    getLocations, 
    getLocationById, 
    getStates,
    getVidhanSabhas,
    getDistricts,
    getBlocks,
    getVillages,
    updateLocation, 
    deleteLocation, 
    getIndiaLocation
} = require('../controllers/locationController');
const {auth} = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

router.post('/', auth, roleMiddleware('superadmin', 'admin'), createLocation);
router.get('/', getLocations);
router.get('/states', getStates);
router.get('/vidhansabhas/:stateId', getVidhanSabhas);
router.get('/districts/:vidhanSabhaId', getDistricts);
router.get('/blocks/:districtId', getBlocks);
router.get('/villages/:blockId', getVillages);
router.get('/:id', getLocationById);
router.put('/:id', auth,  updateLocation);
router.delete('/:id', auth,  deleteLocation);
router.get('/get-location/:pincode',  getIndiaLocation);


module.exports = router;
