const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required.'],
  },
  customerPhone: {
    type: String,
    required: [true, 'Customer phone number is required.'],
  },
  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: [true, 'Table ID is required.'],
  },
  partySize: {
    type: Number,
    required: [true, 'Party size is required.'],
  },
  // The start time of the reservation
  reservationTime: {
    type: Date,
    required: [true, 'Reservation time is required.'],
  },
  // The calculated end time of the reservation
  endTime: {
    type: Date,
    required: [true, 'Reservation end time is required.'],
  },
}, { timestamps: true });

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;