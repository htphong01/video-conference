const CLOUDINARY_API = 'https://api.cloudinary.com/v1_1/htphong02/upload';
const CLOUDINARY_UPLOAD_PRESET = 'q64yqoyh';
const CLOUDINARY_FOLDER = 'Video Conference';
const roomName = document.querySelectorAll('.room-name');
const inputChangeRoomName = document.querySelectorAll(
  '.input-change-name-room'
);
const inputChangeAvatar = document.querySelector('#user-avatar-input');
let meetId = "";

roomName.forEach((room) => {
  const roomId = room.getAttribute('data-id');
  room.onclick = () => {
    const selector = `#inputRoomName-${roomId}`;
    const input = document.querySelector(selector);
    if (input) {
      input.style.display = 'block';
      room.style.display = 'none';
      input.focus();
    }
  };
});

inputChangeRoomName.forEach((input) => {
  const roomId = input.getAttribute('data-id');
  const selector = `#roomName-${roomId}`;
  const span = document.querySelector(selector);
  input.onfocusout = () => {
    if (span) {
      input.style.display = 'none';
      span.style.display = 'block';
    }
  };

  input.onkeyup = async function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      if (span) {
        input.style.display = 'none';
        span.style.display = 'block';
        const roomName = input.value;
        span.innerHTML = roomName;
        input.value = roomName;
        axios.put('/meet', {
          roomId,
          roomName,
        });
      }
    }
  };
});

inputChangeAvatar.onchange = async function (e) {
  e.preventDefault();
  try {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', CLOUDINARY_FOLDER);
    const { data } = await axios.post(CLOUDINARY_API, formData, {
      headers: { 'Content-type': 'multipart/form-data' },
    });
    if (data?.secure_url) {
      document.querySelector('.img-avatar').src = data.secure_url;
      const { data: result } = await axios.put('/profile', {
        avatar: data.secure_url,
      });
    }
  } catch (error) {}
};

$('.delete-btn').on('click', function () {
  meetId = $(this).data('id');
  $('#modalBtn').click();
})

document.querySelector('#deleteModalBtn').onclick = async () => {
  const url = `/meet/${meetId}`;
  axios.delete(url);
  window.location.reload();
}
