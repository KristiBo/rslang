import './auth.css';
import state from '../../shared/state';
import Api from '../../shared/api';
import { TAuth } from '../../shared/types';
import { validateEmail, validatePassword, showErrMessage } from './authHelpers';

class Auth {
  api: Api;

  constructor() {
    this.api = new Api();
  }

  renderAuthPage(): string {
    const html = `
  <div class="sign-in">
        <h3 class="form__title" id="form__title">Login</h3>
        <form class="sign-in__form form" id="form">
            <label for="email" class="form__label">Email Address</label>
            <input type="email" class="form__input" name="email" placeholder="E-mail..." id="form__email" autocomplete="off">
            <label for="password" class="form__label">Password</label>
            <input type="password" class="form__input" name="password" placeholder="Password..." id="form__password" autocomplete="off">
            <div class="form__error-message" id="form__error">Password must contain at least 8 characters, at least one uppercase letter, one uppercase letter, one number and one special character from "+-_@$!%*?&amp;#.,;:[]{}]."</div>
            <input type="submit" class="button" value="Sign in" id="form__submit">
        </form>
        <button class="button button-small" id="form__change-btn">Don't have an account? Sign up</button>
    </div>`;
    return html;
  }

  listener(): void {
    const form = document.getElementById('form');
    form?.addEventListener('submit', (e) => {
      this.submit(e);
    });
    const changeFormBtn = document.getElementById('form__change-btn') as HTMLButtonElement;
    changeFormBtn?.addEventListener('click', this.changeFormAuth);
  }

  submit(e: Event) {
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
      showErrMessage('Password must contain at least 8 characters, at least one uppercase letter, one uppercase letter, one number and one special character from "+-_@$!%*?&amp;#.,;:[]{}].');
    }
    if (!validEmail) {
      showErrMessage('Incorrect Email');
    }

    if (validEmail && validPass) {
      if (state.isRegistrationPage) {
        this.api.createUser({ email, password })
          .then(() => this.api.loginUser({ email, password })
            .then((result) => this.setToLocalStorage(result)));
      } else {
        this.api.loginUser({ email, password })
          .then((result) => this.setToLocalStorage(result));
      }
    }
  }

  setToLocalStorage(content: TAuth): void {
    localStorage.setItem('token', JSON.stringify(content.token));
    localStorage.setItem('message', JSON.stringify(content.message));
    localStorage.setItem('userId', JSON.stringify(content.userId));
    localStorage.setItem('refreshToken', JSON.stringify(content.refreshToken));
  }

  removeFromLocalStorage(): void {
    localStorage.setItem('token', '');
    localStorage.setItem('message', 'Unauthorizated');
    localStorage.setItem('userId', '');
    localStorage.setItem('refreshToken', '');
  }

  changeFormAuth() {
    const errMsg = document.getElementById('form__error') as HTMLElement;
    errMsg.style.display = 'none';
    if (state.isRegistrationPage) {
      state.isRegistrationPage = false;
    } else {
      state.isRegistrationPage = true;
    }

    const title = document.getElementById('form__title') as HTMLElement;
    const button = document.getElementById('form__submit') as HTMLInputElement;
    const changeFormBtn = document.getElementById('form__change-btn') as HTMLButtonElement;
    if (state.isRegistrationPage) {
      title.innerText = 'Registration';
      button.value = 'Sign up';
      changeFormBtn.innerText = 'Do you have an account? Sign In';
    } else {
      title.innerText = 'Login';
      button.value = 'Sign in';
      changeFormBtn.innerText = "Don't have an account? Sign Up";
    }
  }
}

export default Auth;
