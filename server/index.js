const express  = require('express');
const dotenv = require('dotenv');
const cors     = require('cors');
const mongoose  = require('mongoose');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/event');
const bookingRoutes = require('./routes/booking');



dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


//Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});