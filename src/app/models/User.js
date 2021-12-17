const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  displayName: String,
  avatar: String,
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);