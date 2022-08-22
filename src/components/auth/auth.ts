import './auth.css';
import isEmail from 'validator/lib/isEmail';
import isStrongPassword from 'validator/lib/isStrongPassword';
import Api from '../../shared/api';
import { TAuth } from '../../shared/types';

class Auth {
  api: Api;

  isRegistrationPage = false;

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

  addListeners(): void {
    const form = document.getElementById('form');
    form?.addEventListener('submit', (e) => {
      this.submitForm(e);
    });
    const changeFormBtn = document.getElementById('form__change-btn') as HTMLButtonElement;
    changeFormBtn?.addEventListener('click', this.changeFormAuth);
  }

  submitForm(e: Event): void {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const formInputs = target.elements;
    const email = (formInputs[0] as HTMLInputElement).value;
    const password = (formInputs[1] as HTMLInputElement).value;

    const input = document.querySelectorAll('.form__input');
    const errMsg = document.getElementById('form__error') as HTMLElement;
    input.forEach((elem) => {
      elem.addEventListener('focusin', () => {
        errMsg.style.display = 'none';
      });
    });

    if (!isStrongPassword(password)) {
      this.showErrMessage('Password must contain at least 8 characters, at least one uppercase letter, one uppercase letter, one number and one special character from "+-_@$!%*?&amp;#.,;:[]{}].');
    }
    if (!isEmail(email)) {
      this.showErrMessage('Incorrect Email');
    }
    if (isEmail(email) && isStrongPassword(password)) {
      if (!this.isRegistrationPage) {
        this.api.createUser({ email, password })
          .then(() => this.api.loginUser({ email, password })
            .then((result) => this.setToLocalStorage(result)))
          .catch((err) => {
            this.showErrMessage('Error: User already exist');
            throw new Error(`Create user: ${err}`);
          });
      } else {
        this.api.loginUser({ email, password })
          .then((result) => this.setToLocalStorage(result))
          .catch((err) => {
            this.showErrMessage('Error: Incorrect email or password');
            throw new Error(`Login user: ${err}`);
          });
      }
    }
  }

  setToLocalStorage(content: TAuth): void {
    const time = new Date();
    localStorage.setItem('time', JSON.stringify(time));
    localStorage.setItem('token', JSON.stringify(content.token));
    localStorage.setItem('userId', JSON.stringify(content.userId));
    localStorage.setItem('refreshToken', JSON.stringify(content.refreshToken));
  }

  removeFromLocalStorage(): void {
    localStorage.setItem('time', '');
    localStorage.setItem('token', '');
    localStorage.setItem('userId', '');
    localStorage.setItem('refreshToken', '');
  }

  changeFormAuth(): void {
    console.log(9887765, this.isRegistrationPage);
    const errMsg = document.getElementById('form__error') as HTMLElement;
    errMsg.style.display = 'none';
    this.isRegistrationPage = !this.isRegistrationPage;

    const title = document.getElementById('form__title') as HTMLElement;
    const button = document.getElementById('form__submit') as HTMLInputElement;
    const changeFormBtn = document.getElementById('form__change-btn') as HTMLButtonElement;
    if (this.isRegistrationPage) {
      title.innerText = 'Registration';
      button.value = 'Sign up';
      changeFormBtn.innerText = 'Do you have an account? Sign In';
    } else {
      title.innerText = 'Login';
      button.value = 'Sign in';
      changeFormBtn.innerText = "Don't have an account? Sign Up";
    }
  }

  showErrMessage(text: string): void {
    const elem = document.getElementById('form__error') as HTMLElement;
    elem.innerText = text;
    elem.style.display = 'block';
  }
}

export default Auth;
