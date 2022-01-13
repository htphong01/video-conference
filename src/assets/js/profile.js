const roomName = document.querySelectorAll('.room-name');
const inputChangeRoomName = document.querySelectorAll('.input-change-name-room');

roomName.forEach(room => {
  const roomId = room.getAttribute('data-id');
  room.onclick = () => {
    const selector = `#inputRoomName-${roomId}`;
    const input = document.querySelector(selector);
    if (input) {
      input.style.display = 'block';
      room.style.display = 'none';
      input.focus();
    }
  }
});

inputChangeRoomName.forEach(input => {
  const roomId = input.getAttribute('data-id');
  const selector = `#roomName-${roomId}`;
  const span = document.querySelector(selector);
  input.onfocusout = () => {
    if (span) {
      input.style.display = 'none';
      span.style.display = 'block';
    }
  }

  input.onkeyup = function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      if (span) {
        input.style.display = 'none';
        span.style.display = 'block';
      }
    }
  }
});