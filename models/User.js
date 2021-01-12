const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  title: {
    type: String,
    required: [true, 'Please add a Title']
  },
  fullName: {
    type: String,
    required: [true, 'Please add a Full Name']
  },
  country: {
    type: String,
    required: [true, 'Please add a Country']
  },
  dateOfBirth: {
     type: Date 
    },
    state: {
      type: String,
      required: [true, 'Please add a state']
    },
    town: {
      type: String,
      required: [true, 'Please add a Town']
    }, 
  role: {
    type: String,
    enum: ['user', 'publisher', 'admin'],
    default: 'user',
  },
  mobileNumber: {
    type: String,
    required: [true, 'Please add a Phone']
  },
  totalExperience: {
    type: Number,
    required: [true, 'Please add a Experience']
  },
  keySkills: {
    type: String,
    required: [true, 'Please add a key Skills']
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//Encrypt password using bcrypt

UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//sign  jwt and return

UserSchema.methods.getSignJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//match user entered password to hash password in database

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
