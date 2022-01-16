const mongoose = require('mongoose');
const { Schema } = mongoose;

const MeetSchema = new Schema(
  {
    roomId: { type: String, required: true },
    roomName: { type: String, required: true, default: 'Online meeting' },
    password: { type: String },
    creator: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Meet', MeetSchema);
