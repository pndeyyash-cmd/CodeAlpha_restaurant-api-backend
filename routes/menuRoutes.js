const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Routes for getting all items and creating a new one
router.route('/')
  .get(menuController.getAllMenuItems)
  .post(menuController.createMenuItem);

// Routes for updating and deleting a single item by its ID
router.route('/:id')
  .put(menuController.updateMenuItem)
  .delete(menuController.deleteMenuItem);

module.exports = router;