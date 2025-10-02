const MenuItem = require('../models/menuItem');
const Inventory = require('../models/inventoryModel'); // Make sure to import the Inventory model

// Controller to get all menu items
exports.getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({});
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching menu items", error: error.message });
  }
};

// Controller to create a new menu item and its corresponding inventory item
exports.createMenuItem = async (req, res) => {
  try {
    // 1. Create the menu item
    const menuItem = new MenuItem(req.body);
    await menuItem.save();

    // 2. Automatically create the corresponding inventory item with a default quantity
    const inventoryItem = new Inventory({
      itemName: menuItem.name,
      quantity: 5, // Default quantity as requested
      unit: 'servings'
    });
    await inventoryItem.save();

    res.status(201).json(menuItem);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: `An item with the name '${req.body.name}' already exists.` });
    }
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: Object.values(error.errors).map(e => e.message).join(', ') });
    }
    res.status(500).json({ message: "Error creating menu item", error: error.message });
  }
};

// Controller to update a menu item and its corresponding inventory item
exports.updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find the old menu item to get its original name
        const oldMenuItem = await MenuItem.findById(id);
        if (!oldMenuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        const oldName = oldMenuItem.name;

        // Update the menu item
        const updatedMenuItem = await MenuItem.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        // If the name was changed, update the corresponding inventory item's name
        if (req.body.name && req.body.name !== oldName) {
            await Inventory.findOneAndUpdate({ itemName: oldName }, { itemName: req.body.name });
        }

        res.status(200).json(updatedMenuItem);
    } catch (error) {
        res.status(400).json({ message: 'Error updating menu item', error: error.message });
    }
};

// Controller to delete a menu item and its corresponding inventory item
exports.deleteMenuItem = async (req, res) => {
    try {
        // 1. Delete the menu item
        const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        // 2. Automatically delete the corresponding inventory item
        await Inventory.findOneAndDelete({ itemName: menuItem.name });

        res.status(200).json({ message: 'Menu item and inventory item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting menu item', error: error.message });
    }
};
