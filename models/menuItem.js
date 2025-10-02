const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A menu item must have a name.'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'A menu item must have a description.'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'A menu item must have a price.'],
  },
  category: {
    type: String,
    required: [true, 'A menu item must have a category.'],
    // This enum fixes the error by allowing these specific values
    enum: ['Appetizers', 'Main Course', 'Beverages'],
  },
}, { timestamps: true });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;