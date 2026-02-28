require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require("path")
const mainRoutes = require("./routes/maiRoutes")

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors(
    {
        origin:"*"
    }
));

app.use("/uploads", express.static("./public/uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

app.use(mainRoutes)

// Health Check Route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
