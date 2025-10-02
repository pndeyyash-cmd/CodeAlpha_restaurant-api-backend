const Reservation = require('../models/reservationModel');
const Table = require('../models/tableModel');

// Get all reservations
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({}).populate('tableId');
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reservations', error: error.message });
  }
};

// Create a new reservation with time-based conflict checking
exports.createReservation = async (req, res) => {
  try {
    const { customerName, customerPhone, reservationTime, tableId, partySize, durationHours } = req.body;

    if (!reservationTime || !tableId || !durationHours) {
      return res.status(400).json({ message: 'Missing required reservation details.' });
    }
    
    const startTime = new Date(reservationTime);
    const durationInMilliseconds = parseFloat(durationHours) * 60 * 60 * 1000;
    const endTime = new Date(startTime.getTime() + durationInMilliseconds);

    // Check for booking conflicts for the selected table
    const conflictingReservations = await Reservation.find({
      tableId: tableId,
      // Find any reservation that overlaps with the requested time window
      $or: [
        { reservationTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (conflictingReservations.length > 0) {
      // If a conflict is found, send a specific error message
      return res.status(409).json({ message: 'This table is already booked for the selected time. Please choose a different time or table.' });
    }

    // If no conflicts, create and save the new reservation
    const newReservation = new Reservation({
      customerName,
      customerPhone,
      reservationTime: startTime,
      endTime, // Save the calculated end time
      tableId,
      partySize
    });

    await newReservation.save();
    
    res.status(201).json(newReservation);

  } catch (error) {
    res.status(400).json({ message: 'Error creating reservation', error: error.message });
  }
};

// Delete/Cancel a reservation
exports.deleteReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndDelete(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }
        res.status(200).json({ message: 'Reservation cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling reservation', error: error.message });
    }
};

