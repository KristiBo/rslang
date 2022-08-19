import { loginUser } from './auth';
import authState from './authState';

function validateEmail(email: string) {
  // eslint-disable-next-line no-useless-escape
  const reg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return reg.test(email);
}

function validatePassword(password: string) {
  const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{5,}$/;
  return reg.test(password);
}

function submit(e: Event) {
  e.preventDefault();
  const target = e.target as HTMLFormElement;
  const list = target.elements;
  const email = (list[0] as HTMLInputElement).value;
  const password = (list[1] as HTMLInputElement).value;
  const validEmail = validateEmail(email);
  const validPass = validatePassword(password);
  const input = document.querySelectorAll('.form__input');
  const errMsg = document.getElementById('form__error') as HTMLElement;
  input.forEach((elem) => {
    elem.addEventListener('focusin', () => {
      errMsg.style.display = 'none';
    });
  });
  if (!validPass) {
    errMsg.innerText = 'Password must contain at least 8 characters, at least one uppercase letter, one uppercase letter, one number and one special character from "+-_@$!%*?&amp;#.,;:[]{}].';
    errMsg.style.display = 'block';
  }
  if (!validEmail) {
    errMsg.innerText = 'Incorrect Email';
    errMsg.style.display = 'block';
  }
  if (validEmail && validPass) {
    loginUser({ email, password });
  }
}

function changeFormAuth() {
  if (authState.isRegistrationPage) {
    authState.isRegistrationPage = false;
  } else {
    authState.isRegistrationPage = true;
  }
  const title = document.getElementById('form__title') as HTMLElement;
  if (authState.isRegistrationPage) {
    title.innerText = 'Registration';
  } else {
    title.innerText = 'Login';
  }
}

// eslint-disable-next-line import/prefer-default-export
export { submit, changeFormAuth };
