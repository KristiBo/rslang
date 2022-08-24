import BaseComponent from '../baseComponent/baseComponent';
import './audioGame.css';

class AudioGame extends BaseComponent {
  inner = `
  <div class="audio-game">
    <div class="levels">
      <h2 class="levels__title">Audio challenge</h2>
      <p class="levels__subtitle">Select the Level</p>
      <div class="levels__buttons" id="levels-buttons">
        <button class="button-sm">1</button>
        <button class="button-sm">2</button>
        <button class="button-sm">3</button>
        <button class="button-sm">4</button>
        <button class="button-sm">5</button>
        <button class="button-sm">6</button>
      </div>
      <a href="#/games" class="button-light">Back to games</a>
    </div>
  </div>
  `;

  constructor() {
    super('main', ['main'], 'audio-challenge');
  }

  addListeners(): void {
    const levelsButtons = document.querySelectorAll('.button-sm');
    levelsButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        console.log(btn.textContent);
      });
    });
  }
}

export default AudioGame;
