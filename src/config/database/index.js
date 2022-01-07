const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect(
      'mongodb+srv://root:root@cluster0.hs5et.mongodb.net/video-conference?retryWrites=true&w=majority'
    );
    console.log('Connect successfully!!');
  } catch (error) {
    console.log('Connect failed!!');
  }
}

module.exports = { connect };
