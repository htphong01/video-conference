const tabLinks = document.querySelectorAll('.tablinks');
tabLinks.forEach((tabLink, index) => {
  tabLink.addEventListener('click', function () {
    if (index === 0) {
      tabLinks[1].classList.remove('active');
      tabLink.classList.add('active');
      document.querySelector('#room-create').style.display = 'block';
      document.querySelector('#username-set').style.display = 'none';
    } else {
      tabLinks[0].classList.remove('active');
      tabLink.classList.add('active');
      document.querySelector('#room-create').style.display = 'none';
      document.querySelector('#username-set').style.display = 'block';
    }
  })
});

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
document.querySelector('#join-room-input-id').value = params.room || '';