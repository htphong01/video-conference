const rooms = {

}

const users = {

}

const stream = (socket) => {
  socket.on('ready', ({ room, socketId }) => {
    if (socket.adapter.rooms[room] && socket.adapter.rooms[room].length === 20) {
      socket.emit('roomStatus', { isFull: true, length: socket.adapter.rooms[room].length });
    } else {
      socket.emit('roomStatus', { isFull: false, length: 0 });
    }
  });

  socket.on('subscribe', (data) => {
    //subscribe/join a room
    socket.join(data.room);
    socket.join(data.socketId);

    users[data.socketId] = data.room;
    if (!rooms[data.room]) rooms[data.room] = {};
    rooms[data.room][data.socketId] = data.info;

    socket.to(data.room).emit('usersInRoom', rooms[data.room]);
    socket.emit('usersInRoom', rooms[data.room]);

    //Inform other members in the room of new user's arrival
    if (socket.adapter.rooms[data.room].length > 1) {
      socket.to(data.room).emit('new user', { socketId: data.socketId, username: data?.info?.username || "" });
    }
  });

  socket.on('newUserStart', (data) => {
    socket.to(data.to).emit('newUserStart', { sender: data.sender, username: data.username });
  });

  socket.on('sdp', (data) => {
    socket.to(data.to).emit('sdp', {
      description: data.description,
      sender: data.sender,
    });
  });

  socket.on('ice candidates', (data) => {
    socket.to(data.to).emit('ice candidates', {
      candidate: data.candidate,
      sender: data.sender,
    });
  });

  socket.on('chat', (data) => {
    socket.to(data.room).emit('chat', {
      sender: data.sender,
      msg: data.msg,
      type: data.type,
    });
  });

  socket.on('disconnect', () => {
    const socketId = socket.id.substring(8);
    const roomId = users[socketId];
    if (roomId) {
      if (rooms[roomId][socketId]) {
        delete rooms[roomId][socketId];
      }
      socket.to(roomId).emit('usersInRoom', rooms[roomId]);
    }
  });

  socket.on('rename', data => {
    const socketId = socket.id.substring(8);
    const roomId = users[socketId];
    if (roomId) {
      if (rooms[roomId][socketId]) {
        rooms[roomId][socketId]['username'] = data.username;
      }
      socket.to(roomId).emit('usersInRoom', rooms[roomId]);
      socket.emit('usersInRoom', rooms[data.room]);
    }
  });

  socket.on('mute', ({ to }) => {
    socket.to(to).emit('mute', to);
  });

  socket.on('drawing', ({ room, ...data }) => {
    socket.to(room).emit('drawing', data);
  });
};

module.exports = stream;
