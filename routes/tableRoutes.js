const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');

// This route handles GET requests to fetch all tables and POST requests to create a new table.
router.route('/')
  .get(tableController.getAllTables)
  .post(tableController.createTable);

// This route handles DELETE requests to remove a specific table by its ID.
router.route('/:id').delete(tableController.deleteTable);

module.exports = router;
