import BaseComponent from '../baseComponent/baseComponent';

class ErrorPage extends BaseComponent {
  inner = '<h2 class="main__title">Сраница не найдена!</h2>';

  constructor() {
    super('main', ['main'], 'home');
  }
}

export default ErrorPage;
