import BaseComponent from '../baseComponent/baseComponent';
import Sprint from '../sprint/sprint';
import { Word } from '../../shared/types';

class GamesPage extends BaseComponent {
  private userState = false;

  inner = `<h2 class="main__title">Игры</h2>
    <div class="game__btns" >
      <button class="game__btn btn btn_audiocall" id="btn-audiocall">AudioCall</button>
      <button class="game__btn btn btn_sprint" id="btn-sprint">Sprint</button>
    </div>
    <div class="game__container"></div >
    `;

  constructor(userState: boolean) {
    super('main', ['main'], 'games');
    this.userState = userState;
  }

  initListeners(): void {
    const btnAudioCall = <HTMLElement>document.querySelector('.btn_audiocall');
    btnAudioCall.addEventListener('click', () => this.onAudioCallClick());
    const btnSprint = <HTMLElement>document.querySelector('.btn_sprint');
    btnSprint.addEventListener('click', () => this.onSprintClick());
  }

  onAudioCallClick(): void {
    console.log('AudioCall click');
  }

  onSprintClick(): void {
    console.log('Sprint click');
    this.dispatchSprintStartEvent();
  }

  dispatchSprintStartEvent(): void {
    const event = new CustomEvent('startSprint', { detail: { runFrom: 'games' } });
    document.dispatchEvent(event);
  }

  drawSprint(words: Word[]): void {
    this.container.innerHTML = '';
    const sprint = new Sprint(this.container);
    sprint.setWords(words);
  }

  setUserState(userState: boolean): void {
    this.userState = userState;
  }
}

export default GamesPage;
