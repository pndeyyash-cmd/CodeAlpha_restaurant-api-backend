const Table = require('../models/tableModel');
const Reservation = require('../models/reservationModel'); // Import Reservation model to check for active bookings

// Get all tables
exports.getAllTables = async (req, res) => {
  try {
    const tables = await Table.find({}).sort({ tableNumber: 1 }); // Sort by table number
    res.status(200).json(tables);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tables', error: error.message });
  }
};

// Create a new table
exports.createTable = async (req, res) => {
  try {
    const table = new Table(req.body);
    await table.save();
    res.status(201).json(table);
  } catch (error) {
    if (error.code === 11000) {
        return res.status(409).json({ message: `A table with number '${req.body.tableNumber}' already exists.` });
    }
    res.status(400).json({ message: 'Error creating table', error: error.message });
  }
};

// Delete a table
exports.deleteTable = async (req, res) => {
    try {
        const tableId = req.params.id;

        // Safety Check: See if there are any active reservations for this table
        const activeReservations = await Reservation.find({
            tableId: tableId,
            endTime: { $gt: new Date() } // Check if reservation end time is in the future
        });

        if (activeReservations.length > 0) {
            return res.status(400).json({ message: 'Cannot delete table with active reservations. Please cancel the reservations first.' });
        }

        const table = await Table.findByIdAndDelete(tableId);
        if (!table) {
            return res.status(404).json({ message: 'Table not found' });
        }
        res.status(200).json({ message: 'Table deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting table', error: error.message });
    }
};
