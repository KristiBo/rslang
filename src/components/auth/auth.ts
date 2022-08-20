import './auth.css';
import state from '../../shared/state';
import Api from '../../shared/api';
import { validateEmail, validatePassword, showErrMessage } from './authHelpers';

class Auth {
  api: Api;

  errMsg: HTMLElement;

  constructor() {
    this.api = new Api();
    this.errMsg = document.getElementById('form__error') as HTMLElement;
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
    const changeFormBtn = document.getElementById('form__change-btn');
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
    input.forEach((elem) => {
      elem.addEventListener('focusin', () => {
        this.errMsg.style.display = 'none';
      });
    });
    if (!validPass) {
      showErrMessage('Password must contain at least 8 characters, at least one uppercase letter, one uppercase letter, one number and one special character from "+-_@$!%*?&amp;#.,;:[]{}].');
    }
    if (!validEmail) {
      showErrMessage('Incorrect Email');
    }
    if (validEmail && validPass && state.isRegistrationPage) {
      this.api.createUser({ email, password });
    } else {
      this.api.loginUser({ email, password });
    }
  }

  changeFormAuth() {
    if (state.isRegistrationPage) {
      state.isRegistrationPage = false;
    } else {
      state.isRegistrationPage = true;
    }
    const title = document.getElementById('form__title') as HTMLElement;
    if (state.isRegistrationPage) {
      title.innerText = 'Registration';
    } else {
      title.innerText = 'Login';
    }
  }
}

export default Auth;
