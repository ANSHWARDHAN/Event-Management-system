const Booking = require('../models/Booking');
const OTP = require('../models/OTP');
const Event = require('../models/Event');
const User = require('../models/User');
const { sendOTPEmail, sendBookingEmail } = require('../utils/email');

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.sendBookingOTP = async (req, res) => {
  try {
    const otp = generateOtp();
    

    await OTP.findOneAndDelete({
      email: req.user.email,
      action: 'event_booking',
    });

    await OTP.create({
      email: req.user.email,
      otp,
      action: 'event_booking',
    });

    await sendOTPEmail(req.user.email, otp, 'event_booking');

    res.json({
      message: 'OTP sent to your email for booking confirmation',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Book event for the users who want to book event
exports.bookEvent = async (req, res) => {
  try {
    const { eventId, otp } = req.body;

    const otpRecord = await OTP.findOne({
      email: req.user.email,
      otp,
      action: 'event_booking',
    });

    if (!otpRecord) {
      return res.status(400).json({
        message: 'Invalid or expired OTP',
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: 'Event not found',
      });
    }

    if (event.totalSeats <= 0) {
      return res.status(400).json({
        message: 'No seats available for this event',
      });
    }

    const existingBooking = await Booking.findOne({
      userId: req.user._id,
      eventId,
    });

    if (existingBooking) {
      return res.status(400).json({
        message: 'You have already booked this event',
      });
    }

    const booking = await Booking.create({
      userId: req.user._id,
      eventId: event._id,
      status: 'pending',
      paymentStatus: 'not_paid',
      amount: event.ticketPrice,
    });

    await OTP.findOneAndDelete({
      email: req.user.email,
      otp,
      action: 'event_booking',
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Confirm booking (admin) logic for the confirm booking
exports.confirmBooking = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    if (!['paid', 'not_paid'].includes(paymentStatus)) {
      return res.status(400).json({
        message: 'Invalid payment status',
      });
    }

    const booking = await Booking.findById(req.params.id)
      .populate('eventId')
      .populate('userId');

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found',
      });
    }

    if (booking.status === 'confirmed') {
      return res.status(400).json({
        message: 'Booking is already confirmed',
      });
    }

    const event = await Event.findById(booking.eventId);

    if (!event || event.availableSeats <= 0) {
      return res.status(400).json({
        message: 'No seats available',
      });
    }

    booking.status = 'confirmed';
    booking.paymentStatus = paymentStatus;

    await booking.save();

    event.totalSeats -= 1;
    event.availableSeats -= 1;

    await event.save();

    await sendBookingEmail(
      booking.userId.email,
      event.title,
      booking._id
    );

    res.json({
      message: 'Booking confirmed successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get logged-in user's bookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user._id,
    }).populate('eventId');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings (admin)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId')
      .populate('eventId');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel booking logic 
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('eventId');

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found',
      });
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'You are not authorized to cancel this booking',
      });
    }

    const wasConfirmed = booking.status === 'confirmed';

    booking.status = 'cancelled';
    await booking.save();

    if (wasConfirmed) {
      const event = await Event.findById(booking.eventId);

      if (event) {
        event.totalSeats += 1;
        event.availableSeats += 1;
        await event.save();
      }
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Booking cancelled successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
