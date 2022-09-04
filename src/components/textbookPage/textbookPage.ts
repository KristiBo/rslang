import './textbookPage.css';
import { CardOptions, Word } from '../../shared/types';
import BaseComponent from '../baseComponent/baseComponent';
import Card from '../card/card';

// TODO: show 7th group for known user
class TextbookPage extends BaseComponent {
  inner = `
        <div class="container textbook">
        <div class="textbook__games">
            <a href="#/games/audiocall" class="game-card game-card_audio">
              <img src="./assets/icons/audiochallenge.png" alt="audio-game" class="game-card__img">
              <span class="game-card__name">Аудиовызов</span>
            </a>
            <a href="#/games/sprint" class="game-card game-card_sprint">
              <img src="./assets/icons/sprint.png" alt="sprint-game" class="game-card__img">
              <span class="game-card__name">Спринт</span>
            </a>
          </div>
          <div class="textbook__level">
            <h3 class="textbook__level-title">Выберите  уровень сложности:</h3>
            <div class="textbook__level-buttons">
              <a class="textbook__button button_level button_level-1" href="/#/textbook/1">1</a>
              <a class="textbook__button button_level button_level-2" href="/#/textbook/2">2</a>
              <a class="textbook__button button_level button_level-3" href="/#/textbook/3">3</a>
              <a class="textbook__button button_level button_level-4" href="/#/textbook/4">4</a>
              <a class="textbook__button button_level button_level-5" href="/#/textbook/5">5</a>
              <a class="textbook__button button_level button_level-6" href="/#/textbook/6">6</a>
              <a class="textbook__button button_level button_difficult hide" href="/#/textbook/7">Сложные слова</a>
            </div>
          </div>
          <div class="textbook__cards"></div>
          <div class="textbook__pagination-buttons">
            <a class="textbook__button button_transparent button_start" href="/#/textbook/1/1">&lt;&lt;</a>
            <a class="textbook__button button_transparent button_prev" href="/#/textbook/1/1">&lt;</a>
            <a class="textbook__button button_transparent button_number" onclick="return false;">1</a>
            <a class="textbook__button button_transparent button_next" href="/#/textbook/1/2">&gt;</a>
            <a class="textbook__button button_transparent button_end" href="/#/textbook/1/30">&gt;&gt;</a>
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
  }

  setPagination(grp: number, pg: number): void {
    // in DB group and page start from 0
    const group = grp + 1;
    const page = pg + 1;
    // for elements created from html template
    const btnStart = <HTMLLinkElement>document.querySelector('.button_start');
    const btnPrev = <HTMLLinkElement>document.querySelector('.button_prev');
    const btnPgNum = <HTMLLinkElement>document.querySelector('.button_number');
    const btnNext = <HTMLLinkElement>document.querySelector('.button_next');
    const btnEnd = <HTMLLinkElement>document.querySelector('.button_end');
    const levelBtns = document.querySelectorAll('.button_level');

    btnPgNum.textContent = `${page}`;
    if (page === 1) {
      btnStart.classList.add('button_disabled');
      btnPrev.classList.add('button_disabled');
    }
    if (page === 30) {
      btnNext.classList.add('button_disabled');
      btnEnd.classList.add('button_disabled');
    }
    btnStart.href = `/#/textbook/${group}/1`;
    btnPrev.href = `/#/textbook/${group}/${page - 1}`;
    btnNext.href = `/#/textbook/${group}/${page + 1}`;
    btnEnd.href = `/#/textbook/${group}/30`;
    this.goToGame(group);
    levelBtns.forEach((elem) => {
      elem.classList.remove('active');
      if (elem.innerHTML === `${group}`) {
        elem.classList.add('active');
      }
    });
  }

  goToGame(grp: number): void {
    const audiocall = <HTMLLinkElement>document.querySelector('.game-card_audio');
    const sprint = <HTMLLinkElement>document.querySelector('.game-card_sprint');
    audiocall.href = `#/games/audiocall/${grp}`;
    sprint.href = `#/games/sprint/${grp}`;
  }
}

export default TextbookPage;
