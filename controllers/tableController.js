const Table = require('../models/table');

// GET /api/tables - Get all tables
exports.getAllTables = async (req, res) => {
  try {
    const tables = await Table.find({});
    res.status(200).json(tables);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tables", error: error.message });
  }
};

// POST /api/tables - Create a new table
exports.createTable = async (req, res) => {
  try {
    const table = new Table(req.body);
    await table.save();
    res.status(201).json(table);
  } catch (error) {
    res.status(400).json({ message: "Error creating table", error: error.message });
  }
};

// PUT /api/tables/:id - Update a table
exports.updateTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }
    res.status(200).json(table);
  } catch (error) {
    res.status(400).json({ message: "Error updating table", error: error.message });
  }
};

// DELETE /api/tables/:id - Delete a table
exports.deleteTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }
    res.status(200).json({ message: "Table deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting table", error: error.message });
  }
};