import './gamesChooseLevel.css';
import BaseComponent from '../baseComponent/baseComponent';
import { GAME, PAGE } from '../../shared/types';
import NewElem from '../../shared/newelem';
import Link from '../../shared/link';

class GamesChooseLevel extends BaseComponent {
  inner = '';

  constructor() {
    super('main', ['main'], 'games');
  }

  draw(game: GAME): void {
    this.create();
    let _: NewElem | Link = new NewElem(this.container, 'h2', 'main__title', game === GAME.SPRINT ? 'Спринт' : 'Аудиовызов');
    _ = new NewElem(this.container, 'div', 'game__info', this.getGameInfo(game));
    _ = new NewElem(this.container, 'div', 'game__lvl-header', 'Выберите уровень сложности:');
    const gameDiv = new NewElem(this.container, 'div', 'game__lvl-content').elem;
    for (let i = 1; i < 7; i += 1) {
      _ = new Link(gameDiv, `lvl-content__link game__btn btn link_${i}`, `/#/${PAGE.GAMES}/${game}/${i}`, `${i}`);
    }
  }

  getGameInfo(game: GAME): string {
    let result = '';
    switch (game) {
      case GAME.SPRINT:
        result = `
          описание спринта
        `;
        break;
      case GAME.AUDIOCALL:
        result = `<h2>«Аудиовызов» - это тренировка, которая улучшает восприятие речи на слух.</h2>

        <p>1) Используйте мышь, чтобы выбрать.</p>

        <p>2) Используйте цифровые клавиши от 1 до 5 для выбора ответа</p>

        <p>3) Используйте пробел для повторного звучания слова</p>

        <p>4) Используйте клавишу Enter для подсказки или для перехода к следующему слову</p>
        `;
        break;
      default:
      // empty
    }
    return result;
  }
}

export default GamesChooseLevel;
