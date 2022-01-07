const tabLinks = document.querySelectorAll('.tablinks');
const interactionCloseBtn = document.querySelector('.body-interaction-close-btn');
const bodyInteraction = document.querySelector('.body-interaction');
const interactionControlBtn = document.querySelectorAll('.room-interact-control-item');
const searchPeopleInput = document.querySelector('.interaction-people-search-block > input');
const interactionTitle = document.querySelector('.body-interaction-title');
const bodyInteractionItem = document.querySelectorAll('.body-interaction-content');
const mainSection = document.querySelector('#main-section')

let isBodyInteractionActive = false;

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

interactionCloseBtn.onclick = closeBodyInteraction.bind(interactionCloseBtn);
bodyInteraction.style.display = 'none';

function closeBodyInteraction() {
  mainSection.classList.add('col-md-12');
  removeInteractControl();
  bodyInteraction.classList.add('close');
  isBodyInteractionActive = false;
  setTimeout(function () {
    bodyInteraction.style.display = 'none';
  }, 100)
}

interactionControlBtn.forEach((interactBtn, index) => {
  interactBtn.onclick = function () {

    switch (index) {
      case 0:
        renderInteractionBody('details');
        console.log(index);
        break;
      case 1:
        renderInteractionBody('people');
        break;
      case 2:
        renderInteractionBody('chatting');
        break;
      case 3:
        renderInteractionBody('activity');
        break;
    }

    bodyInteractionItem[index].classList.remove('body-interaction-content');

    if (isBodyInteractionActive) {
      if (this.classList.contains('active')) {
        closeBodyInteraction();
        removeInteractControl();
      } else {
        isBodyInteractionActive = true;
        removeInteractControl();
        this.classList.add('active');
        mainSection.classList.remove('col-md-12');
        // render body interaction
      }
    } else {
      isBodyInteractionActive = true;
      this.classList.add('active');
      bodyInteraction.classList.remove('close');
      bodyInteraction.style.display = 'flex';
      mainSection.classList.remove('col-md-12');
    }
  }
})

function removeInteractControl() {
  interactionControlBtn.forEach(item => item.classList.remove('active'));
}

searchPeopleInput.onfocus = function () {
  this.parentElement.classList.add('focus');
}

searchPeopleInput.addEventListener('focusout', function () {
  this.parentElement.classList.remove('focus');
})

function renderInteractionBody(type) {
  switch (type) {
    case 'details': {
      interactionTitle.innerHTML = 'Meeting details';
      hideAllInteractionBody();

      break;
    }
    case 'people': {
      interactionTitle.innerHTML = 'People';
      hideAllInteractionBody();
      break;
    }
    case 'chatting': {
      interactionTitle.innerHTML = 'Chat';
      hideAllInteractionBody();
      break;
    }
    case 'activity': {
      interactionTitle.innerHTML = 'Activity';
      hideAllInteractionBody();
      break;
    }
  }
}

function hideAllInteractionBody() {
  bodyInteractionItem.forEach(item => {
    if (!item.classList.contains('body-interaction-content')) {
      item.classList.add('body-interaction-content');
    }
  })
}

const time = (new Date()).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
document.querySelector('.time-web-room').textContent = time;

const linkRoom = document.querySelector('.interaction-info-link');
linkRoom.innerHTML = window.location.href;

const copyLinkBtn = document.querySelector('.interaction-info-copy-link-btn');
copyLinkBtn.onclick = () => {
  navigator.clipboard.writeText(window.location.href);

  var tooltip = document.getElementById("myTooltip");
  tooltip.innerHTML = "Copied to clipboard";
  setTimeout(() => {
    tooltip.innerHTML = "Copy to clipboard";
  }, 1000);
}

