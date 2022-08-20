import BaseComponent from '../baseComponent/baseComponent';

class TextbookPage extends BaseComponent {
  inner = '<h2 class="main__title">Учебник</h2>';

  constructor() {
    super('main', 'main', 'textbook');
  }
}

export default TextbookPage;
