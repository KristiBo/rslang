/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
import './audioGame.css';
import {
  Word, ICON, Group,
} from '../../shared/types';
import NewElem from '../../shared/newelem';
import Button from '../../shared/button';
import Sound from '../../shared/sound';
import SVG from '../../shared/svgLib';
import URL from '../../shared/constants';

class AudioGame extends NewElem {
  private gameContainer: HTMLElement;

  private gameDiv: HTMLElement;

  private audioIcon: HTMLElement | null = null;

  private audioElem: Sound | null = null;

  private wordText: HTMLElement | null = null;

  private counter: HTMLElement | null = null;

  private answerButtonsContainer: HTMLElement | null = null;

  private answerBtns: HTMLButtonElement[] = [];

  private nextButton: HTMLButtonElement | null = null;

  private words: string[][] = [];

  private initialWords: Word[] = [];

  private wordIdx = 0;

  private indexOfRightAnswer = 0;

  private counterNumber = 20;

  private gameStatus = 'waiting';

  private sound: Group<Sound>;

  constructor(node: HTMLElement) {
    super(node, 'div', 'audiocall');
    this.gameContainer = new NewElem(this.elem, 'div', 'audio-game-container').elem;
    this.gameDiv = new NewElem(this.gameContainer, 'div', 'audio-game').elem;
    this.sound = {
      click: new Sound(this.gameDiv, 'window__audio audio_click', './assets/audio/click.mp3'),
      start: new Sound(this.gameDiv, 'window__audio audio_start', './assets/audio/start.mp3'),
      right: new Sound(this.gameDiv, 'window__audio audio_right', './assets/audio/right.mp3'),
      wrong: new Sound(this.gameDiv, 'window__audio audio_wrong', './assets/audio/wrong.mp3'),
      end: new Sound(this.gameDiv, 'window__audio audio_end', './assets/audio/end.mp3'),
    };
    this.drawStartCountdown();
  }

  private startGame(): void {
    const closeBtn = new NewElem(this.gameDiv, 'div', 'audio-game__close').elem;
    closeBtn.innerHTML = `<a href="#/games">${SVG(ICON.CLOSE)}</a>`;
    this.audioIcon = new NewElem(this.gameDiv, 'div', 'audio-game__icon').elem;
    this.audioElem = new Sound(this.audioIcon, 'audio-game__sound', `${URL}${null}`);
    this.initAudioListener(this.audioIcon, this.audioElem);
    const audioSvg = new NewElem(this.audioIcon, 'div', 'audio-game__svg').elem;
    audioSvg.innerHTML = SVG(ICON.SPEAKER);
    this.wordText = new NewElem(this.gameDiv, 'div', 'audio-game__word').elem;
    const counterDiv = new NewElem(this.gameDiv, 'div', 'audio-game__counter-wrapper').elem;
    this.counter = new NewElem(counterDiv, 'div', 'audio-game__counter').elem;
    this.answerButtonsContainer = new NewElem(this.gameDiv, 'div', 'audio-game__buttons').elem;
    const amountOfAnswers = 5;
    for (let i = 0; i < amountOfAnswers; i += 1) {
      const btn = new Button(this.answerButtonsContainer, 'button', 'button-light audio-game__button').elem;
      btn.id = `${i + 1}`;
      this.answerBtns?.push(btn);
    }
    this.nextButton = new Button(this.gameDiv, 'button', 'button').elem;
    this.nextButton.textContent = "I don't know";
    this.drawWord();
    this.initListenersAnswer();
    this.initKeyboardListeners();
    this.initListenerNextBtn();
  }

  setWords(words: Word[]): void {
    this.initialWords = words;
    const wordsArray = words.map((item) => [item.wordTranslate, item.audio, item.word, '']);
    wordsArray.sort(() => Math.random() - 0.5).length = 20; // shuffle array
    this.words = wordsArray;
  }

  private countdown(node: HTMLElement, time: number, callback: () => void): void {
    const elem = node;
    elem.textContent = `${time}`;
    const nextTime = time - 1;
    setTimeout(() => {
      if (nextTime) {
        this.countdown(node, nextTime, callback);
      } else {
        elem.remove();
        callback();
      }
    }, 1000);
  }

  private drawStartCountdown(): void {
    const counter = new NewElem(this.gameDiv, 'p', 'window__counter counter_begin').elem;
    this.sound.start.run();
    this.countdown(counter, 1, () => this.startGame());
  }

  private drawWord(): void {
    this.gameStatus = 'waiting';
    this.initListenersAnswer();
    this.initKeyboardListeners();
    (this.counter as HTMLElement).textContent = `${this.counterNumber}`;
    this.counterNumber -= 1;
    (this.nextButton as HTMLButtonElement).textContent = "I don't know";
    (this.wordText as HTMLElement).innerText = '';
    const set = new Set();
    const amountOfAnswers = 5;
    this.indexOfRightAnswer = Math.floor(Math.random() * (5 - 0)) + 0;
    while (set.size < amountOfAnswers) {
      const randomNumber = Math.floor(Math.random() * (this.words.length - 0)) + 0;
      if (randomNumber !== this.wordIdx) {
        set.add(randomNumber);
      }
    }
    const arrayOfIncorrectIndexes = [...set.keys()];
    if (this.wordIdx < this.words.length) {
      if (this.audioElem) {
        this.audioElem.elem.src = `${URL}${this.words[this.wordIdx][1]}`;
        this.audioElem.run();
      }
      this.answerBtns.forEach((btn, index) => {
        btn.disabled = false;
        btn.classList.remove('correct', 'incorrect');
        if (index === this.indexOfRightAnswer) {
          btn.textContent = this.words[this.wordIdx][0];
        } else {
          const indexOfIncorrectAnswer = arrayOfIncorrectIndexes.pop() as number;
          btn.textContent = this.words[indexOfIncorrectAnswer][0];
        }
      });
    } else {
      this.endGame();
    }
  }

  private checkAnswer(btn: HTMLButtonElement): void {
    this.gameStatus = 'done';
    if (btn.textContent === this.words[this.wordIdx][0]) {
      btn.classList.add('correct');
      this.sound.right.run();
      this.words[this.wordIdx][3] = 'right';
    } else {
      btn.classList.add('incorrect');
      this.answerBtns[this.indexOfRightAnswer].classList.add('correct');
      this.sound.wrong.run();
      this.words[this.wordIdx][3] = 'wrong';
    }
    this.answerBtns.forEach((button) => {
      button.disabled = true;
    });
    window.removeEventListener('keyup', this.answerKeyboardHandler);
    (this.nextButton as HTMLButtonElement).textContent = 'Next word';
    (this.wordText as HTMLElement).innerText = `${this.words[this.wordIdx][2]}`;
  }

  private initListenersAnswer(): void {
    const answerBtnsHandler = (e: Event) => {
      const btn = e.target as HTMLButtonElement;
      this.checkAnswer(btn);
    };

    this.answerBtns?.forEach((btn) => {
      btn.addEventListener('click', answerBtnsHandler);
    });
  }

  answerKeyboardHandler(e: KeyboardEvent): void {
    if (this.gameStatus === 'waiting') {
      const buttons = document.querySelectorAll('.audio-game__button');
      for (let i = 1; i <= 5; i += 1) {
        if (e.key === `${i}`) {
          buttons.forEach((btn) => {
            const button = btn as HTMLButtonElement;
            if (btn.id === e.key) {
              this.checkAnswer(button);
            }
          });
        }
      }
    }
  }

  private initKeyboardListeners(): void {
    window.addEventListener('keyup', this.answerKeyboardHandler.bind(this));
  }

  private showCorrectAnswer(): void {
    this.answerBtns.forEach((btn) => {
      if (btn.textContent === this.words[this.wordIdx][0]) btn.classList.add('correct');
      btn.disabled = true;
    });
    (this.nextButton as HTMLButtonElement).textContent = 'Next word';
  }

  private nextButtonHandler(e: Event): void {
    const btn = e.target as HTMLButtonElement;
    if (btn.textContent === "I don't know") {
      this.gameStatus = 'done';
      this.sound.click.run();
      (this.wordText as HTMLElement).innerText = `${this.words[this.wordIdx][2]}`;
      this.showCorrectAnswer();
      this.words[this.wordIdx][3] = 'wrong';
    } else {
      this.wordIdx += 1;
      this.drawWord();
    }
  }

  private initListenerNextBtn(): void {
    this.nextButton?.addEventListener('click', this.nextButtonHandler.bind(this));
  }

  private initAudioListener(elem: HTMLElement, snd: Sound): void {
    elem.addEventListener('click', () => snd.run());
  }

  private endGame(): void {
    const rightAnswers = this.words.filter((item) => item[3] === 'right').length;
    const wrongAnswers = this.words.filter((item) => item[3] === 'wrong').length;
    this.sound.end.run();
    let _: HTMLElement;
    this.gameDiv.innerHTML = '';
    this.gameDiv.classList.add('nogap');
    const resTable = new NewElem(this.gameDiv, 'div', 'window__table').elem;
    if (rightAnswers) {
      _ = new NewElem(resTable, 'div', 'table__header header_right', `Правильных ответов: ${rightAnswers}`).elem;
      this.words.forEach((item, index) => {
        if (this.words[index][3] === 'right') {
          this.drawTableRow(resTable, index, 'row_green');
        }
      });
    }
    if (wrongAnswers) {
      _ = new NewElem(resTable, 'div', 'table__header header_wrong', `Неправильных ответов: ${wrongAnswers}`).elem;
      this.words.forEach((item, index) => {
        if (this.words[index][3] === 'wrong') {
          this.drawTableRow(resTable, index, 'row_red');
        }
      });
    }
    const resBtn = new Button(this.gameDiv, 'Играть заново', 'window__btn btn btn_replay').elem;
    this.dispatchGameStatisticEvent();
    this.initReplayListener(resBtn);
  }

  private dispatchGameStatisticEvent(): void {
    const game = 'sprint';
    const words = this.words;
    const event = new CustomEvent('gameStatistic', { detail: { game, words } });
    document.dispatchEvent(event);
  }

  private initReplayListener(elem: HTMLElement): void {
    elem.addEventListener('click', () => {
      this.sound.click.run();
      this.setWords(this.initialWords);
      this.initValues();
      this.gameDiv.classList.remove('nogap');
      this.drawStartCountdown();
    });
  }

  private initValues(): void {
    // remove non-audio content
    for (let i = this.gameDiv.childNodes.length - 1; i >= 0; i -= 1) {
      if (this.gameDiv.childNodes[i].nodeName !== 'AUDIO') this.gameDiv.childNodes[i].remove();
    }
    this.wordIdx = 0;
    this.indexOfRightAnswer = 0;
    this.counterNumber = 20;
    this.answerBtns = [];
  }

  private drawTableRow(node: HTMLElement, index: number, css: string): void {
    const row = new NewElem(node, 'div', `table__row ${css}`).elem;
    // audio cell
    const audioDiv = new NewElem(row, 'div', 'row__audio').elem;
    audioDiv.innerHTML = SVG(ICON.SPEAKER);
    const snd = new Sound(audioDiv, 'audio__sound', `${URL}${this.words[index][1]}`);
    this.initAudioListener(audioDiv, snd);
    // word & translation cells
    let _ = new NewElem(row, 'div', 'row__word', `${this.words[index][2]}`).elem;
    _ = new NewElem(row, 'div', 'row__translation', `${this.words[index][0]}`).elem;
  }
}

export default AudioGame;
