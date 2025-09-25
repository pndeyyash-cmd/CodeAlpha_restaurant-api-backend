const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');

// Routes for getting all tables and creating a new one
router.route('/')
  .get(tableController.getAllTables)
  .post(tableController.createTable);

// Routes for updating and deleting a single table by its ID
router.route('/:id')
  .put(tableController.updateTable)
  .delete(tableController.deleteTable);

module.exports = router;