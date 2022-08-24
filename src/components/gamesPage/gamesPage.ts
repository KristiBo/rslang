import BaseComponent from '../baseComponent/baseComponent';
import './gamesPage.css';

class GamesPage extends BaseComponent {
  inner = `
  <div class="games-container">
    <a href="#/audio-challenge" class="button">Audio challenge</a>
    <a class="button">Sprint</a>
  </div>
  `;

  constructor() {
    super('main', ['main'], 'games');
  }
}

export default GamesPage;
