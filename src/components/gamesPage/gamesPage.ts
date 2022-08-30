import BaseComponent from '../baseComponent/baseComponent';
import Sprint from '../sprint/sprint';
import { Word } from '../../shared/types';

class GamesPage extends BaseComponent {
  private userState = false;

  inner = `<h2 class="main__title">Игры</h2>
    <div class="game__btns" >
      <a class="game__btn btn btn_audiocall" id="btn-audiocall" href="/#/games/audiocall">AudioCall</a>
      <a class="game__btn btn btn_sprint" id="btn-sprint" href="/#/games/sprint">Sprint</a>
    </div>
    <div class="game__container"></div >
    `;

  constructor(userState: boolean) {
    super('main', ['main'], 'games');
    this.userState = userState;
  }

  drawSprint(words: Word[]): void {
    console.log('s');
    this.container.innerHTML = '';
    const sprint = new Sprint(this.container);
    sprint.setWords(words);
  }
}

export default GamesPage;
