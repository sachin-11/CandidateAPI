const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const { generateToken } = require('../utils/generateToken')

//@desc Register user
//@route POST /api/v1/auth/register
//@access public

exports.register = asyncHandler(async (req, res, next) => {
  const {
     name,
     email,
     password,
      role,
      title,
      fullName,
      country,
      state,
      town,
      mobileNumber,
      totalExperience,
      keySkills
      } = req.body;

  //create user
  const user = await User.create({
    name,
     email,
     password,
      role,
      title,
      fullName,
      country,
      state,
      town,
      mobileNumber,
      totalExperience,
      keySkills
  });

  if(user){
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role:  user.role,
      title:   user.title,
      fullName: user.fullName,
      country: user.country,
      state: user.state,
      town: user.town,
      mobileNumber: user.mobileNumber,
      totalExperience: user.totalExperience,
      keySkills: user.keySkills,
      token: generateToken(user._id)

    })
  } else {
    res.status(400).json({
      success: false,
      msg: 'Unable to Register'
    })
  }

});

//@desc Login user
//@route POST /api/v1/auth/login
//@access private

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //validate email and password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  //check user exists
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  //check if password is correct
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create Token
  const token = user.getSignJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};

//@desc Get looged in user
//@route POST /api/v1/auth/me
//@access private

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});
