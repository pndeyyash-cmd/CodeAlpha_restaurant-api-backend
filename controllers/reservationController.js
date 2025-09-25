const Reservation = require('../models/reservation');
const Table = require('../models/table'); // We need the Table model to check capacity

// GET /api/reservations - Get all reservations
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({}).populate('tableId');
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reservations", error: error.message });
  }
};

// POST /api/reservations - Create a new reservation
exports.createReservation = async (req, res) => {
  try {
    const { tableId, reservationTime, numberOfGuests } = req.body;

    // Find the requested table to check its capacity
    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }
    if (table.capacity < numberOfGuests) {
      return res.status(400).json({ message: `Table capacity is ${table.capacity}, but ${numberOfGuests} guests were requested.` });
    }

    // --- Business Logic: Check for conflicting reservations ---
    // Define a time window for the check (e.g., 2 hours)
    const requestedTime = new Date(reservationTime);
    const twoHoursBefore = new Date(requestedTime.getTime() - 2 * 60 * 60 * 1000);
    const twoHoursAfter = new Date(requestedTime.getTime() + 2 * 60 * 60 * 1000);

    const conflictingReservation = await Reservation.findOne({
      tableId: tableId,
      status: 'confirmed',
      reservationTime: {
        $gte: twoHoursBefore, // Greater than or equal to 2 hours before
        $lt: twoHoursAfter    // Less than 2 hours after
      }
    });

    if (conflictingReservation) {
      return res.status(400).json({ message: "Table is already booked around this time. Please choose another time." });
    }

    // If no conflicts, create and save the new reservation
    const reservation = new Reservation(req.body);
    await reservation.save();
    res.status(201).json(reservation);

  } catch (error) {
    res.status(400).json({ message: "Error creating reservation", error: error.message });
  }
};