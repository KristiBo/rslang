import { Word } from '../../shared/types';
import NewElem from '../../shared/newelem';

class Sprint extends NewElem {
  constructor(node: HTMLElement, words: Word[]) {
    super(node, 'div', 'sprint');
    console.log(words.length);
    this.initListeners();
  }

  // init listeners
  initListeners(): void {
    console.log(1);
    // this.elem.addEventListener('click', (e: Event) => this.onClick(e));
    window.addEventListener('keyup', (e: KeyboardEvent) => this.onKeyPress(e));
  }

  // check: if click on shadow do close
  // onClick(e: Event): void {
  //   const { classList } = (<HTMLElement>e.target);
  //   if (classList.contains('modal__shadow')) {
  //     this.destroy();
  //   }
  // }

  // check: if Left or Right key pressed
  onKeyPress(e: KeyboardEvent): void {
    if (e.key === 'ArrowLeft') {
      console.log(e.key);
    }
    if (e.key === 'ArrowRight') {
      console.log(e.key);
    }
  }
}

export default Sprint;
