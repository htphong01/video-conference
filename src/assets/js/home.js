const showPasswordIcon = document.querySelector('.show-password-icon');
const passwordInputELement = document.querySelector('#local-input-password');
const registerShowPasswordIcon = document.querySelector('.register-show-password-icon');
const registerPasswordInputELement = document.querySelector('#register-input-password');
const loginForm = document.querySelector('#login-form-id');
const registerForm = document.querySelector('#register-form-id');

const activeErrorToast = () => {
  $('.toast').show();
  setTimeout(() => {
    $('.toast').hide();
  }, 2000);
}

showPasswordIcon.onclick = function () {
  if (this.classList.contains('fa-eye-slash')) {
    passwordInputELement.type = 'text';
  } else {
    passwordInputELement.type = 'password';
  }
  this.classList.toggle('fa-eye-slash')
}

registerShowPasswordIcon.onclick = function () {
  if (this.classList.contains('fa-eye-slash')) {
    registerPasswordInputELement.type = 'text';
  } else {
    registerPasswordInputELement.type = 'password';
  }
  this.classList.toggle('fa-eye-slash')
}

registerForm.onsubmit = async function (e) {
  try {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const displayName = e.target.displayName.value;
    const { data } = await axios.post('/auth/register', {
      displayName,
      email,
      password
    })
    if (data.success) {
      $('.success-toast').show();
      setTimeout(() => {
        $('.success-toast').hide();
        window.location.replace('/meet');
      }, 1500);
    } else if (data.error) {
      $('.register-error > span').text('An error occurred please try again')
      $('.register-error').show();
    } else {
      $('.register-error > span').text(data.message)
      $('.register-error').show();
    }
  } catch (e) {
    $('.register-error > span').text('An error occurred please try again')
    $('.register-error').show();
  }
}

loginForm.onsubmit = async function (e) {
  try {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const { data } = await axios.post('/auth/login', {
      email,
      password
    })
    if (data.success) {
      window.location.replace('/meet');
    } else if (data.error) {
      activeErrorToast();
    } else {
      $('.login-error > span').text(data.message)
      $('.login-error').show();
    }

  } catch (e) {
    activeErrorToast();
  }
}