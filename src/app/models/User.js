const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    displayName: { type: String },
    avatar: {
      type: String,
      default:
        'https://www.cppng.com/file/download/2020-06/66726-customer-account-google-service-button-search-logo.png',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', UserSchema);
