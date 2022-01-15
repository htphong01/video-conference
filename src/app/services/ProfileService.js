const User = require('../models/User');

class ProfileService {

  getProfile(id) {
    
  }

  async update(id, data) {
    try {
      await User.findByIdAndUpdate(id, data);
      return { success: true };      
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

module.exports = new ProfileService();