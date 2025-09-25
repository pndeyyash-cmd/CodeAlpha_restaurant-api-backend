const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Routes for getting all items and creating a new one
router.route('/')
  .get(inventoryController.getAllInventory)
  .post(inventoryController.createInventoryItem);

// Routes for updating and deleting a single item by its ID
router.route('/:id')
  .put(inventoryController.updateInventoryItem)
  .delete(inventoryController.deleteInventoryItem);

module.exports = router;