import TextbookPage from './textbookPage';
import {
  englishLevels,
  INITIAL_PAGE_NR,
  LAST_PAGE_NR,
  pageColors,
} from '../../shared/constants';

class Pagination {
  pageNr: number;

  groupNr: number;

  book: TextbookPage;

  constructor() {
    this.pageNr = INITIAL_PAGE_NR;
    this.groupNr = 0;
    this.book = new TextbookPage();
  }

  getActiveNextBtn(): void {
    const btnNext = document.querySelector('.button_next') as HTMLButtonElement;
    const btnEnd = document.querySelector('.button_end') as HTMLButtonElement;
    btnNext.disabled = false;
    btnEnd.disabled = false;
  }

  getDisabledNextBtn(): void {
    const btnEnd = document.querySelector('.button_end') as HTMLButtonElement;
    const btnNext = document.querySelector('.button_next') as HTMLButtonElement;
    btnNext.disabled = true;
    btnEnd.disabled = true;
  }

  getActivePrevBtn(): void {
    const btnStart = document.querySelector('.button_start') as HTMLButtonElement;
    const btnPrev = document.querySelector('.button_prev') as HTMLButtonElement;
    btnStart.disabled = false;
    btnPrev.disabled = false;
  }

  getDisabledPrevBtn(): void {
    const btnStart = document.querySelector('.button_start') as HTMLButtonElement;
    const btnPrev = document.querySelector('.button_prev') as HTMLButtonElement;
    btnStart.disabled = true;
    btnPrev.disabled = true;
  }

  changePageNumber(): void {
    const btnNumber = document.querySelector('.button_number') as HTMLButtonElement;
    btnNumber.textContent = `${this.pageNr}`;
  }

  getPageNr(): number {
    const page = this.pageNr - 1;
    return page;
  }

  changeBcgColor(): void {
    const textbook = document.getElementById('textbook') as HTMLElement;
    const color = pageColors[this.groupNr];
    textbook.style.backgroundColor = color;
  }

  goToFirstPage(): void {
    this.pageNr = INITIAL_PAGE_NR;
    this.changePageNumber();
    this.getDisabledPrevBtn();
    this.getActiveNextBtn();
  }

  goToLastPage(): void {
    this.pageNr = LAST_PAGE_NR;
    this.changePageNumber();
    this.getActivePrevBtn();
    this.getDisabledNextBtn();
  }

  goToNextPage(): void {
    this.pageNr += 1;
    this.changePageNumber();
    if (this.pageNr >= LAST_PAGE_NR) {
      this.getDisabledNextBtn();
    }
    this.getActivePrevBtn();
  }

  goToPrevPage(): void {
    this.pageNr -= 1;
    this.changePageNumber();
    if (this.pageNr <= INITIAL_PAGE_NR) {
      this.getDisabledPrevBtn();
    }
    this.getActiveNextBtn();
  }

  addListenersToBtns(callback: () => void): void {
    const btnStart = document.querySelector('.button_start') as HTMLButtonElement;
    const btnPrev = document.querySelector('.button_prev') as HTMLButtonElement;
    const btnNext = document.querySelector('.button_next') as HTMLButtonElement;
    const btnEnd = document.querySelector('.button_end') as HTMLButtonElement;
    const levelBtns = document.querySelectorAll('.button_level');
    levelBtns.forEach((el) => {
      el.addEventListener('click', () => {
        this.groupNr = englishLevels.indexOf(el.innerHTML);
        callback();
        levelBtns.forEach((elem) => elem.classList.remove('active'));
        el.classList.add('active');
      });
    });
    btnNext.addEventListener('click', () => {
      this.goToNextPage();
      callback();
    });
    btnPrev.addEventListener('click', () => {
      this.goToPrevPage();
      callback();
    });
    btnEnd.addEventListener('click', () => {
      this.goToLastPage();
      callback();
    });
    btnStart.addEventListener('click', () => {
      this.goToFirstPage();
      callback();
    });
  }
}

export default Pagination;
