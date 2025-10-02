const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// This handles GET (all reservations) and POST (create reservation) requests
router.route('/')
  .get(reservationController.getAllReservations)
  .post(reservationController.createReservation);

// --- NEW: This line adds the missing route to handle canceling a reservation ---
router.route('/:id').delete(reservationController.deleteReservation);

module.exports = router;
