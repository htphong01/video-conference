import helpers from './helpers.js';

window.addEventListener('load', () => {

  //When the 'Create room" is button is clicked
  document
    .getElementById('create-room')
    .addEventListener('click', async (e) => {
      e.preventDefault();

      let roomName = document.querySelector('#room-name').value;
      let yourName = document.querySelector('#your-name').value;

      if (roomName && yourName) {
        //remove error message, if any
        document.querySelector('#err-msg').innerText = '';

        //save the user's name in sessionStorage
        sessionStorage.setItem('username', yourName);
        sessionStorage.setItem('roomName', roomName);

        //create room link
        // uuidv4() thư viện để random chuỗi id
        const roomId = uuid.v4();
        // ababababa
        let roomLink = `${location.origin}/meet?room=${roomId}`;
        // https://hp-video-conference.herokuapp.com/meet?room=ababababa
        const { data } = await axios.post('/meet', {
          roomId: roomId,
          roomName: roomName,
        });
        // kiểm tra thành công
        if (data.success) {
          window.location.replace(roomLink);
          document.querySelector('#room-name').value = '';
          document.querySelector('#your-name').value = '';
        }
      } else {
        document.querySelector('#err-msg').innerText =
          'All fields are required';
      }
    });

  //When the 'Enter room' button is clicked.
  document.getElementById('enter-room').addEventListener('click', (e) => {
    e.preventDefault();

    let name = document.querySelector('#username').value;

    if (name) {
      //remove error message, if any
      document.querySelector('#err-msg-username').innerText = '';

      //save the user's name in sessionStorage
      sessionStorage.setItem('username', name);

      //reload room
      const roomID = document.querySelector('#join-room-input-id').value;
      const url = `${location.origin}/meet?room=${roomID}`;
      location.replace(url);
    } else {
      document.querySelector('#err-msg-username').innerText =
        'Please input your name';
    }
  });

  document.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('expand-remote-video')) {
      helpers.maximiseStream(e);
    } else if (e.target && e.target.classList.contains('mute-remote-mic')) {
      helpers.singleStreamToggleMute(e);
    }
  });

  document.getElementById('closeModal').addEventListener('click', () => {
    helpers.toggleModal('recording-options-modal', false);
  });
});
