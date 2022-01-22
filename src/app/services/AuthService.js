const User = require('../models/User');
const bcryptFunction = require('../helpers/bcrypt');

class AuthService {
  async createNewUser(displayName, email, password) {
    try {
      const data = await User.findOne({ email: email });
      const hashPassword = await bcryptFunction.hashPassword(password);
      if (data) return { success: false, message: 'Email is already in use!' };
      const user = await User.create({
        displayName,
        email,
        password: hashPassword,
      });
      user.password = undefined;
      return {
        success: true,
        message: 'Create new user successful',
        user,
      };
    } catch (error) {
      return {
        success: false,
        message: 'An error occurred please try again!',
        error,
      };
    }
  }

  async login(email, password) {
    try {
      const data = await User.findOne({ email: email });
      if (data) {
        const isValidPassword = await bcryptFunction.comparePassword(
          password,
          data.password
        );
        if (isValidPassword) {
          data.password = undefined;
          return { success: true, user: data };
        }
        return { success: false, message: 'Password is not correct!' };
      } else {
        return { success: false, message: 'User is not exist!' };
      }
    } catch (error) {
      return {
        success: false,
        message: 'An error occurred please try again',
        error,
      };
    }
  }
}

module.exports = new AuthService();
