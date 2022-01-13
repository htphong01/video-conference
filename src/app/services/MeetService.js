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
      const data = await Meet.findOne({roomId: id});
      if(data) return { success: true, room: data }
      return { success: false, message: 'Not found' }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async invite({ email, url }) {
    try {
      await sendInviteEmail(email, url);
      return ({
        success: true,
        message: "Email has been sent!",
      });
    } catch (error) {
      console.log(error)
      return ({
        success: false,
        message: "An error has occurred. Please try again!",
      });
    }
  }

  async checkOwner({ roomId, creator }) {
    try {
      const data = await Meet.findOne({roomId, creator});
      if(data) return { success: true }
      return { success: false }
    } catch (err) {
      return ({
        success: false,
        message: "An error has occurred. Please try again!",
      });
    }
  }

}

module.exports = new MeetService();
