const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Location = require('../models/Location');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Clear existing data
        await User.deleteMany({});
        await Location.deleteMany({});
        console.log('Existing data cleared');

        // Create States
        const states = await Location.insertMany([
            { name: 'Uttar Pradesh', type: 'state', code: 'UP' },
            { name: 'Madhya Pradesh', type: 'state', code: 'MP' },
            { name: 'Rajasthan', type: 'state', code: 'RJ' }
        ]);
        console.log('States created');

        // Create Vidhan Sabhas for Uttar Pradesh
        const upState = states[0];
        const vidhanSabhas = await Location.insertMany([
            { name: 'Lucknow', type: 'vidhansabha', parent: upState._id, code: 'LK' },
            { name: 'Varanasi', type: 'vidhansabha', parent: upState._id, code: 'VA' },
            { name: 'Agra', type: 'vidhansabha', parent: upState._id, code: 'AG' },
            { name: 'Kanpur', type: 'vidhansabha', parent: upState._id, code: 'KN' }
        ]);
        console.log('Vidhan Sabhas created');

        // Create Districts for Lucknow
        const lucknow = vidhanSabhas[0];
        const districts = await Location.insertMany([
            { name: 'Lucknow District', type: 'district', parent: lucknow._id, code: 'LKD' },
            { name: 'Unnao', type: 'district', parent: lucknow._id, code: 'UNN' },
            { name: 'Rae Bareli', type: 'district', parent: lucknow._id, code: 'RBR' }
        ]);
        console.log('Districts created');

        // Create Blocks for Lucknow District
        const lucknowDistrict = districts[0];
        const blocks = await Location.insertMany([
            { name: 'Lucknow Block', type: 'block', parent: lucknowDistrict._id },
            { name: 'Mohanlalganj', type: 'block', parent: lucknowDistrict._id },
            { name: 'Bakshi Ka Talab', type: 'block', parent: lucknowDistrict._id }
        ]);
        console.log('Blocks created');

        // Create Villages for Lucknow Block
        const lucknowBlock = blocks[0];
        await Location.insertMany([
            { name: 'Village 1', type: 'village', parent: lucknowBlock._id },
            { name: 'Village 2', type: 'village', parent: lucknowBlock._id },
            { name: 'Village 3', type: 'village', parent: lucknowBlock._id }
        ]);
        console.log('Villages created');

        // Create Super Admin
        await User.create({
            name: 'Super Admin',
            mobile: '9999999999',
            password: 'admin123',
            role: 'superadmin'
        });
        console.log('Super Admin created (Mobile: 9999999999, Password: admin123)');

        // Create Admin
        await User.create({
            name: 'Admin User',
            mobile: '8888888888',
            password: 'admin123',
            role: 'admin',
            state: upState._id
        });
        console.log('Admin created (Mobile: 8888888888, Password: admin123)');

        // Create Support Manager
        await User.create({
            name: 'Support Manager',
            mobile: '7777777777',
            password: 'admin123',
            role: 'supportmanager',
            state: upState._id,
            vidhansabha: lucknow._id
        });
        console.log('Support Manager created (Mobile: 7777777777, Password: admin123)');

        console.log('Seed data inserted successfully!');
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedData();
