const express = require('express');
const {
  createCandidate,
  getCandidate,
  getCandidates,
  updateCandidate,
  deleteCandidate
} = require('../controllers/condidate');

const Candidate = require('../models/Candidate');
const advancedResults = require('../middleware/advancedResults');


const router = express.Router();

const { protect, authorize } = require('../middleware/auth');


router
  .route('/')
  .get(advancedResults(Candidate, 'Candidate'), getCandidates)
  .post(protect, authorize('publisher', 'admin'), createCandidate);

router
  .route('/:id')
  .get(getCandidate)
  .put(protect, authorize('publisher', 'admin'), updateCandidate)
  .delete(protect, authorize('publisher', 'admin'), deleteCandidate);

module.exports = router;
