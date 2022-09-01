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

  private counter: HTMLElement | null = null;

  private answerButtonsContainer: HTMLElement | null = null;

  private answerBtns: HTMLButtonElement[] = [];

  private nextButton: HTMLButtonElement | null = null;

  private words: string[][] = [];

  private wordIdx = 0;

  private indexOfRightAnswer = 0;

  private counterNumber = 20;

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
    closeBtn.innerHTML = SVG(ICON.CLOSE);
    this.audioIcon = new NewElem(this.gameDiv, 'div', 'audio-game__icon').elem;
    this.audioElem = new Sound(this.audioIcon, 'audio-game__sound', `${URL}${null}`);
    this.initAudioListener(this.audioIcon, this.audioElem);
    const audioSvg = new NewElem(this.audioIcon, 'div', 'audio-game__svg').elem;
    audioSvg.innerHTML = SVG(ICON.SPEAKER);
    const counterDiv = new NewElem(this.gameDiv, 'div', 'audio-game__counter-wrapper').elem;
    this.counter = new NewElem(counterDiv, 'div', 'audio-game__counter').elem;
    this.answerButtonsContainer = new NewElem(this.gameDiv, 'div', 'audio-game__buttons').elem;
    const amountOfAnswers = 5;
    for (let i = 0; i < amountOfAnswers; i += 1) {
      const btn = new Button(this.answerButtonsContainer, 'button', 'button-light').elem;
      this.answerBtns?.push(btn);
    }
    this.nextButton = new Button(this.gameDiv, 'button', 'button').elem;
    this.nextButton.textContent = "I don't know";
    this.drawWord();
    this.initListenersAnswer();
    this.initListenerNextBtn();
  }

  setWords(words: Word[]): void {
    const wordsArray = words.map((item) => [item.wordTranslate, item.audio]);
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

  // private initValues(): void {
  //   // remove non-audio content
  //   for (let i = this.gameDiv.childNodes.length - 1; i >= 0; i -= 1) {
  //     if (this.gameDiv.childNodes[i].nodeName !== 'AUDIO') this.gameDiv.childNodes[i].remove();
  //   }
  //   this.wordIdx = 0;
  // }

  private drawStartCountdown(): void {
    const counter = new NewElem(this.gameDiv, 'p', 'window__counter counter_begin').elem;
    this.sound.start.run();
    this.countdown(counter, 1, () => this.startGame());
  }

  private drawWord(): void {
    this.initListenersAnswer();
    (this.counter as HTMLElement).textContent = `${this.counterNumber}`;
    this.counterNumber -= 1;
    (this.nextButton as HTMLButtonElement).textContent = "I don't know";
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
      console.log('game end');
    }
  }

  private initListenersAnswer(): void {
    const answerBtnsHandler = (e: Event) => {
      const btn = e.target as HTMLButtonElement;
      if (btn.textContent === this.words[this.wordIdx][0]) {
        btn.classList.add('correct');
        this.sound.right.run();
      } else {
        btn.classList.add('incorrect');
        this.answerBtns[this.indexOfRightAnswer].classList.add('correct');
        this.sound.wrong.run();
      }
      this.answerBtns.forEach((button) => {
        button.disabled = true;
      });
      (this.nextButton as HTMLButtonElement).textContent = 'Next word';
    };

    this.answerBtns?.forEach((btn) => {
      btn.addEventListener('click', answerBtnsHandler);
    });
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
      this.sound.click.run();
      this.showCorrectAnswer();
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
}

export default AudioGame;
