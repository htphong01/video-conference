const showPasswordIcon = document.querySelector('.show-password-icon');
const passwordInputELement = document.querySelector('#local-input-password');
const registerShowPasswordIcon = document.querySelector('.register-show-password-icon');
const registerPasswordInputELement = document.querySelector('#register-input-password');

showPasswordIcon.onclick = function() {
  if(this.classList.contains('fa-eye-slash')) {
    passwordInputELement.type = 'text';
  } else {
    passwordInputELement.type = 'password';
  }
  this.classList.toggle('fa-eye-slash')
}

registerShowPasswordIcon.onclick = function() {
  if(this.classList.contains('fa-eye-slash')) {
    registerPasswordInputELement.type = 'text';
  } else {
    registerPasswordInputELement.type = 'password';
  }
  this.classList.toggle('fa-eye-slash')
}