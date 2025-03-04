const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  place: {type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  checkIn: {type: Date, required: true},
  checkOut: {type: Date, required: true},
  guests: Number,
  price: Number,
  name: String,
  phone: String
});

const BookingModel = mongoose.model('Booking', bookingSchema);

module.exports = BookingModel;