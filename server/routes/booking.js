const express = require('express');
const router = express.Router();
const { bookEvent, sendBookingOTP, getMyBookings, getAllBookings, confirmBooking, cancelBooking } = require('../controller/bookingController');
const { protect , admin } = require('../middlewares/auth');
const Booking = require('../models/Booking');

router.post('/', protect, bookEvent);
router.post('/send-otp', protect, sendBookingOTP);
router.get('/my', protect, getMyBookings);
router.get('/', protect, admin, getAllBookings);
router.put('/:id/confirm', protect,admin , confirmBooking);
router.delete('/:id', protect, admin, cancelBooking);


module.exports = router;