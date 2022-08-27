import './textbookPage.css';
import { CardOptions, Word } from '../../shared/types';
import BaseComponent from '../baseComponent/baseComponent';
import Card from '../card/card';

class TextbookPage extends BaseComponent {
  inner = `
        <div class="container textbook">
          <div class="textbook__games">
            <a href="" class="game-card game-card_audio">
              <img src="./assets/icons/audiochallenge.png" alt="audio-game" class="game-card__img">
              <span class="game-card__name">Аудиовызов</span>
            </a>
            <a href="" class="game-card game-card_sprint">
              <img src="./assets/icons/sprint.png" alt="sprint-game" class="game-card__img">
              <span class="game-card__name">Спринт</span>
            </a>
          </div>
          <div class="textbook__level">
            <h3 class="textbook__level-title">Выберите раздел:</h3>
            <div class="textbook__level-buttons">
              <button class="textbook__button button_level button_level-a1">A1</button>
              <button class="textbook__button button_level button_level-a2">A2</button>
              <button class="textbook__button button_level button_level-b1">B1</button>
              <button class="textbook__button button_level button_level-b2">B2</button>
              <button class="textbook__button button_level button_level-c1">C1</button>
              <button class="textbook__button button_level button_level-c2">C2</button>
              <button class="textbook__button button_difficult">Сложные слова</button>
            </div>
          </div>
          <div class="textbook__cards"></div>
          <div class="textbook__pagination-buttons">
            <button disabled class="textbook__button button_transparent button_start">&lt;&lt;</button>
            <button disabled class="textbook__button button_transparent button_prev">&lt;</button>
            <button class="textbook__button button_transparent button_number">1</button>
            <button class="textbook__button button_transparent button_next">&gt;</button>
            <button class="textbook__button button_transparent button_end">&gt;&gt;</button>
          </div>
        </div>`;

  constructor() {
    super('main', 'main main-textbook', 'textbook');
  }

  drawCards(data: Word[], userState?: boolean): void {
    const cards: HTMLElement | null = document.querySelector('.textbook__cards');
    let options: CardOptions;
    if (userState) options = { isDifficult: false, isStudied: false };
    if (cards) {
      const _ = data.map((item) => new Card(cards, item, options));
    }
    const textbook = document.getElementById('textbook') as HTMLElement;
    textbook.style.backgroundColor = '';
  }
}

export default TextbookPage;
