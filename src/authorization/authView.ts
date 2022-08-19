export default function renderAuthPage(): string {
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
