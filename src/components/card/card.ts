import URL from '../../shared/constants';
import Img from '../../shared/img';
import NewElem from '../../shared/newelem';
import { Word, CardOptions } from '../../shared/types';
import Button from '../../shared/button';
import Sound from '../../shared/sound';

// alternative for eslint-disable-next-line @typescript-eslint/no-unused-vars
type Dummy = NewElem | Img | Button;
const unused: Dummy[] = [];

class Card extends NewElem {
  // storage for audio
  allAudio: Sound[];

  // node: parent node
  // word: Word object
  // options: exist only for known users, contain bool flags
  // -- isDifficult: for difficult word,
  // -- isStudied: for studied word
  constructor(node: HTMLElement, word: Word, options?: CardOptions) {
    super(node, 'div', 'card');

    const imgBlock = new NewElem(this.elem, 'div', 'card__img-wrapper');
    unused.push(new Img(imgBlock.elem, 'card__img', `${URL}${word.image}`, word.word));
    const cardCont = new NewElem(this.elem, 'div', 'card__content');

    const cardItemWord = new NewElem(cardCont.elem, 'div', 'card__item word-content');

    const wordBlock = new NewElem(cardItemWord.elem, 'div', 'word-content__word-wrapper word-wrapper');
    unused.push(new NewElem(wordBlock.elem, 'span', 'word-wrapper__word', word.word));
    unused.push(new NewElem(wordBlock.elem, 'span', 'word-wrapper__transcription', word.transcription));
    unused.push(new NewElem(cardItemWord.elem, 'div', 'word-content__translation', word.wordTranslate));

    const audioBlock = new NewElem(cardItemWord.elem, 'div', 'word-content__audio-block');
    audioBlock.elem.innerHTML = ''; // TODO: add speaker icon

    this.allAudio = [];
    this.allAudio.push(new Sound(audioBlock.elem, 'audio-block__audio', `${URL}${word.audio}`));
    this.allAudio.push(new Sound(audioBlock.elem, 'audio-block__audio', `${URL}${word.audioMeaning}`));
    this.allAudio.push(new Sound(audioBlock.elem, 'audio-block__audio', `${URL}${word.audioExample}`));

    const cardItemMeaning = new NewElem(cardCont.elem, 'div', 'card__item meaning');
    unused.push(new NewElem(cardItemMeaning.elem, 'div', 'meaning__en', word.textMeaning));
    unused.push(new NewElem(cardItemMeaning.elem, 'div', 'meaning__ru', word.textMeaningTranslate));

    const cardItemExample = new NewElem(cardCont.elem, 'div', 'card__item example');
    unused.push(new NewElem(cardItemExample.elem, 'div', 'example__en', word.textExample));
    unused.push(new NewElem(cardItemExample.elem, 'div', 'example__ru', word.textExampleTranslate));
  }
}

export default Card;
