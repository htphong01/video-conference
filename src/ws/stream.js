const rooms = {

}

const stream = (socket) => {
  socket.on('ready', ({ room, socketId }) => {
    console.log(socketId);
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

    //Inform other members in the room of new user's arrival
    if (socket.adapter.rooms[data.room].length > 1) {
      socket.to(data.room).emit('new user', { socketId: data.socketId });
    }
  });

  socket.on('newUserStart', (data) => {
    socket.to(data.to).emit('newUserStart', { sender: data.sender });
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

  socket.on('drawing', ({ room, ...data }) => {
    socket.to(room).emit('drawing', data);
  });
};

module.exports = stream;
