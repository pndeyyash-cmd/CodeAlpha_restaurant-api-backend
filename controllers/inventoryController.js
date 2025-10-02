const Inventory = require('../models/inventoryModel');

// GET /api/inventory - Get all inventory items
exports.getAllInventory = async (req, res) => {
  try {
    const items = await Inventory.find({});
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching inventory", error: error.message });
  }
};

// POST /api/inventory - Create a new inventory item
exports.createInventoryItem = async (req, res) => {
  try {
    const item = new Inventory(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: "Error creating inventory item", error: error.message });
  }
};

// PUT /api/inventory/:id - Update an inventory item
exports.updateInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!item) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ message: "Error updating inventory item", error: error.message });
  }
};

// DELETE /api/inventory/:id - Delete an inventory item
exports.deleteInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    res.status(200).json({ message: "Inventory item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting inventory item", error: error.message });
  }
};