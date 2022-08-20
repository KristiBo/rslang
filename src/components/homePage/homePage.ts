import BaseComponent from '../baseComponent/baseComponent';

class HomePage extends BaseComponent {
  inner = '<h2 class="main__title">Главная страница</h2>';

  constructor() {
    super('main', ['main'], 'home');
  }
}

export default HomePage;
