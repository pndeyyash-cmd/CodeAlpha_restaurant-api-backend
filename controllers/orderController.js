const Order = require('../models/order');
const MenuItem = require('../models/menuItem');
const Inventory = require('../models/inventory'); // We need this to update stock

// GET /api/orders - Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('tableId')
      .populate('items.menuItemId');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

// POST /api/orders - Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { tableId, items } = req.body; // items is an array: [{ menuItemId: "...", quantity: 2 }, ...]

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must contain at least one item." });
    }

    let totalAmount = 0;
    const itemIds = items.map(item => item.menuItemId);

    // Fetch all menu items at once for efficiency
    const menuItems = await MenuItem.find({ '_id': { $in: itemIds } });

    // --- Business Logic: Calculate total and check inventory ---
    for (const orderItem of items) {
      const menuItem = menuItems.find(m => m._id.toString() === orderItem.menuItemId);
      if (!menuItem) {
        return res.status(404).json({ message: `Menu item with ID ${orderItem.menuItemId} not found.` });
      }

      // Add to total amount
      totalAmount += menuItem.price * orderItem.quantity;

      // TODO: In a real-world app, you would have a recipe mapping menu items to inventory items.
      // For this project, we'll assume a 1-to-1 mapping.
      // e.g., ordering a "Pizza Dough" menu item reduces the "Pizza Dough" inventory item.
      const inventoryItem = await Inventory.findOne({ itemName: menuItem.name });
      if (inventoryItem) {
        if (inventoryItem.quantity < orderItem.quantity) {
          return res.status(400).json({ message: `Not enough stock for ${menuItem.name}. Only ${inventoryItem.quantity} left.` });
        }
        // Decrement the stock
        inventoryItem.quantity -= orderItem.quantity;
        await inventoryItem.save();
      }
    }

    // If all checks pass, create the new order
    const newOrder = new Order({
      tableId,
      items,
      totalAmount
    });

    await newOrder.save();
    res.status(201).json(newOrder);

  } catch (error) {
    res.status(400).json({ message: "Error creating order", error: error.message });
  }
};