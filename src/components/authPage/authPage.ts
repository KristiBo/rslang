import BaseComponent from '../baseComponent/baseComponent';

class AuthPage extends BaseComponent {
  inner = '<h2 class="main__title">Авторизация</h2>';

  constructor() {
    super('main', ['main'], 'authorization');
  }
}

export default AuthPage;
