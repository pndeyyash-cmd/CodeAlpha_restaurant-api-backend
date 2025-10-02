const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
    required: [true, 'A table must have a number.'],
    unique: true,
  },
  capacity: {
    type: Number,
    required: [true, 'A table must have a capacity.'],
  },
  isOccupied: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Table = mongoose.model('Table', tableSchema);

module.exports = Table;
