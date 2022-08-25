import './textbookPage.css';
import { CardOptions, Word } from '../../shared/types';
import BaseComponent from '../baseComponent/baseComponent';
import Card from '../card/card';

class TextbookPage extends BaseComponent {
  inner = `
        <div class="container textbook">
          <div class="textbook__english-lvl">
            <h2>Уровень</h2>
            <button class="textbook__button button_level">1</button>
            <button class="textbook__button button_level">2</button>
            <button class="textbook__button button_level">3</button>
            <button class="textbook__button button_level">4</button>
            <button class="textbook__button button_level">5</button>
            <button class="textbook__button button_level">6</button>
            <button class="textbook__button button_level">7</button>
          </div>
          <div class="textbook__cards"></div>
          <div class="textbook__pagination-buttons">
            <button disabled class="textbook__button button_transparent button_start">&lt;&lt;</button>
            <button disabled class="textbook__button button_transparent button_prev">&lt;</button>
            <button class="textbook__button button_number">1</button>
            <button class="textbook__button button_transparent button_next">&gt;</button>
            <button class="textbook__button button_transparent button_end">&gt;&gt;</button>
          </div>
        </div>`;

  constructor() {
    super('main', ['main'], 'textbook');
  }

  drawCards(data: Word[], userState?: boolean): void {
    const cards: HTMLElement | null = document.querySelector('.textbook__cards');
    let options: CardOptions;
    if (userState) options = { isDifficult: false, isStudied: false };
    if (cards) {
      const _ = data.map((item) => new Card(cards, item, options));
    }
  }
}

export default TextbookPage;
