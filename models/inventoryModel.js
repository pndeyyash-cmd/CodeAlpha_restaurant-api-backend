const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, 'Inventory item must have a name.'],
    unique: true,
  },
  quantity: {
    type: Number,
    required: [true, 'Inventory item must have a quantity.'],
    default: 0,
  },
  unit: {
    type: String,
    required: [true, 'Inventory item must have a unit.'],
    // This enum fixes the error by allowing 'servings'
    enum: ['kg', 'liters', 'pieces', 'servings'],
  },
}, { timestamps: true });

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
