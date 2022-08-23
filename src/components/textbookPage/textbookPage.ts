import { CardOptions, Word } from '../../shared/types';
import BaseComponent from '../baseComponent/baseComponent';
import Card from '../card/card';

class TextbookPage extends BaseComponent {
  inner = '<h2 class="main__title">Учебник</h2>';

  constructor() {
    super('main', ['main'], 'main');
  }

  drawCards(data: Word[], userState?: boolean): void {
    let options: CardOptions;
    if (userState) options = { isDifficult: false, isStudied: false };
    const _ = data.map((item) => new Card(this.container, item, options));
  }
}

export default TextbookPage;
