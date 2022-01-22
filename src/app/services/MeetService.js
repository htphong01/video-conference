const Meet = require('../models/Meet');
const { sendInviteEmail } = require('../helpers/sendEmail');

class MeetService {
  async createNewMeet(data) {
    try {
      await Meet.create(data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async findRoomByRoomId(id) {
    try {
      const data = await Meet.findOne({ roomId: id });
      if (data) return { success: true, room: data };
      return { success: false, message: 'Not found' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async invite({ email, url }) {
    try {
      await sendInviteEmail(email, url);
      return {
        success: true,
        message: 'Email has been sent!',
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: 'An error has occurred. Please try again!',
      };
    }
  }

  async checkOwner({ roomId, creator }) {
    try {
      const data = await Meet.findOne({ roomId, creator });
      if (data) return { success: true };
      return { success: false };
    } catch (err) {
      return {
        success: false,
        message: 'An error has occurred. Please try again!',
      };
    }
  }

  async getAllMeetOfUser(creator) {
    try {
      const data = await Meet.find({ creator });
      return { success: true, meets: data };
    } catch (error) {
      console.log('get all meet of users: ', error);
      return {
        success: false,
        message: 'An error has occurred. Please try again!',
      };
    }
  }

  async update(userId, { roomId, ...data }) {
    try {
      const meet = await Meet.findOneAndUpdate(
        { creator: userId, roomId },
        data
      );
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: 'An error has occurred. Please try again!',
        error,
      };
    }
  }

  async deleteMeet(id) {
    try {
      await Meet.deleteOne({ _id: id });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }
}

module.exports = new MeetService();
