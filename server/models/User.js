const mongoose = require('mongoose');
const { Schema } = mongoose;
const { avatarSchema } = require('./Avatar');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5
  },
  avatar: avatarSchema,
  preferences: {
    colorTheme: {
      type: String,
      default: 'light'
    },
  },
  stats: {
    gamesPlayed: {
      type: Number, 
      default: 0
    },
    gamesWon: {
      type: Number,
      default: 0
    },
  },
  friends: [{
    userId: {
      type: Schema.Types.ObjectId, 
      ref: 'User'
  },
    firstName: String,
    lastName: String,
    email: String
  }],
  friendRequests: [{
    userId: {
      type: Schema.Types.ObjectId, 
      ref: 'User'
  },
    firstName: String,
    lastName: String,
    email: String
  }],
  
});

// set up pre-save middleware to create password
userSchema.pre('save', async function(next) {
  // if (this.isNew) {
  //   this.avatar.src = this._id.toString();
  // }

  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// compare the incoming password with the hashed password
userSchema.methods.isCorrectPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
