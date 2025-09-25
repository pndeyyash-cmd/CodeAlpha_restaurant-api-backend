const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'g', 'liters', 'ml', 'units']
  }
});

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;