import BaseComponent from '../baseComponent/baseComponent';

class GamesPage extends BaseComponent {
  inner = '<h2 class="main__title">Игры</h2>';

  constructor() {
    super('main', 'main', 'games');
  }
}

export default GamesPage;
