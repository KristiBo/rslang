import './cards.css';
import URL from '../../shared/constants';
import Img from '../../shared/img';
import NewElem from '../../shared/newelem';
import { Word, CardOptions, ICON } from '../../shared/types';
import Button from '../../shared/button';
import Sound from '../../shared/sound';
import SVG from '../../shared/svgLib';

// type for unused variables
type Unused = NewElem | Img | Button;

class Card extends NewElem {
  // current audio id
  audioId: number;

  // audio playing state
  isPlaying: boolean;

  // storage for audio
  allAudio: Sound[];

  // click event place for audio
  speaker: NewElem;

  // node: parent node
  // word: Word object
  // options: exist only for known users, contain bool flags
  // -- isDifficult: for difficult word,
  // -- isStudied: for studied word
  constructor(node: HTMLElement, word: Word, options?: CardOptions) {
    // known user, styling card according the options
    let cardStyle = '';
    if (options) {
      cardStyle = `${options.isDifficult ? ' difficult' : ''}${options.isStudied ? ' studied' : ''}`;
    }

    super(node, 'div', `card${cardStyle}`);

    const imgBlock = new NewElem(this.elem, 'div', 'card__img-wrapper');
    let _: Unused = new Img(imgBlock.elem, 'card__img', `${URL}${word.image}`, word.word);
    const cardCont = new NewElem(this.elem, 'div', 'card__content');

    const cardItemWord = new NewElem(cardCont.elem, 'div', 'card__item word-content');

    const wordBlock = new NewElem(cardItemWord.elem, 'div', 'word-content__word-wrapper word-wrapper');
    _ = new NewElem(wordBlock.elem, 'span', 'word-wrapper__word', word.word);
    _ = new NewElem(wordBlock.elem, 'span', 'word-wrapper__transcription', word.transcription);
    _ = new NewElem(cardItemWord.elem, 'div', 'word-content__translation', word.wordTranslate);

    this.speaker = new NewElem(cardItemWord.elem, 'div', 'word-content__audio-block');
    this.speaker.elem.innerHTML = this.speakerSVG();

    this.allAudio = [];
    this.allAudio.push(new Sound(this.speaker.elem, 'audio-block__audio', `${URL}${word.audio}`));
    this.allAudio.push(new Sound(this.speaker.elem, 'audio-block__audio', `${URL}${word.audioMeaning}`));
    this.allAudio.push(new Sound(this.speaker.elem, 'audio-block__audio', `${URL}${word.audioExample}`));

    const cardItemMeaning = new NewElem(cardCont.elem, 'div', 'card__item meaning');
    _ = new NewElem(cardItemMeaning.elem, 'div', 'meaning__en', word.textMeaning);
    _ = new NewElem(cardItemMeaning.elem, 'div', 'meaning__ru', word.textMeaningTranslate);

    const cardItemExample = new NewElem(cardCont.elem, 'div', 'card__item example');
    _ = new NewElem(cardItemExample.elem, 'div', 'example__en', word.textExample);
    _ = new NewElem(cardItemExample.elem, 'div', 'example__ru', word.textExampleTranslate);

    // known user, show buttons
    if (options) {
      const cardItemBtns = new NewElem(cardCont.elem, 'div', 'card__item card-btns');
      _ = new Button(
        cardItemBtns.elem,
        'Difficult',
        `btn btn-difficult${options.isDifficult ? ' btn--yellow' : ''}`,
      );
      _ = new Button(
        cardItemBtns.elem,
        'Studied',
        `btn btn-studied${options.isStudied ? ' btn--yellow' : ''}`,
      );
    } else {
      this.isPlaying = false;
    }

    // 0..2 audio id
    this.audioId = 0;
    // isPlaying audio now?
    this.isPlaying = false;
    this.addSpeakerClickListener();
  }

  // Add click listener on speaker icon
  addSpeakerClickListener(): void {
    this.speaker.elem.addEventListener('click', () => this.audioPlay());
  }

  // play audio
  audioPlay(): void {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.allAudio[this.audioId].elem.addEventListener('ended', () => this.audioPrepareNext(), { once: true });
      this.allAudio[this.audioId].run();
    }
  }

  // cycling audio id 0>1>2>0...
  audioPrepareNext(): void {
    this.isPlaying = false;
    this.audioId = (this.audioId === 2 ? 0 : this.audioId + 1);
  }

  removeSpeakerClickListener(): void {
    this.speaker.elem.removeEventListener('click', () => this.audioPlay());
  }

  // return: speaker svg
  speakerSVG(): string {
    const result = SVG(ICON.SPEAKER);
    return result;
  }
}

export default Card;
