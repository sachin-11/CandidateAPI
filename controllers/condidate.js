const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Candidate = require('../models/Candidate')

//desc  GET all Condidate
//@route GET /api/v1/
//@access Public

exports.getCandidates = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//desc  GET Single Candidate
//@route GET /api/v1/candidate/:id
//@access Public

exports.getCandidate = asyncHandler(async (req, res, next) => {
  const candidate = await Candidate.findById(req.params.id).populate('user');
  if (!candidate) {
    return next(
      new ErrorResponse(`Candidate not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: candidate });
});

//desc  create  new  candidate
//@route GET /api/v1/candidate
//@access Private

exports.createCandidate = asyncHandler(async (req, res, next) => {
  //Add user to req.body
  req.body.user = req.user.id;
  //Check for Create candidate
  const publishedCandidate = await Candidate.findOne({ user: req.user.id });
  //if user is not an admin , they can add one candidate
  if (publishedCandidate && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with id ${req.user.id} has already create candidate`,
        400
      )
    );
  }
  const candidate = await Candidate.create(req.body);
  res.status(200).json({ success: true, data: candidate });
});

//desc  update candidate
//@route GET /api/v1/candidate/:id
//@access Private

exports.updateCandidate = asyncHandler(async (req, res, next) => {
  let candidate = await Candidate.findById(req.params.id);
  if (!candidate) {
    return next(
      new ErrorResponse(`Candidate not found with id of ${req.params.id}`, 404)
    );
  }
  //Make sure user is candidate owner
  if (candidate.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update condidate`,
        401
      )
    );
  }

  candidate = await Candidate.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: candidate });
});

//desc  delete candidate
//@route GET /api/v1/candidate/:id
//@access Private

exports.deleteCandidate = asyncHandler(async (req, res, next) => {
  const candidate = await Candidate.findById(req.params.id);
  if (!candidate) {
    return next(
      new ErrorResponse(`Candidate not found with id of ${req.params.id}`, 404)
    );
  }

  //Make sure user is candidate owner
  if (candidate.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this candidate`,
        401
      )
    );
  }
  candidate.remove();
  res.status(200).json({ success: true, data: {} });
});

