const Location = require('../models/Location');
const { search } = require("india-pincode-search");

// @desc    Create new location
// @route   POST /api/locations
exports.createLocation = async (req, res) => {
    try {
        const { name, type, parent, code } = req.body;

        const location = await Location.create({
            name,
            type,
            parent,
            code
        });

        res.status(201).json(location);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all locations
// @route   GET /api/locations
exports.getLocations = async (req, res) => {
    try {
        const { type, parent } = req.query;
        
        let query = {};
        if (type) query.type = type;
        if (parent) query.parent = parent;

        const locations = await Location.find(query).sort({ name: 1 });
        res.json(locations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get location by ID
// @route   GET /api/locations/:id
exports.getLocationById = async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);
        
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }

        res.json(location);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getStates = async (req, res) => {
    try {
        const states = await Location.find({ type: 'state', isActive: true ,name:"Uttar Pradesh"}).sort({ name: 1 });
        res.json(states);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getVidhanSabhas = async (req, res) => {
    try {
        const vidhanSabhas = await Location.find({ 
            type: 'vidhansabha', 
            parent: req.params.stateId,
            isActive: true 
        }).sort({ name: 1 });
        res.json(vidhanSabhas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getDistricts = async (req, res) => {
    try {
        const districts = await Location.find({ 
            type: 'district', 
            parent: req.params.vidhanSabhaId,
            isActive: true 
        }).sort({ name: 1 });
        res.json(districts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBlocks = async (req, res) => {
    try {
        const blocks = await Location.find({ 
            type: 'block', 
            parent: req.params.districtId,
            isActive: true 
        }).sort({ name: 1 });
        res.json(blocks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getVillages = async (req, res) => {
    try {
        const villages = await Location.find({ 
            type: 'village', 
            parent: req.params.blockId,
            isActive: true 
        }).sort({ name: 1 });
        res.json(villages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateLocation = async (req, res) => {
    try {
        const { name, code, isActive } = req.body;

        const location = await Location.findById(req.params.id);

        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }

        location.name = name || location.name;
        location.code = code || location.code;
        location.isActive = isActive !== undefined ? isActive : location.isActive;

        const updatedLocation = await location.save();
        res.json(updatedLocation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.deleteLocation = async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);

        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }

        await location.deleteOne();
        res.json({ message: 'Location removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getIndiaLocation=async(req,res)=>{

  try {
    const data = await search(req.params.pincode);
    return res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching pincode data" });
  }

}